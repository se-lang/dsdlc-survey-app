from typing import Any

from pydantic import BaseModel, ValidationError
from pydantic_core.core_schema import (
    NoInfoWrapValidatorFunction,
    WithInfoWrapValidatorFunction,
    ValidatorFunctionWrapHandler,
)


def discriminated_union_fallback(
    discriminator: str, fallback: type[BaseModel]
) -> NoInfoWrapValidatorFunction | WithInfoWrapValidatorFunction:
    def discriminated_union_fallback_validator(
        data: Any, validator: ValidatorFunctionWrapHandler
    ) -> Any:
        try:
            return validator(data)
        except ValidationError as e:
            errors = e.errors()
            if (
                len(errors) == 1
                and errors[0]['type'] == 'union_tag_invalid'
                and errors[0]['loc'] == ()
                and errors[0]['ctx']['discriminator'] == f"'{discriminator}'"
            ):
                return fallback.model_validate(data)
            raise e

    return discriminated_union_fallback_validator
