import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { DialogHeaderComponent } from '../../components/dialog/dialog-header/dialog-header.component';
import { DialogContentComponent } from '../../components/dialog/dialog-content/dialog-content.component';
import { ConfirmUserAccountGQL, ResendActivationEmailGQL } from '../../generated/graphql';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, finalize, map, of, switchMap, take } from 'rxjs';

@Component({
    selector: 'lla-activate-account',
    imports: [TranslocoDirective, DialogHeaderComponent, DialogContentComponent, RouterLink],
    templateUrl: './activate-account.component.html',
    styleUrl: './activate-account.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivateAccountComponent {
    readonly #confirmAccountGql = inject(ConfirmUserAccountGQL);
    readonly #resendActivationEmailGql = inject(ResendActivationEmailGQL);
    readonly #activatedRoute = inject(ActivatedRoute);

    readonly #status = toSignal(
        this.#activatedRoute.paramMap.pipe(
            map((params) => ({
                uid: params.get('uid') as string,
                token: params.get('token') as string,
            })),
            switchMap((variables) => {
                return this.#confirmAccountGql.mutate(variables, { useMutationLoading: true }).pipe(
                    catchError((err: unknown) => {
                        console.error('Failed to activate account', err);
                        return of({ error: err });
                    }),
                );
            }),
        ),
        {
            initialValue: { loading: true },
        },
    );

    protected readonly success = computed(() => {
        const status = this.#status();
        return 'data' in status &&
            status.data?.confirmEmail.__typename === 'ConfirmEmailSuccessResult'
            ? status.data.confirmEmail
            : null;
    });

    protected readonly validationError = computed(() => {
        const status = this.#status();
        return 'data' in status && status.data?.confirmEmail.__typename === 'OperationInfo'
            ? status.data.confirmEmail
            : null;
    });

    protected readonly canResend = computed(() => {
        return !!this.validationError()?.messages.some((m) => m.code === 'invalid_token');
    });

    protected readonly resending = signal(false);
    protected readonly resent = signal(false);
    protected readonly resendError = signal(false);

    resend() {
        if (!this.resending()) {
            this.resending.set(true);
            this.#activatedRoute.paramMap
                .pipe(
                    map((params) => params.get('uid') as string),
                    take(1),
                    switchMap((uid) => {
                        return this.#resendActivationEmailGql
                            .mutate({
                                data: { tokenUid: uid },
                            })
                            .pipe(
                                catchError((err: unknown) => {
                                    console.error('Failed to resend account email', err);
                                    this.resendError.set(true);
                                    return of(null);
                                }),
                            );
                    }),
                    finalize(() => this.resending.set(false)),
                )
                .subscribe((result) => {
                    if (result != null) {
                        this.resent.set(true);
                    }
                });
        }
    }
}

export default ActivateAccountComponent;
