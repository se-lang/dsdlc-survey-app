import strawberry

from lla_questionnaire.graphql_types.question_choice_multiple import (
    QnrMultipleChoiceOptionElement,
    QnrMultipleChoiceQuestionElement,
)
from lla_zofar.api_schema.questions_multiple_choice import (
    ZfMultipleChoiceOption,
    ZfMultipleChoiceQuestion,
)
from lla_zofar.graphql_types.base import ZfParentElementGql
from lla_zofar.graphql_types.element import gql_id
from lla_zofar.graphql_types.form_control import ZfFormControlGql
from lla_zofar.graphql_types.question_choice_base import ZfChoiceOptionBaseGql


@strawberry.type(name='ZfMultipleChoiceOptionElement')
class ZfMultipleChoiceOptionGql(
    ZfFormControlGql[ZfMultipleChoiceOption],
    ZfChoiceOptionBaseGql[ZfMultipleChoiceOption],
    QnrMultipleChoiceOptionElement,
):
    @strawberry.field()
    def exclusive(self) -> bool:
        return self.zf_element.input_exclusive


@strawberry.type(name='ZfMultipleChoiceQuestionElement')
class ZfMultipleChoiceQuestionElementGql(
    ZfParentElementGql[ZfMultipleChoiceQuestion], QnrMultipleChoiceQuestionElement
):
    @strawberry.field()
    def option_ids(self) -> list[str]:
        return [gql_id(option) for option in self.zf_element.options]
