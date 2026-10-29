import strawberry

from lla_questionnaire.graphql_types.form_control import QnrFormControlElement
from lla_questionnaire.graphql_types.question_choice_single import (
    QnrSingleChoiceQuestionStyle,
)
from lla_questionnaire.graphql_types.question_matrix_choice_base import (
    QnrChoiceMatrixQuestionCategoryElement,
    QnrChoiceMatrixQuestionElement,
)


@strawberry.interface
class QnrSingleChoiceMatrixQuestionCategoryElement(
    QnrChoiceMatrixQuestionCategoryElement, QnrFormControlElement
):
    style: QnrSingleChoiceQuestionStyle


@strawberry.interface
class QnrSingleChoiceMatrixQuestionElement(QnrChoiceMatrixQuestionElement):
    pass
