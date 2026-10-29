from collections import defaultdict
from typing import Any, NoReturn

from django.core.exceptions import ValidationError, NON_FIELD_ERRORS
from django.forms.utils import ErrorList


def create_form_validation_error(errors: dict[str, Any]) -> NoReturn:
    """
    Raise a ValidationError from the given error dictionary. Any single-element
    ErrorLists will be flattened to its contents. This exists to enable proper the proper
    "code" being present in the response for the frontend.
    """
    mapped_errors = {
        field: e.as_data()[0] if isinstance(e, ErrorList) and len(e) == 1 else e
        for field, e in errors.items()
    }
    raise ValidationError(mapped_errors)


def reassign_non_field_error(
    e: ValidationError, code: str, target_field: str, override_code: str | None = None
) -> ValidationError:
    """
    Reassign a non-field error with code "code" to the given target_field instead.
    Optionally also changes the code to "override_code".
    """
    non_field_errors = e.error_dict.get(NON_FIELD_ERRORS)
    if non_field_errors:
        updated = defaultdict(list)
        updated.update(e.error_dict)
        new_non_field_errors = []
        for nfe in non_field_errors:
            if getattr(nfe, 'code', None) == code:
                updated[target_field].append(
                    ValidationError(nfe.message, override_code or code)
                )
            else:
                new_non_field_errors.append(nfe)
        updated[NON_FIELD_ERRORS] = new_non_field_errors
        return ValidationError(updated)
    return e
