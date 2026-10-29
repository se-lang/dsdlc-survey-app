import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    inject,
    input,
    signal,
    viewChild,
} from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { DialogHeaderComponent } from '../../components/dialog/dialog-header/dialog-header.component';
import { DialogContentComponent } from '../../components/dialog/dialog-content/dialog-content.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IconDirective } from '../../components/icon/icon.directive';
import { GuardResult, MaybeAsync, RouterLink } from '@angular/router';
import {
    ValidationErrorDirective,
    ValidationErrorsComponent,
    ValidationFallbackDirective,
} from 'ngx-valdemort';
import {
    canSubmitForm,
    genericBackendErrorCode,
    handleInvalidFormSubmitAttempt,
} from '../../util/form-submit';
import { finalize, map, take } from 'rxjs';
import { matchServerErrors } from '../../util/server-error';
import { UserDocument, ZofarCreateUser, ZofarRegisterGQL } from '../../generated/graphql';
import {
    passwordMatchValidator,
    provideValdemortConfig,
    shouldDisplayPasswordMatchError,
} from '../../util/form-validation';
import { toSignal } from '@angular/core/rxjs-interop';
import { ANONYMOUS_USER, LoginStateService } from '../../services/login/login-state.service';
import { environment } from '../../environments/environment';

export function registerPageGuard(): MaybeAsync<GuardResult> {
    const service = inject(LoginStateService);
    return service.currentUser().pipe(
        take(1),
        map((user) => {
            return (
                user.__typename === 'AnonymousUser' &&
                (!user.hasGuestSession || !!environment.guestCreateAccountsEnabled)
            );
        }),
    );
}

@Component({
    selector: 'lla-register',
    imports: [
        TranslocoDirective,
        DialogHeaderComponent,
        DialogContentComponent,
        ReactiveFormsModule,
        IconDirective,
        RouterLink,
        ValidationErrorsComponent,
        ValidationFallbackDirective,
        ValidationErrorDirective,
    ],
    templateUrl: './register.page.html',
    styleUrl: './register.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideValdemortConfig((parentConfig) => {
            const matcher = shouldDisplayPasswordMatchError('password2');
            return {
                shouldDisplayErrors: (control, form) => {
                    return (
                        matcher(control, form) ?? parentConfig.shouldDisplayErrors(control, form)
                    );
                },
            };
        }),
    ],
})
export class RegisterPage {
    readonly token = input<string>();

    readonly #zofarRegisterGql = inject(ZofarRegisterGQL);
    readonly #loginStateService = inject(LoginStateService);

    readonly #fb = new FormBuilder().nonNullable;
    readonly formGroup = this.#fb.group(
        {
            email: this.#fb.control('', [Validators.required, Validators.email]),
            password: this.#fb.control('', [Validators.required]),
            password2: this.#fb.control('', [Validators.required]),
            firstName: this.#fb.control('', []),
            lastName: this.#fb.control('', []),
            street: this.#fb.control('', []),
            zipCode: this.#fb.control('', []),
            city: this.#fb.control('', []),
            country: this.#fb.control('', []),
            dateOfBirth: this.#fb.control(null, []),
            phone: this.#fb.control(null, []),
        },
        {
            validators: [passwordMatchValidator('password', 'password2')],
        },
    );

    protected readonly alreadyHasAccount = toSignal(
        this.#loginStateService
            .currentUser()
            .pipe(map((user) => user.__typename === 'AnonymousUser' && user.guestHasAccount)),
    );

    protected readonly submitting = signal(false);
    protected readonly success = signal(false);
    private readonly form = viewChild.required<unknown, ElementRef<HTMLFormElement>>(
        'formElement',
        {
            read: ElementRef,
        },
    );
    protected readonly currentEmail = toSignal(this.formGroup.controls.email.valueChanges, {
        initialValue: this.formGroup.controls.email.getRawValue(),
    });

    submit() {
        if (this.submitting()) {
            return;
        }
        if (canSubmitForm(this.formGroup)) {
            this.submitting.set(true);

            const data: ZofarCreateUser & {
                password2: undefined;
            } = {
                ...this.formGroup.getRawValue(),
                password2: undefined,
                token: this.token() ?? '',
            };
            this.#zofarRegisterGql
                .mutate(
                    {
                        data,
                    },
                    {
                        update: (cache, result) => {
                            if (result.data?.zofarRegister?.__typename !== 'OperationInfo') {
                                cache.writeQuery({
                                    query: UserDocument,
                                    data: { user: ANONYMOUS_USER },
                                });
                            }
                        },
                    },
                )
                .pipe(finalize(() => this.submitting.set(false)))
                .subscribe({
                    next: (result) => {
                        const errors = result.data?.zofarRegister;
                        if (errors == null) {
                            this.success.set(true);
                        } else {
                            matchServerErrors(this.formGroup, errors);
                        }
                    },
                    error: (err) => {
                        console.error('Failed to register', err);
                        this.formGroup.setErrors({ [genericBackendErrorCode]: true });
                    },
                });
        } else {
            handleInvalidFormSubmitAttempt(this.formGroup, this.form());
        }
    }
}

export default RegisterPage;
