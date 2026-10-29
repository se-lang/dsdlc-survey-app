import strawberry

from lla_questionnaire.graphql_types.question_matrix_choice_base import (
    QnrChoiceMatrixQuestionCategoryElement,
)
from lla_zofar.api_schema.questions_matrix_choice_base import ZfChoiceMatrixItem
from lla_zofar.graphql_types.element import gql_id
from lla_zofar.graphql_types.question_matrix_base import (
    ZfMatrixQuestionCategoryElementGql,
)


@strawberry.interface(name='ZfChoiceMatrixQuestionCategoryElement')
class ZfChoiceMatrixQuestionCategoryElementGql[EL: ZfChoiceMatrixItem](
    ZfMatrixQuestionCategoryElementGql[EL],
    QnrChoiceMatrixQuestionCategoryElement,
):
    @strawberry.field()
    def option_ids(self) -> list[str]:
        return [gql_id(el) for el in self.zf_element.options]

    @strawberry.field()
    def form_control_id(self) -> str:
        return self.zf_element.response_domain.id
