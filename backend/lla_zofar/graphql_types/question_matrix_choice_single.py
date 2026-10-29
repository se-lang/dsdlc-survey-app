import strawberry

from lla_questionnaire.graphql_types.question_choice_single import (
    QnrSingleChoiceQuestionStyle,
)
from lla_questionnaire.graphql_types.question_matrix_choice_single import (
    QnrSingleChoiceMatrixQuestionCategoryElement,
    QnrSingleChoiceMatrixQuestionElement,
)
from lla_zofar.api_schema.questions_matrix_single_choice import (
    ZfSingleChoiceMatrixItem,
    ZfSingleChoiceMatrix,
)
from lla_zofar.api_schema.questions_single_choice import ZfDropdownMissingResponseDomain
from lla_zofar.graphql_types.base import ZfParentElementGql
from lla_zofar.graphql_types.element import gql_id
from lla_zofar.graphql_types.question_matrix_choice_base import (
    ZfChoiceMatrixQuestionCategoryElementGql,
)


@strawberry.type(name='ZfSingleChoiceMatrixQuestionCategoryElement')
class ZfSingleChoiceMatrixQuestionCategoryElementGql(
    ZfChoiceMatrixQuestionCategoryElementGql[ZfSingleChoiceMatrixItem],
    QnrSingleChoiceMatrixQuestionCategoryElement,
):
    @strawberry.field()
    def style(self) -> QnrSingleChoiceQuestionStyle:
        match self.zf_element.response_domain:
            case ZfDropdownMissingResponseDomain():
                return QnrSingleChoiceQuestionStyle.SELECT
            case _:
                return QnrSingleChoiceQuestionStyle.RADIO


@strawberry.type(name='ZfSingleChoiceMatrixQuestionElement')
class ZfSingleChoiceMatrixQuestionElementGql(
    ZfParentElementGql[ZfSingleChoiceMatrix], QnrSingleChoiceMatrixQuestionElement
):
    @strawberry.field()
    def category_ids(self) -> list[str]:
        return [gql_id(el) for el in self.zf_element.response_domain.items]
