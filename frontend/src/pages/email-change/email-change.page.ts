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
import { DialogFooterComponent } from '../../components/dialog/dialog-footer/dialog-footer.component';
import { UpdateUserEmailGQL, UserDocument } from '../../generated/graphql';
import { finalize } from 'rxjs';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { canSubmitForm, genericBackendErrorCode } from '../../util/form-submit';
import { matchServerErrors } from '../../util/server-error';
import { uniqueComponentId } from '../../util/unique-component-id';
import {
    ValidationErrorDirective,
    ValidationErrorsComponent,
    ValidationFallbackDirective,
} from 'ngx-valdemort';
import { ANONYMOUS_USER } from '../../services/login/login-state.service';

@Component({
    selector: 'lla-email-change',
    imports: [
        TranslocoDirective,
        DialogHeaderComponent,
        DialogContentComponent,
        DialogFooterComponent,
        RouterLink,
        FormsModule,
        ValidationErrorsComponent,
        ReactiveFormsModule,
        ValidationFallbackDirective,
        ValidationErrorDirective,
    ],
    templateUrl: './email-change.page.html',
    styleUrl: './email-change.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailChangePage {
    readonly uid = input.required<string>();
    readonly token = input.required<string>();

    readonly #emailChangeGql = inject(UpdateUserEmailGQL);
    readonly #fb = new FormBuilder().nonNullable;

    protected readonly formGroup = this.#fb.group({
        email: this.#fb.control('', [Validators.required, Validators.email]),
    });
    protected readonly form = viewChild.required<ElementRef<HTMLElement>>('form');
    protected readonly formId = uniqueComponentId();

    protected readonly submitting = signal(false);
    protected readonly success = signal(false);
    protected readonly error = signal(false);
    protected readonly errorMessage = signal<string | null>(null);

    submit() {
        if (this.submitting()) {
            return;
        }
        if (canSubmitForm(this.formGroup)) {
            this.submitting.set(true);
            this.#emailChangeGql
                .mutate(
                    {
                        uid: this.uid(),
                        token: this.token(),
                        newEmail: this.formGroup.controls.email.value,
                    },
                    {
                        update: (cache) => {
                            cache.writeQuery({
                                query: UserDocument,
                                data: { user: ANONYMOUS_USER },
                            });
                        },
                    },
                )
                .pipe(finalize(() => this.submitting.set(false)))
                .subscribe({
                    next: (result) => {
                        const data = result.data?.updateUserEmail;
                        if (data == null) {
                            this.success.set(true);
                        } else {
                            matchServerErrors(this.formGroup, data);
                        }
                    },
                    error: (err) => {
                        console.error('Failed to reset email', err);
                        this.formGroup.setErrors({ [genericBackendErrorCode]: true });
                    },
                });
        } else {
            this.formGroup.markAllAsTouched();
            this.form().nativeElement.querySelector<HTMLElement>('.ng-invalid')?.focus();
        }
    }
}

export default EmailChangePage;
