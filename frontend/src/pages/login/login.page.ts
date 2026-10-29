import {
    ChangeDetectionStrategy,
    Component,
    computed,
    ElementRef,
    inject,
    signal,
    viewChild,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LoginService } from '../../services/login/login.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
    catchError,
    endWith,
    filter,
    finalize,
    map,
    of,
    startWith,
    Subject,
    switchMap,
    takeWhile,
    timer,
} from 'rxjs';
import { LOGIN_NEXT_PARAM } from '../../services/login/login-guards';
import { matchServerErrors } from '../../util/server-error';
import { ValidationErrorsComponent, ValidationFallbackDirective } from 'ngx-valdemort';
import { DialogHeaderComponent } from '../../components/dialog/dialog-header/dialog-header.component';
import { TranslocoDirective } from '@jsverse/transloco';
import { DialogContentComponent } from '../../components/dialog/dialog-content/dialog-content.component';
import { canSubmitForm, genericBackendErrorCode } from '../../util/form-submit';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ResendActivationEmailGQL } from '../../generated/graphql';
import { i18nCompute } from '../../services/i18n/i18n.utils';
import { BackButtonComponent } from '../../components/back-button/back-button.component';
import { marker } from '@jsverse/transloco-keys-manager/marker';

interface ActivationEmailStateAvailable {
    state: 'available';
}

interface ActivationEmailStateSending {
    state: 'sending';
}

interface ActivationEmailStateError {
    state: 'error';
}

interface ActivationEmailStateCountdown {
    state: 'countdown';
    remainingSeconds: number;
}

type ActivationEmailState =
    | ActivationEmailStateAvailable
    | ActivationEmailStateSending
    | ActivationEmailStateError
    | ActivationEmailStateCountdown;

const activationEmailStateAvailable: ActivationEmailStateAvailable = { state: 'available' };
const activationEmailStateSending: ActivationEmailStateSending = { state: 'sending' };
const activationEmailStateError: ActivationEmailStateError = { state: 'error' };

function activationEmailStateCountdown(remainingSeconds: number): ActivationEmailStateCountdown {
    return { state: 'countdown', remainingSeconds };
}

const activationEmailWaitSeconds = 15;

@Component({
    selector: 'lla-login',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterLink,
        ValidationErrorsComponent,
        ValidationFallbackDirective,
        DialogHeaderComponent,
        TranslocoDirective,
        DialogContentComponent,
        BackButtonComponent,
    ],
    templateUrl: './login.page.html',
    styleUrl: './login.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
    readonly #router = inject(Router);
    readonly #route = inject(ActivatedRoute);
    readonly #loginService = inject(LoginService);
    readonly #resendActivationEmailGql = inject(ResendActivationEmailGQL);

    readonly #resendActivationEmail$ = new Subject<string | null>();

    readonly #fb = new FormBuilder().nonNullable;
    protected readonly formGroup = this.#fb.group({
        username: this.#fb.control('', [Validators.required]),
        password: this.#fb.control('', [Validators.required]),
    });
    protected readonly submitting = signal(false);

    private readonly form = viewChild.required<unknown, ElementRef<HTMLFormElement>>(
        'formElement',
        { read: ElementRef },
    );
    readonly backlinkText = marker('login.backLabel');

    protected readonly activationEmailState = toSignal(
        this.#resendActivationEmail$.pipe(
            switchMap((email) => {
                if (email == null) {
                    return of(activationEmailStateAvailable);
                }
                return this.#resendActivationEmailGql
                    .mutate({
                        data: { email },
                    })
                    .pipe(
                        startWith(activationEmailStateSending),
                        switchMap(() => {
                            return timer(0, 1000).pipe(
                                map((v) => activationEmailWaitSeconds - v),
                                takeWhile((v) => v > 0),
                                map((seconds) => activationEmailStateCountdown(seconds)),
                                endWith(activationEmailStateAvailable),
                            );
                        }),
                        catchError((err: unknown) => {
                            console.error('Failed to resend activation email', err);
                            return of(activationEmailStateError);
                        }),
                    );
            }),
        ),
        {
            initialValue: activationEmailStateAvailable,
        },
    );
    readonly #secondsFormatter = i18nCompute((t) => {
        return new Intl.NumberFormat(t.getActiveLang(), {
            style: 'unit',
            unit: 'second',
            unitDisplay: 'long',
        });
    });
    protected readonly formattedActivationEmailRemainingSeconds = computed(() => {
        const state = this.activationEmailState();
        if (state.state !== 'countdown') {
            return '';
        }
        return this.#secondsFormatter().format(state.remainingSeconds);
    });

    protected readonly showResendOption = signal(false);

    constructor() {
        this.#route.queryParamMap
            .pipe(
                map((queryParams) => queryParams.get('email')),
                filter(Boolean),
                takeUntilDestroyed(),
            )
            .subscribe((email) => {
                if (!this.formGroup.controls.username.value) {
                    this.formGroup.controls.username.setValue(email);
                }
            });
    }

    submit() {
        this.#resendActivationEmail$.next(null);
        if (this.submitting()) {
            return;
        }
        if (canSubmitForm(this.formGroup)) {
            this.submitting.set(true);
            this.#loginService
                .login(
                    this.formGroup.controls.username.value,
                    this.formGroup.controls.password.value,
                )
                .pipe(finalize(() => this.submitting.set(false)))
                .subscribe({
                    next: (errors) => {
                        if (errors == null) {
                            const nextUrl =
                                this.#route.snapshot.queryParamMap.get(LOGIN_NEXT_PARAM) ?? '/';
                            this.#router.navigateByUrl(nextUrl).catch((err: unknown) => {
                                console.error('Failed to do after login navigation', err);
                            });
                        } else {
                            matchServerErrors(this.formGroup, errors);
                            this.showResendOption.set(
                                errors.messages.some((m) => m.code === 'not_active'),
                            );
                        }
                    },
                    error: (err) => {
                        console.error('Failed to login', err);
                        this.formGroup.setErrors({ [genericBackendErrorCode]: true });
                        this.showResendOption.set(false);
                    },
                });
        } else {
            this.formGroup.markAllAsTouched();
            this.form().nativeElement.querySelector<HTMLElement>('.ng-invalid')?.focus();
        }
    }

    resendActivationEmail() {
        if (this.formGroup.controls.username.invalid) {
            return;
        }
        this.#resendActivationEmail$.next(this.formGroup.controls.username.value);
    }
}

export default LoginPage;
