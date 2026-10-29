import {
    ApplicationRef,
    createComponent,
    inject,
    Injectable,
    InjectionToken,
    Injector,
} from '@angular/core';
import { filter, Observable, raceWith, take, timer } from 'rxjs';
import { DialogComponent } from '../components/dialog/dialog/dialog.component';
import { ConfirmationDialogComponent } from '../components/confirmation-dialog/confirmation-dialog.component';
import { outputToObservable, toObservable } from '@angular/core/rxjs-interop';

export interface ConfirmOptions {
    readonly title?: string;
    readonly question: string;
    readonly questionHeader?: string;
    readonly yes?: string;
    readonly no?: string;
    readonly backdropDismiss?: boolean;
    readonly allowCancel?: boolean;
}

export interface ConfirmDialogContext {
    readonly options: ConfirmOptions;
    readonly confirm: (answer: boolean) => void;
}

export const CONFIRM_DIALOG_CONTEXT = new InjectionToken<ConfirmDialogContext>(
    'CONFIRM_DIALOG_CONTEXT',
);

@Injectable({
    providedIn: 'root',
})
export class ConfirmService {
    #appRef = inject(ApplicationRef);
    #injector = inject(Injector);

    showConfirmPopup(options: ConfirmOptions): Observable<boolean> {
        return new Observable<boolean>((subscriber) => {
            const host = document.createElement('dialog');
            document.body.appendChild(host);

            const injector = Injector.create({
                providers: [
                    {
                        provide: CONFIRM_DIALOG_CONTEXT,
                        useValue: {
                            options,
                            confirm: (result) => {
                                subscriber.next(result);
                                subscriber.complete();
                            },
                        } satisfies ConfirmDialogContext,
                    },
                ],
            });
            const compRef = createComponent(DialogComponent, {
                environmentInjector: this.#appRef.injector,
                elementInjector: injector,
                hostElement: host,
            });
            compRef.setInput('component', ConfirmationDialogComponent);
            compRef.setInput('size', 'login');
            compRef.setInput('open', true);
            compRef.setInput('backdropClose', options.backdropDismiss ?? false);
            compRef.setInput('allowCancel', options.allowCancel ?? true);
            this.#appRef.attachView(compRef.hostView);

            const closeSub = outputToObservable(compRef.instance.open)
                .pipe(
                    filter((open) => !open),
                    take(1),
                )
                .subscribe(() => {
                    // Ensure we emit false if the dialog was closed by any other means
                    if (!subscriber.closed) {
                        subscriber.next(false);
                        subscriber.complete();
                    }
                });

            subscriber.add(closeSub);

            return () => {
                // Destroy the component, but give it time to animate out
                compRef.setInput('open', false);
                toObservable(compRef.instance.safeToDestroy, {
                    injector: this.#injector,
                })
                    .pipe(
                        filter((safe) => safe),
                        take(1),
                        raceWith(timer(5000)),
                    )
                    .subscribe(() => {
                        compRef.destroy();
                    });
            };
        });
    }
}
