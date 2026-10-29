import strawberry

from lla_questionnaire.graphql_types.question_matrix_choice_base import (
    QnrChoiceMatrixQuestionCategoryElement,
    QnrChoiceMatrixQuestionElement,
)


@strawberry.interface
class QnrMultipleChoiceMatrixQuestionCategoryElement(
    QnrChoiceMatrixQuestionCategoryElement
):
    pass


@strawberry.interface
class QnrMultipleChoiceMatrixQuestionElement(QnrChoiceMatrixQuestionElement):
    pass
