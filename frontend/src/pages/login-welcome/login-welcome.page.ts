import {
    ChangeDetectionStrategy,
    Component,
    effect,
    ElementRef,
    inject,
    input,
    signal,
    viewChild,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { DialogContentComponent } from '../../components/dialog/dialog-content/dialog-content.component';
import { DialogHeaderComponent } from '../../components/dialog/dialog-header/dialog-header.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidationErrorsComponent, ValidationFallbackDirective } from 'ngx-valdemort';
import {
    UserDocument,
    ZofarGuestSessionGQL,
    ZofarTokenAccountStateGQL,
} from '../../generated/graphql';
import { finalize } from 'rxjs';
import { LOGIN_NEXT_PARAM } from '../../services/login/login-guards';
import { matchServerErrors } from '../../util/server-error';
import { canSubmitForm, genericBackendErrorCode } from '../../util/form-submit';
import { PopoverDirective } from '../../components/popover/popover.directive';
import { ArrowPopoverComponent } from '../../components/arrow-popover/arrow-popover.component';
import { TriggerPopoverDirective } from '../../components/popover/trigger-popover.directive';
import { environment } from '../../environments/environment';

@Component({
    selector: 'lla-login-welcome',
    imports: [
        TranslocoDirective,
        DialogContentComponent,
        DialogHeaderComponent,
        ReactiveFormsModule,
        ValidationErrorsComponent,
        ValidationFallbackDirective,
        RouterLink,
        PopoverDirective,
        ArrowPopoverComponent,
        TriggerPopoverDirective,
    ],
    templateUrl: './login-welcome.page.html',
    styleUrl: './login-welcome.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginWelcomePage {
    readonly #router = inject(Router);
    readonly #route = inject(ActivatedRoute);
    readonly #guestSessionGql = inject(ZofarGuestSessionGQL);
    readonly #zofarStateGql = inject(ZofarTokenAccountStateGQL);

    readonly #fb = new FormBuilder().nonNullable;
    readonly formGroup = this.#fb.group({
        token: this.#fb.control('', Validators.required),
    });
    // Note: When adjusting this name, also adjust LOGIN_TOKEN_PARAM
    readonly token = input<string>();

    protected readonly submitting = signal(false);
    protected readonly environment = environment;
    private readonly form = viewChild.required<unknown, ElementRef<HTMLFormElement>>(
        'formElement',
        { read: ElementRef },
    );

    constructor() {
        effect(() => {
            const token = this.token();
            if (token != null) {
                this.formGroup.controls.token.setValue(token);
            }
        });
    }

    submit(event: SubmitEvent) {
        if (this.submitting()) {
            return;
        }
        if (canSubmitForm(this.formGroup)) {
            const submitType = event.submitter?.getAttribute('data-lla-submit');
            switch (submitType) {
                case 'guest':
                    this.submitting.set(true);
                    this.#guestSessionGql
                        .mutate(
                            {
                                data: {
                                    token: this.formGroup.controls.token.value,
                                },
                            },
                            {
                                update: (cache, result) => {
                                    const data = result.data?.activateZofarGuestSession;
                                    if (data?.__typename === 'AnonymousUser') {
                                        cache.writeQuery({
                                            query: UserDocument,
                                            data: {
                                                user: data,
                                            },
                                        });
                                    }
                                },
                            },
                        )
                        .pipe(finalize(() => this.submitting.set(false)))
                        .subscribe({
                            next: (result) => {
                                const data = result.data?.activateZofarGuestSession;
                                if (data?.__typename === 'OperationInfo') {
                                    matchServerErrors(this.formGroup, data);
                                } else {
                                    const nextUrl =
                                        this.#route.snapshot.queryParamMap.get(LOGIN_NEXT_PARAM) ??
                                        '/';

                                    this.#router.navigateByUrl(nextUrl).catch((err: unknown) => {
                                        console.error('Failed to do after login navigation', err);
                                    });
                                }
                            },
                            error: (err) => {
                                console.error('Failed to do guest session', err);
                                this.formGroup.setErrors({ [genericBackendErrorCode]: true });
                            },
                        });
                    return;
                case 'register':
                    this.submitting.set(true);
                    this.#zofarStateGql
                        .fetch(
                            {
                                token: this.formGroup.controls.token.value,
                            },
                            {
                                fetchPolicy: 'no-cache',
                            },
                        )
                        .pipe(finalize(() => this.submitting.set(false)))
                        .subscribe({
                            next: (result) => {
                                const zofarToken = result.data.zofarToken;
                                if (zofarToken == null) {
                                    this.formGroup.controls.token.setErrors({
                                        'token.invalid': true,
                                    });
                                } else if (zofarToken.accountState === 'ACCOUNT') {
                                    this.formGroup.controls.token.setErrors({
                                        'token.already_registered': true,
                                    });
                                } else {
                                    void this.#router.navigate(['/register'], {
                                        queryParams: {
                                            token: this.formGroup.controls.token.value,
                                        },
                                        queryParamsHandling: 'merge',
                                    });
                                }
                            },
                            error: (err) => {
                                console.error('Failed to do check zofar token for register', err);
                                this.formGroup.setErrors({ [genericBackendErrorCode]: true });
                            },
                        });
                    break;
                default:
                    void this.#router.navigate(['/login'], {
                        queryParams: {
                            token: this.formGroup.controls.token.value,
                        },
                        queryParamsHandling: 'merge',
                    });
            }
        } else {
            this.formGroup.markAllAsTouched();
            this.form().nativeElement.querySelector<HTMLElement>('.ng-invalid')?.focus();
        }
    }
}

export default LoginWelcomePage;
