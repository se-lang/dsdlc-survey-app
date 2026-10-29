import strawberry

from lla_questionnaire.graphql_types.question_matrix_base import (
    QnrMatrixQuestionCategoryElement,
)
from lla_zofar.api_schema.questions_matrix_base import ZfMatrixItem
from lla_zofar.graphql_types.base import ZfParentElementGql
from lla_zofar.graphql_types.element import gql_id


@strawberry.interface(name='ZfMatrixQuestionCategoryElement')
class ZfMatrixQuestionCategoryElementGql[EL: ZfMatrixItem](
    ZfParentElementGql[EL],
    QnrMatrixQuestionCategoryElement,
):
    @strawberry.field()
    def unit_label(self) -> str | None:
        return self.zf_element.unit_label

    @strawberry.field()
    def label(self) -> str:
        return self.zf_element.label

    @strawberry.field()
    def custom_label_element_id(self) -> str | None:
        if (attached_open := self.zf_element.attached_open_question) is not None:
            return gql_id(attached_open)
        else:
            return None
