import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginStateService } from '../services/login/login-state.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, forkJoin, of, switchMap, take, throwError } from 'rxjs';
import { DefaultValidationErrorsDirective, ValidationErrorDirective } from 'ngx-valdemort';
import { I18nService } from '../services/i18n/i18n.service';
import { GlobalLoadingService, withGlobalLoading } from '../services/global-loading.service';
import { LoadingBarComponent } from '../components/loading-bar/loading-bar.component';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { ServerErrorListComponent } from '../components/server-error-list/server-error-list.component';
import { BodyBottomMarginService } from '../body-bottom-margin/body-bottom-margin.service';

@Component({
    selector: 'lla-root',
    imports: [
        RouterOutlet,
        DefaultValidationErrorsDirective,
        ValidationErrorDirective,
        LoadingBarComponent,
        ServerErrorListComponent,
        TranslocoPipe,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
    readonly error = signal(false);

    readonly globalLoading = toSignal(inject(GlobalLoadingService).showLoadingSpinner$, {
        initialValue: false,
    });

    protected readonly marginBottomService = inject(BodyBottomMarginService);

    constructor() {
        forkJoin([
            inject(LoginStateService).startup(),
            inject(I18nService).loadInitialLanguage(),
            inject(TranslocoService).events$.pipe(
                filter(
                    (e) =>
                        e.type === 'translationLoadFailure' || e.type === 'translationLoadSuccess',
                ),
                take(1),
                switchMap((e) =>
                    e.type === 'translationLoadFailure'
                        ? throwError(() => new Error('Transloco load failure'))
                        : of(e),
                ),
            ),
        ])
            .pipe(withGlobalLoading())
            .subscribe({
                error: (err: unknown) => {
                    console.error('Startup error', err);
                    this.error.set(true);
                },
            });

        // const appRef = inject(ApplicationRef);
        // const swUpdate = inject(SwUpdate);
        // appRef.isStable.pipe(first(Boolean)).subscribe(() => {
        //     console.log('app is stable now');
        //     swUpdate.checkForUpdate().then(
        //         (v) => console.log('success check update', v),
        //         (err: unknown) => console.log('err check update', err),
        //     );
        //     swUpdate.versionUpdates.subscribe((event) => console.log('versionUpdate', event));
        // });
    }

    retry() {
        window.location.reload();
    }
}
