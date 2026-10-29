import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    inject,
    signal,
    viewChild,
} from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import {
    ValidationErrorDirective,
    ValidationErrorsComponent,
    ValidationFallbackDirective,
} from 'ngx-valdemort';
import { UpdateUserGQL } from '../../generated/graphql';
import { uniqueComponentId } from '../../util/unique-component-id';
import { canSubmitForm, genericBackendErrorCode } from '../../util/form-submit';
import { finalize } from 'rxjs';
import {
    passwordMatchValidator,
    provideValdemortConfig,
    shouldDisplayPasswordMatchError,
} from '../../util/form-validation';
import { matchServerErrors } from '../../util/server-error';
import { DashboardPage } from '../dashboard/dashboard.page';
import { marker } from '@jsverse/transloco-keys-manager/marker';

@Component({
    selector: 'lla-change-password',
    imports: [
        FormsModule,
        RouterLink,
        TranslocoDirective,
        ValidationErrorsComponent,
        ValidationFallbackDirective,
        ReactiveFormsModule,
        ValidationErrorDirective,
    ],
    templateUrl: './change-password.page.html',
    styleUrl: './change-password.page.scss',
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
export class ChangePasswordPage {
    readonly #updateUserGql = inject(UpdateUserGQL);
    readonly #fb = new FormBuilder().nonNullable;
    protected readonly componentId = uniqueComponentId();
    protected readonly formGroup = this.#fb.group(
        {
            password: this.#fb.control('', [Validators.required]),
            password2: this.#fb.control('', [Validators.required]),
        },
        {
            validators: [passwordMatchValidator('password', 'password2')],
        },
    );
    protected readonly submitting = signal(false);
    protected readonly success = signal(false);

    private readonly form = viewChild<unknown, ElementRef<HTMLFormElement>>('formElement', {
        read: ElementRef,
    });

    constructor() {
        inject(DashboardPage).title.set(marker('changePassword.header'));
    }

    submit() {
        if (this.submitting()) {
            return;
        }
        if (canSubmitForm(this.formGroup)) {
            this.submitting.set(true);
            this.#updateUserGql
                .mutate({
                    data: {
                        password: this.formGroup.controls.password.value,
                    },
                })
                .pipe(finalize(() => this.submitting.set(false)))
                .subscribe({
                    next: (result) => {
                        const errors = result.data?.updateUser;
                        if (errors?.__typename === 'User') {
                            this.success.set(true);
                        } else {
                            matchServerErrors(this.formGroup, errors);
                        }
                    },
                    error: (err) => {
                        console.error('Failed to update password password', err);
                        this.formGroup.setErrors({ [genericBackendErrorCode]: true });
                    },
                });
        } else {
            this.formGroup.markAllAsTouched();
            this.form()?.nativeElement.querySelector<HTMLElement>('.ng-invalid')?.focus();
        }
    }
}

export default ChangePasswordPage;
