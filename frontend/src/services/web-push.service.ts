import { inject, Injectable } from '@angular/core';
import {
    catchError,
    concat,
    concatWith,
    defer,
    filter,
    first,
    from,
    fromEvent,
    ignoreElements,
    map,
    merge,
    Observable,
    of,
    Subject,
    switchMap,
    throwError,
} from 'rxjs';
import { SwPush } from '@angular/service-worker';
import { environment } from '../environments/environment';
import {
    RegisterPushNotificationsGQL,
    UnregisterPushNotificationsGQL,
    WebPushDeviceFragment,
} from '../generated/graphql';
import { checkNotNull } from '../util/checks';

interface HackySwPush {
    sw: {
        serviceWorker: ServiceWorkerContainer | undefined;
    };
    pushManager: Observable<PushManager> | null;
    subscription: Observable<PushSubscription | null>;
    subscriptionChanges: Subject<PushSubscription | null>;
}

@Injectable({
    providedIn: 'root',
})
export class WebPushService {
    #swPush = inject(SwPush);
    #registerPush = inject(RegisterPushNotificationsGQL);
    #unregisterPush = inject(UnregisterPushNotificationsGQL);

    constructor() {
        this.#fixSwPush();
    }

    get isSupported(): boolean {
        return this.#swPush.isEnabled;
    }

    activatePush(): Observable<WebPushDeviceFragment> {
        return defer(() => {
            return this.#swPush.requestSubscription({
                serverPublicKey: environment.webPushKey,
            });
        }).pipe(
            switchMap((sub) => {
                return this.#registerBackendOrUnsubscribe(sub, true);
            }),
        );
    }

    get currentSubscription(): Observable<WebPushDeviceFragment | null> {
        return this.#swPush.subscription.pipe(
            switchMap((sub) => {
                if (sub == null) {
                    return this.#unregisterBackend();
                } else {
                    return this.#registerBackendOrUnsubscribe(sub);
                }
            }),
        );
    }

    unregister(): Observable<void> {
        return this.#swPush.subscription.pipe(
            first(),
            switchMap((currentSubscription) => this.#unregisterBackend(currentSubscription)),
            ignoreElements(),
            concatWith(defer(() => this.#swPush.unsubscribe())),
            map(() => undefined),
        );
    }

    #unregisterBackend(currentSubscription: PushSubscription | null = null): Observable<null> {
        return this.#unregisterPush
            .mutate({
                input: {
                    endpoint: currentSubscription?.endpoint,
                },
            })
            .pipe(map(() => null));
    }

    #registerBackendOrUnsubscribe(
        subscription: PushSubscription,
        propagateError: true,
    ): Observable<WebPushDeviceFragment>;
    #registerBackendOrUnsubscribe(
        subscription: PushSubscription,
        propagateError?: boolean,
    ): Observable<WebPushDeviceFragment | null>;
    #registerBackendOrUnsubscribe(
        subscription: PushSubscription,
        propagateError = false,
    ): Observable<WebPushDeviceFragment | null> {
        const obs = this.#registerBackend(subscription).pipe(
            catchError((err: unknown) => {
                return from(
                    this.#swPush.unsubscribe().then(
                        () => null,
                        (err: unknown) => {
                            console.error(
                                'SwPush unsubscribe failed after WebPush backend registration error',
                                err,
                            );
                            return null;
                        },
                    ),
                ).pipe(switchMap(() => throwError(() => err)));
            }),
        );
        return propagateError
            ? obs
            : obs.pipe(
                  catchError((err: unknown) => {
                      console.error('Internal error during WebPush backend registration', err);
                      return of(null);
                  }),
              );
    }

    #registerBackend(subscription: PushSubscription): Observable<WebPushDeviceFragment> {
        return defer(() => {
            const p256dh = subscription.getKey('p256dh');
            const auth = subscription.getKey('auth');
            if (p256dh == null || auth == null) {
                throw new Error('Auth or p256dh missing');
            }
            return this.#registerPush
                .mutate({
                    input: {
                        auth: btoa(
                            String.fromCharCode.apply(null, Array.from(new Uint8Array(auth))),
                        ),
                        p256dh: btoa(
                            String.fromCharCode.apply(null, Array.from(new Uint8Array(p256dh))),
                        ),
                        endpoint: subscription.endpoint,
                    },
                })
                .pipe(map((r) => checkNotNull(r.data).registerWebPush));
        });
    }

    #fixSwPush(): void {
        // see https://github.com/angular/angular/issues/48702#issuecomment-1912112624
        if (!this.#swPush.isEnabled) {
            return;
        }
        const swPush = this.#swPush as unknown as HackySwPush;
        const serviceWorker = swPush.sw.serviceWorker;
        if (!serviceWorker) {
            return;
        }

        // Adapted from original code:
        // https://github.com/angular/angular/blob/c3b00959659ca20d3f798820dfcb4dee250a32ac/packages/service-worker/src/low_level.ts#L137
        const controllerChangeEvents = fromEvent(serviceWorker, 'controllerchange');
        const controllerChanges = controllerChangeEvents.pipe(map(() => serviceWorker.controller));
        const currentController = defer(() => [serviceWorker.controller]);

        const registration = concat(
            // The actual fix, here we don't do the falsy filtering for the currentController (as it is null on a hard refresh)
            currentController,
            controllerChanges.pipe(filter(Boolean)),
        ).pipe(
            // Instead just try to get the ServiceWorkerRegistration here
            switchMap(() => serviceWorker.getRegistration()),
            // And filter out any falsy ServiceWorkerRegistration at the end
            filter(Boolean),
        );

        // Adapted from original code:
        // https://github.com/angular/angular/blob/c3b00959659ca20d3f798820dfcb4dee250a32ac/packages/service-worker/src/push.ts#L151
        const pushManager = registration.pipe(map((registration) => registration.pushManager));

        // Overwrite the original pushManager
        swPush.pushManager = pushManager;

        const workerDrivenSubscriptions = pushManager.pipe(switchMap((pm) => pm.getSubscription()));

        // Overwrite the original subscriptionChanges
        swPush.subscription = merge(workerDrivenSubscriptions, swPush.subscriptionChanges);
    }
}
