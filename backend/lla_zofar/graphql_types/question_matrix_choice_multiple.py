import strawberry

from lla_questionnaire.graphql_types.question_matrix_choice_multiple import (
    QnrMultipleChoiceMatrixQuestionElement,
    QnrMultipleChoiceMatrixQuestionCategoryElement,
)
from lla_zofar.api_schema.questions_matrix_multiple_choice import (
    ZfMultipleChoiceMatrix,
    ZfMultipleChoiceMatrixItem,
)
from lla_zofar.graphql_types.base import ZfParentElementGql
from lla_zofar.graphql_types.element import gql_id
from lla_zofar.graphql_types.question_matrix_choice_base import (
    ZfChoiceMatrixQuestionCategoryElementGql,
)


@strawberry.type(name='ZfMultipleChoiceMatrixQuestionElement')
class ZfMultipleChoiceMatrixQuestionElementGql(
    ZfParentElementGql[ZfMultipleChoiceMatrix], QnrMultipleChoiceMatrixQuestionElement
):
    @strawberry.field()
    def category_ids(self) -> list[str]:
        return [gql_id(el) for el in self.zf_element.response_domain.items]


@strawberry.type(name='ZfMultipleChoiceMatrixQuestionCategoryElement')
class ZfMultipleChoiceMatrixQuestionCategoryElementGql(
    ZfChoiceMatrixQuestionCategoryElementGql[ZfMultipleChoiceMatrixItem],
    QnrMultipleChoiceMatrixQuestionCategoryElement,
):
    pass
