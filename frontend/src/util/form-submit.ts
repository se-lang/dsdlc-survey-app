import { type FormGroup } from '@angular/forms';
import { ElementRef } from '@angular/core';

export const genericBackendErrorCode = 'genericBackend';

export function canSubmitForm(formGroup: FormGroup): boolean {
    return (
        formGroup.valid ||
        formGroup.hasError(genericBackendErrorCode) ||
        (!!formGroup.errors && Object.keys(formGroup.errors).some((k) => k.startsWith('server.')))
    );
}

export function handleInvalidFormSubmitAttempt(
    formGroup: FormGroup,
    formElement: ElementRef<HTMLFormElement>,
) {
    formGroup.markAllAsTouched();
    const firstInvalid = formElement.nativeElement.querySelector<HTMLElement>('.ng-invalid');
    if (firstInvalid == null) {
        console.error(
            'Failed to focus first invalid element in invalid form',
            formGroup.errors,
            Object.fromEntries(
                Object.entries(formGroup.controls).map(([key, value]) => [key, value.errors]),
            ),
        );
    } else {
        firstInvalid.focus();
    }
}
