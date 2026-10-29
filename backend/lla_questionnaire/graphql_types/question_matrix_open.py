import strawberry

from lla_questionnaire.graphql_types.question_matrix_base import (
    QnrMatrixQuestionCategoryElement,
    QnrMatrixQuestionBaseElement,
)


@strawberry.interface
class QnrOpenMatrixQuestionCategoryElement(QnrMatrixQuestionCategoryElement):
    pass


@strawberry.interface
class QnrOpenMatrixQuestionElement(QnrMatrixQuestionBaseElement):
    pass
