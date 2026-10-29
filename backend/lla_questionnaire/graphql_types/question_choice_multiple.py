import strawberry

from lla_questionnaire.graphql_types.form_control import QnrFormControlElement
from lla_questionnaire.graphql_types.question_choice_base import (
    QnrChoiceOptionElement,
    QnrChoiceQuestionElement,
)


@strawberry.interface
class QnrMultipleChoiceOptionElement(QnrChoiceOptionElement, QnrFormControlElement):
    exclusive: bool


@strawberry.interface
class QnrMultipleChoiceQuestionElement(QnrChoiceQuestionElement):
    pass
