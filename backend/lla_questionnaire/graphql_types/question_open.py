import datetime
from enum import Enum

import strawberry
from strawberry.relay import Node

from lla_questionnaire.graphql_types.base import QnrParentElement, QnrLabeledElement
from lla_questionnaire.graphql_types.form_control import QnrFormControlElement
from lla_questionnaire.graphql_types.validators import QnrQuestionValidator


@strawberry.interface
class QnrAutocompleteListItem(Node):
    label: str
    value: str


@strawberry.interface
class QnrAutocompleteList(Node):
    items: list[QnrAutocompleteListItem]


@strawberry.enum()
class QnrOpenQuestionInputType(Enum):
    TEXT = 'TEXT'
    DECIMAL = 'DECIMAL'
    INTEGER = 'INTEGER'
    EMAIL = 'EMAIL'
    YEAR_MONTH = 'YEAR_MONTH'


@strawberry.interface
class QnrOpenQuestionElement(
    QnrParentElement, QnrFormControlElement, QnrLabeledElement
):
    autocomplete: QnrAutocompleteList | None
    input_type: QnrOpenQuestionInputType
    validators: list[QnrQuestionValidator]

    placeholder: str | None
    prefix: str | None
    postfix: str | None
    initial_date: datetime.date | None
