import strawberry

from lla_questionnaire.graphql_types.question_matrix_open import (
    QnrOpenMatrixQuestionCategoryElement,
    QnrOpenMatrixQuestionElement,
)
from lla_zofar.api_schema.questions_matrix_open import ZfOpenMatrixItem, ZfOpenMatrix
from lla_zofar.graphql_types.base import ZfParentElementGql
from lla_zofar.graphql_types.element import gql_id
from lla_zofar.graphql_types.question_matrix_base import (
    ZfMatrixQuestionCategoryElementGql,
)


@strawberry.type(name='ZfOpenMatrixQuestionCategoryElement')
class ZfOpenMatrixQuestionCategoryElementGql(
    ZfMatrixQuestionCategoryElementGql[ZfOpenMatrixItem],
    QnrOpenMatrixQuestionCategoryElement,
):
    pass


@strawberry.type(name='ZfOpenMatrixQuestionElement')
class ZfOpenMatrixQuestionElementGql(
    ZfParentElementGql[ZfOpenMatrix], QnrOpenMatrixQuestionElement
):
    @strawberry.field()
    def category_ids(self) -> list[str]:
        return [gql_id(el) for el in self.zf_element.response_domain.items]
