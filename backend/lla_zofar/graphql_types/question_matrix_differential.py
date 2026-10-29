import strawberry

from lla_questionnaire.graphql_types.question_differential import (
    QnrDifferentialQuestionElement,
    QnrDifferentialQuestionPartElement,
)
from lla_zofar.api_schema.questions_matrix_differential import (
    ZfDifferentialMatrix,
    ZfDifferentialSingleChoiceMatrixItem,
)
from lla_zofar.graphql_types.base import ZfParentElementGql
from lla_zofar.graphql_types.element import gql_id


@strawberry.type(name='ZfDifferentialQuestionElement')
class ZfDifferentialQuestionElementGql(
    ZfParentElementGql[ZfDifferentialMatrix], QnrDifferentialQuestionElement
):
    @strawberry.field()
    def part_ids(self) -> list[str]:
        return [gql_id(el) for el in self.zf_element.response_domain.items]


@strawberry.type(name='ZfDifferentialQuestionPartElement')
class ZfDifferentialQuestionPartElementGql(
    ZfParentElementGql[ZfDifferentialSingleChoiceMatrixItem],
    QnrDifferentialQuestionPartElement,
):
    @strawberry.field()
    def option_ids(self) -> list[str]:
        return [gql_id(el) for el in self.zf_element.options]

    @strawberry.field()
    def form_control_id(self) -> str:
        return self.zf_element.response_domain.id
