import enum

import strawberry
from strawberry.types import get_object_definition

from lla_questionnaire.graphql_types.element_type_init import (
    questionnaire_element_subclasses,
    questionnaire_elements_initialized,
)

if not questionnaire_elements_initialized:
    raise RuntimeError(
        'QnrElementType was imported before QuestionnaireElement subtypes were '
        'initialized'
    )


QnrElementType = strawberry.enum(
    enum.Enum(
        'QnrElementType',
        {
            obj_def.name: obj_def.name
            for el in questionnaire_element_subclasses
            if (obj_def := get_object_definition(el)) is not None
        },
    )
)
