import strawberry

from lla_questionnaire.graphql_types.question_matrix_double import (
    QnrDoubleMatrixQuestionPartElement,
    QnrDoubleMatrixQuestionCategoryElement,
    QnrDoubleMatrixQuestionElement,
)
from lla_zofar.api_schema.questions_matrix_double import (
    ZfSingleChoiceMatrixItemResponseDomainInDoubleMatrix,
    ZfDoubleMatrixItem,
    ZfDoubleMatrix,
)
from lla_zofar.graphql_types.base import ZfParentElementGql
from lla_zofar.graphql_types.element import gql_id
from lla_zofar.graphql_types.question_matrix_base import (
    ZfMatrixQuestionCategoryElementGql,
)


@strawberry.type(name='ZfDoubleMatrixQuestionPartElement')
class ZfDoubleMatrixQuestionPartElementGql(
    ZfParentElementGql[ZfSingleChoiceMatrixItemResponseDomainInDoubleMatrix],
    QnrDoubleMatrixQuestionPartElement,
):
    @strawberry.field()
    def form_control_id(self) -> str:
        return self.zf_element.id

    @strawberry.field()
    def title(self) -> str:
        return self.zf_element.title


@strawberry.type(name='ZfDoubleMatrixQuestionCategoryElement')
class ZfDoubleMatrixQuestionCategoryElementGql(
    ZfMatrixQuestionCategoryElementGql[ZfDoubleMatrixItem],
    QnrDoubleMatrixQuestionCategoryElement,
):
    pass


@strawberry.type(name='ZfDoubleMatrixQuestionElement')
class ZfDoubleMatrixQuestionElementGql(
    ZfParentElementGql[ZfDoubleMatrix], QnrDoubleMatrixQuestionElement
):
    @strawberry.field()
    def title_left(self) -> str:
        return ''.join(self.zf_element.response_domain.left_header)

    @strawberry.field()
    def title_right(self) -> str:
        return ''.join(self.zf_element.response_domain.right_header)

    @strawberry.field()
    def category_ids(self) -> list[str]:
        return [gql_id(el) for el in self.zf_element.response_domain.items]
