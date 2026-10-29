from enum import Enum

import strawberry

from lla_questionnaire.graphql_types.form_control import QnrFormControlElement
from lla_questionnaire.graphql_types.question_choice_base import (
    QnrChoiceQuestionElement,
    QnrChoiceOptionElement,
)


@strawberry.enum()
class QnrSingleChoiceQuestionStyle(Enum):
    RADIO = 'RADIO'
    SELECT = 'SELECT'


@strawberry.interface
class QnrSingleChoiceQuestionElement(QnrChoiceQuestionElement, QnrFormControlElement):
    style: QnrSingleChoiceQuestionStyle


@strawberry.interface
class QnrSingleChoiceOptionElement(QnrChoiceOptionElement):
    form_value: str
