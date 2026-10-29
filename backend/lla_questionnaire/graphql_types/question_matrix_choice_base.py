import strawberry

from lla_questionnaire.graphql_types.question_matrix_base import (
    QnrMatrixQuestionCategoryElement,
    QnrMatrixQuestionBaseElement,
)


@strawberry.interface
class QnrChoiceMatrixQuestionCategoryElement(QnrMatrixQuestionCategoryElement):
    option_ids: list[str]


@strawberry.interface
class QnrChoiceMatrixQuestionElement(QnrMatrixQuestionBaseElement):
    pass
