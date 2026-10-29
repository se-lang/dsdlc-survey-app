from enum import StrEnum

import strawberry

from lla_questionnaire.graphql_types.base import QnrHasElementChildren
from lla_questionnaire.graphql_types.element import QuestionnaireElement
from lla_questionnaire.graphql_types.form_control import QuestionnaireFormValue


@strawberry.enum()
class QuestionnairePageButtonType(StrEnum):
    NEXT = 'next'
    BACK = 'back'
    FINISH = 'finish'
    CUSTOM = 'custom'


@strawberry.type
class QuestionnairePageButton:
    id: str
    label: str
    type: QuestionnairePageButtonType


@strawberry.interface
class QuestionnairePageLayout:
    dummy: bool = strawberry.field(default=False)


@strawberry.type
class QuestionnairePageLayoutBoxed(QuestionnairePageLayout):
    title: str


@strawberry.type
class QuestionnairePageLayoutFull(QuestionnairePageLayout):
    pass


@strawberry.interface
class QuestionnairePage(QnrHasElementChildren):
    # GraphQL does not allow recursive types, but the page structure is recursive.
    # To make this work, in GraphQL the element tree is flattened into one list (all_elements).
    # This allows the frontend to select the desired fields for each type in one location
    # (all_elements) and avoid a recursive types. Children are then referenced only by ID
    # (children_ids, etc.).
    id: str
    layout: QuestionnairePageLayout
    header_ids: list[str]
    all_elements: list[QuestionnaireElement]
    buttons: list[QuestionnairePageButton]
    form_values: list[QuestionnaireFormValue]
    version: int
