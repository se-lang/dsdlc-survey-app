import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    inject,
    signal,
    viewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { uniqueComponentId } from '../../util/unique-component-id';
import { RouterLink } from '@angular/router';
import { ForgotPasswordGQL } from '../../generated/graphql';
import { finalize } from 'rxjs';
import { ValidationErrorsComponent, ValidationFallbackDirective } from 'ngx-valdemort';
import { TranslocoDirective } from '@jsverse/transloco';
import { DialogHeaderComponent } from '../../components/dialog/dialog-header/dialog-header.component';
import { DialogContentComponent } from '../../components/dialog/dialog-content/dialog-content.component';
import { IconDirective } from '../../components/icon/icon.directive';
import { canSubmitForm, genericBackendErrorCode } from '../../util/form-submit';

@Component({
    selector: 'lla-forgot-password',
    imports: [
        ReactiveFormsModule,
        RouterLink,
        ValidationErrorsComponent,
        ValidationFallbackDirective,
        TranslocoDirective,
        DialogHeaderComponent,
        DialogContentComponent,
        IconDirective,
    ],
    templateUrl: './forgot-password.page.html',
    styleUrl: './forgot-password.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordPage {
    readonly #forgotPasswordGql = inject(ForgotPasswordGQL);
    readonly #fb = new FormBuilder().nonNullable;
    protected readonly emailInputId = uniqueComponentId();
    protected readonly formGroup = this.#fb.group({
        email: this.#fb.control('', [Validators.required]),
    });
    protected readonly submitting = signal(false);
    protected readonly success = signal(false);

    private readonly form = viewChild<unknown, ElementRef<HTMLFormElement>>('formElement', {
        read: ElementRef,
    });

    submit() {
        if (this.submitting()) {
            return;
        }
        if (canSubmitForm(this.formGroup)) {
            this.submitting.set(true);
            this.#forgotPasswordGql
                .mutate(this.formGroup.getRawValue())
                .pipe(finalize(() => this.submitting.set(false)))
                .subscribe({
                    next: () => {
                        this.success.set(true);
                    },
                    error: (err) => {
                        console.error('Failed to send forgot password', err);
                        this.formGroup.setErrors({ [genericBackendErrorCode]: true });
                    },
                });
        } else {
            this.formGroup.markAllAsTouched();
            this.form()?.nativeElement.querySelector<HTMLElement>('.ng-invalid')?.focus();
        }
    }
}

export default ForgotPasswordPage;
