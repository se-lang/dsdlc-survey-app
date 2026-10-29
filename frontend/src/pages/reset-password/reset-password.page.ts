import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    inject,
    input,
    signal,
    viewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize, map } from 'rxjs';
import { matchServerErrors } from '../../util/server-error';
import { uniqueComponentId } from '../../util/unique-component-id';
import { ResetPasswordGQL } from '../../generated/graphql';
import {
    ValidationErrorDirective,
    ValidationErrorsComponent,
    ValidationFallbackDirective,
} from 'ngx-valdemort';
import { canSubmitForm, genericBackendErrorCode } from '../../util/form-submit';
import { TranslocoDirective } from '@jsverse/transloco';
import { DialogHeaderComponent } from '../../components/dialog/dialog-header/dialog-header.component';
import { DialogContentComponent } from '../../components/dialog/dialog-content/dialog-content.component';
import {
    passwordMatchValidator,
    provideValdemortConfig,
    shouldDisplayPasswordMatchError,
} from '../../util/form-validation';

@Component({
    selector: 'lla-reset-password',
    imports: [
        ReactiveFormsModule,
        RouterLink,
        ValidationErrorsComponent,
        ValidationFallbackDirective,
        ValidationErrorDirective,
        TranslocoDirective,
        DialogHeaderComponent,
        DialogContentComponent,
    ],
    templateUrl: './reset-password.page.html',
    styleUrl: './reset-password.page.scss',
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
export class ResetPasswordPage {
    readonly uid = input.required<string>();
    readonly token = input.required<string>();

    readonly #resetPasswordGql = inject(ResetPasswordGQL);
    readonly #fb = new FormBuilder().nonNullable;
    protected readonly formGroup = this.#fb.group(
        {
            newPassword: this.#fb.control('', [Validators.required]),
            password2: this.#fb.control('', [Validators.required]),
        },
        {
            validators: [passwordMatchValidator('newPassword', 'password2')],
        },
    );
    protected readonly submitting = signal(false);
    protected readonly success = signal(false);
    protected readonly id1 = uniqueComponentId();
    protected readonly id2 = uniqueComponentId();

    private readonly form = viewChild<unknown, ElementRef<HTMLFormElement>>('formElement', {
        read: ElementRef,
    });

    submit() {
        if (this.submitting()) {
            return;
        }
        if (canSubmitForm(this.formGroup)) {
            this.submitting.set(true);
            this.#resetPasswordGql
                .mutate({
                    uid: this.uid(),
                    token: this.token(),
                    newPassword: this.formGroup.controls.newPassword.getRawValue(),
                })
                .pipe(
                    map((r) => r.data?.resetPassword),
                    finalize(() => this.submitting.set(false)),
                )
                .subscribe({
                    next: (errors) => {
                        if (errors == null) {
                            this.success.set(true);
                        } else {
                            matchServerErrors(this.formGroup, errors);
                        }
                    },
                    error: (err) => {
                        console.error('Failed to reset password', err);
                        this.formGroup.setErrors({ [genericBackendErrorCode]: true });
                    },
                });
        } else {
            this.formGroup.markAllAsTouched();
            this.form()?.nativeElement.querySelector<HTMLElement>('.ng-invalid')?.focus();
        }
    }
}

export default ResetPasswordPage;
