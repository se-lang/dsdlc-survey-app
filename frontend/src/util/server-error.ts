import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { type OperationInfoFragment } from '../generated/graphql';
import { genericBackendErrorCode } from './form-submit';

function clearOldErrors(control: AbstractControl, map: ReadonlyMap<AbstractControl, unknown>) {
    if (!map.has(control)) {
        control.setErrors(null);
    }
    if (control instanceof FormGroup) {
        for (const key in control.controls) {
            clearOldErrors(control.controls[key], map);
        }
    } else if (control instanceof FormArray) {
        for (const child of control.controls) {
            clearOldErrors(child, map);
        }
    }
}

export function matchServerErrors(
    formGroup: FormGroup,
    errors: OperationInfoFragment | null | undefined,
) {
    if (errors == null || errors.messages.length === 0) {
        formGroup.setErrors({
            [genericBackendErrorCode]: true,
        });
    } else {
        const map = new Map<AbstractControl, Record<string, unknown>>();
        for (const error of errors.messages) {
            const fieldControl =
                error.field == null ? formGroup : (formGroup.get(error.field) ?? formGroup);
            let errors = map.get(fieldControl);
            if (errors == null) {
                map.set(fieldControl, (errors = {}));
            }
            const errorKey = `server.generic`;
            if (!errors[errorKey]) {
                errors[errorKey] = [error];
            } else if (Array.isArray(errors[errorKey])) {
                errors[errorKey].push(error);
            } else {
                throw new Error('Failed to merge server errors for form.');
            }
        }
        for (const [control, errors] of map.entries()) {
            control.setErrors(errors);
        }
        clearOldErrors(formGroup, map);
    }
}
