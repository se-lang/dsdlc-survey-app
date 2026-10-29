import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    inject,
    input,
    signal,
    viewChild,
} from '@angular/core';
import { UpdateUser, UpdateUserGQL } from '../../generated/graphql';
import { LoginStateService } from '../../services/login/login-state.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { finalize, take } from 'rxjs';
import {
    canSubmitForm,
    genericBackendErrorCode,
    handleInvalidFormSubmitAttempt,
} from '../../util/form-submit';
import { matchServerErrors } from '../../util/server-error';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import {
    ValidationErrorDirective,
    ValidationErrorsComponent,
    ValidationFallbackDirective,
} from 'ngx-valdemort';
import { DashboardPage } from '../dashboard/dashboard.page';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'lla-change-account-page',
    imports: [
        ReactiveFormsModule,
        RouterLink,
        TranslocoDirective,
        ValidationErrorsComponent,
        ValidationErrorDirective,
        ValidationFallbackDirective,
    ],
    templateUrl: './change-account-page.component.html',
    styleUrl: './change-account-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangeAccountPageComponent {
    readonly token = input<string>();

    readonly #updateUserGql = inject(UpdateUserGQL);
    readonly #loginStateService = inject(LoginStateService);

    readonly #fb = new FormBuilder().nonNullable;
    readonly formGroup = this.#fb.group({
        firstName: this.#fb.control('', []),
        lastName: this.#fb.control('', []),
        street: this.#fb.control('', []),
        zipCode: this.#fb.control('', []),
        city: this.#fb.control('', []),
        country: this.#fb.control('', []),
        dateOfBirth: this.#fb.control<string | null>(null, []),
        phone: this.#fb.control('', []),
    });

    protected readonly submitting = signal(false);
    protected readonly success = signal(false);
    private readonly form = viewChild.required<unknown, ElementRef<HTMLFormElement>>(
        'formElement',
        {
            read: ElementRef,
        },
    );

    constructor() {
        inject(DashboardPage).title.set(marker('changeAccount.header'));
        this.#loginStateService
            .currentUser()
            .pipe(take(1), takeUntilDestroyed())
            .subscribe((user) => {
                if (user.__typename === 'User') {
                    this.formGroup.setValue({
                        firstName: user.firstName,
                        lastName: user.lastName,
                        street: user.street,
                        zipCode: user.zipCode,
                        city: user.city,
                        country: user.country,
                        dateOfBirth: user.dateOfBirth,
                        phone: user.phone,
                    });
                }
            });
    }

    submit() {
        if (this.submitting()) {
            return;
        }
        if (canSubmitForm(this.formGroup)) {
            this.submitting.set(true);

            const data: UpdateUser = {
                ...this.formGroup.getRawValue(),
            };
            this.#updateUserGql
                .mutate({
                    data,
                })
                .pipe(finalize(() => this.submitting.set(false)))
                .subscribe({
                    next: (result) => {
                        const errors = result.data?.updateUser;
                        if (errors == null) {
                            this.formGroup.setErrors({ [genericBackendErrorCode]: true });
                        } else if (errors.__typename === 'User') {
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
export default ChangeAccountPageComponent;
