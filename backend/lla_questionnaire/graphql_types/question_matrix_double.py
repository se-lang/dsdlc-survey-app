import strawberry

from lla_questionnaire.graphql_types.base import QnrParentElement
from lla_questionnaire.graphql_types.form_control import QnrFormControlElement
from lla_questionnaire.graphql_types.question_matrix_base import (
    QnrMatrixQuestionCategoryElement,
    QnrMatrixQuestionBaseElement,
)


@strawberry.interface
class QnrDoubleMatrixQuestionPartElement(QnrFormControlElement, QnrParentElement):
    title: str


@strawberry.interface
class QnrDoubleMatrixQuestionCategoryElement(QnrMatrixQuestionCategoryElement):
    pass


@strawberry.interface
class QnrDoubleMatrixQuestionElement(QnrMatrixQuestionBaseElement):
    pass
