import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { WebPushService } from '../../services/web-push.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, finalize, map, tap, throttleTime } from 'rxjs';
import { TranslocoDirective } from '@jsverse/transloco';
import { DashboardPage } from '../dashboard/dashboard.page';
import { marker } from '@jsverse/transloco-keys-manager/marker';

@Component({
    selector: 'lla-web-push-settings',
    imports: [TranslocoDirective],
    templateUrl: './web-push-settings.page.html',
    styleUrl: './web-push-settings.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebPushSettingsPage {
    #service = inject(WebPushService);

    protected readonly supported = this.#service.isSupported;
    protected loading = signal(false);
    protected subscription = toSignal(
        this.#service.currentSubscription.pipe(tap((sub) => console.log('got sub', sub))),
    );
    protected readonly loadingDebounced = toSignal(
        toObservable(this.loading).pipe(
            throttleTime(100, undefined, { leading: false, trailing: true }),
        ),
        {
            initialValue: false,
        },
    );
    protected readonly subMissingDebounced = toSignal(
        toObservable(this.subscription).pipe(
            map((sub) => sub === undefined),
            distinctUntilChanged(),
            throttleTime(100, undefined, { leading: false, trailing: true }),
        ),
        {
            initialValue: false,
        },
    );

    constructor() {
        inject(DashboardPage).title.set(marker('webPush.header'));
    }

    createSub() {
        if (this.loading()) {
            return;
        }
        this.loading.set(true);
        this.#service
            .activatePush()
            .pipe(finalize(() => this.loading.set(false)))
            .subscribe({
                next: (sub) => console.log('Subscription active', sub),
                error: (err) => console.error('Failed to activate subscription', err),
            });
    }

    unregister() {
        if (this.loading()) {
            return;
        }
        this.loading.set(true);
        this.#service
            .unregister()
            .pipe(finalize(() => this.loading.set(false)))
            .subscribe({
                next: () => console.log('unsubscribed'),
                error: (err) => console.error('Failed to unregister', err),
            });
    }
}

export default WebPushSettingsPage;
