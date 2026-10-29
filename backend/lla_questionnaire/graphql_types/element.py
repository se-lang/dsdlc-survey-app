import functools
from typing import Annotated, TYPE_CHECKING

import strawberry
from strawberry.types import get_object_definition

from lla_questionnaire.graphql_types.element_type_init import (
    questionnaire_elements_initialized,
    questionnaire_element_subclasses,
)

if TYPE_CHECKING:
    from lla_questionnaire.graphql_types.element_type import QnrElementType


@functools.cache
def resolve_qnr_types(element_type: type) -> 'list[QnrElementType]':
    """
    Resolve the ``QuestionnaireElement.types`` field for the given ``element_type``.
    """
    from lla_questionnaire.graphql_types.element_type import QnrElementType

    return [
        QnrElementType[obj_def.name]
        for cls in element_type.__mro__
        if (obj_def := get_object_definition(cls)) is not None
        and obj_def.name in QnrElementType
    ]


LazyQnrElementType = Annotated[
    'QnrElementType',
    strawberry.lazy('lla_questionnaire.graphql_types.element_type'),
]


@strawberry.interface
class QuestionnaireElement:
    """
    QuestionnaireElement is the root of the GraphQL type hierarchy for any dynamic element that
    can appear on a questionnaire page (such as a piece of text or a question).
    Since GraphQL does not support true inheritance, any QuestionnaireElement has a field "types",
    that lists the MRO, as Python sees it.
    For example, a ZfHtmlSectionElement will list the following types:
    ``[ZfHtmlSectionElement, ZfElement, QnrHtmlSectionElement, QuestionnaireElement]``

    For better typing in the frontend, we want types to return an enum instead of just
    a list of strings. This enum will be constructed dynamically from all subtypes of
    QuestionnaireElement and thus must be resolved lazily. This happens as a side effect of
    importing the element_type module. Care must be taken that
    ``send_init_questionnaire_elements_if_necessary`` is sent before this module is imported,
    so that any questionnaire system apps have a chance to evaluate their subtypes.
    """

    id: str

    def __init_subclass__(cls):
        super().__init_subclass__()
        if questionnaire_elements_initialized:
            raise TypeError(
                f'QuestionnaireElement subclass {cls.__name__} created after'
                f' init_questionnaire_elements has been sent.'
            )
        questionnaire_element_subclasses.add(cls)

    @strawberry.field()
    def types(self) -> list[LazyQnrElementType]:
        return resolve_qnr_types(type(self))
