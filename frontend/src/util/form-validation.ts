import {
    AbstractControl,
    FormGroup,
    FormGroupDirective,
    NgForm,
    ValidationErrors,
    ValidatorFn,
} from '@angular/forms';
import { ValdemortConfig } from 'ngx-valdemort';
import { inject, Provider } from '@angular/core';

export function passwordMatchValidator(field1 = 'password', field2 = 'password2'): ValidatorFn {
    return (control) => {
        const pw: unknown = control.get(field1)?.value;
        const pw2: unknown = control.get(field2)?.value;
        if (pw && pw2 && pw !== pw2) {
            return {
                password_mismatch: true,
            };
        } else {
            return null;
        }
    };
}

export function shouldDisplayPasswordMatchError(
    field2 = 'password2',
): (control: AbstractControl, form: NgForm | FormGroupDirective | undefined) => boolean | null {
    return (control, form) => {
        // make sure we do not show the password_mismatch error unless password2
        // was touched
        let controlErrors: ValidationErrors | null;
        let errorKeys: string[];
        if (
            !form?.submitted &&
            control instanceof FormGroup &&
            (controlErrors = control.errors) != null &&
            (errorKeys = Object.keys(controlErrors)).length === 1 &&
            errorKeys[0] === 'password_mismatch'
        ) {
            return !!control.get(field2)?.touched;
        }
        return null;
    };
}

export function provideValdemortConfig(
    changes: Partial<ValdemortConfig> | ((parent: ValdemortConfig) => Partial<ValdemortConfig>),
): Provider {
    return {
        provide: ValdemortConfig,
        useFactory: () => {
            const parent = inject(ValdemortConfig, { skipSelf: true });
            const resolvedChanges = typeof changes === 'function' ? changes(parent) : changes;
            return Object.assign(new ValdemortConfig(), parent, resolvedChanges);
        },
    } satisfies Provider;
}
