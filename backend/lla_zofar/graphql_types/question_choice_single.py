import strawberry

from lla_questionnaire.graphql_types.question_choice_single import (
    QnrSingleChoiceOptionElement,
    QnrSingleChoiceQuestionElement,
    QnrSingleChoiceQuestionStyle,
)
from lla_zofar.api_schema.questions_single_choice import (
    ZfSingleChoiceOption,
    ZfSingleChoiceQuestionBase,
    ZfRadioButtonSingleChoiceResponseDomain,
    ZfSingleChoiceQuestion,
)
from lla_zofar.graphql_types.base import ZfParentElementGql
from lla_zofar.graphql_types.element import gql_id
from lla_zofar.graphql_types.form_control import ZfFormControlGql
from lla_zofar.graphql_types.question_choice_base import ZfChoiceOptionBaseGql


@strawberry.type(name='ZfSingleChoiceOptionElement')
class ZfSingleChoiceOptionGql(
    ZfChoiceOptionBaseGql[ZfSingleChoiceOption], QnrSingleChoiceOptionElement
):
    @strawberry.field()
    def form_value(self) -> str:
        return self.zf_element.value


@strawberry.interface(name='ZfSingleChoiceQuestionBaseElement')
class ZfSingleChoiceQuestionBaseGql[T: ZfSingleChoiceQuestionBase](
    ZfFormControlGql[T],
    ZfParentElementGql[T],
    QnrSingleChoiceQuestionElement,
):
    @strawberry.field()
    def style(self) -> QnrSingleChoiceQuestionStyle:
        match self.zf_element.response_domain:
            case ZfRadioButtonSingleChoiceResponseDomain():
                return QnrSingleChoiceQuestionStyle.RADIO
            case _:
                return QnrSingleChoiceQuestionStyle.SELECT

    @strawberry.field()
    def option_ids(self) -> list[str]:
        return [gql_id(option) for option in self.zf_element.options]

    @strawberry.field()
    def form_control_id(self) -> str:
        return self.zf_element.response_domain.id


@strawberry.type(name='ZfSingleChoiceQuestionElement')
class ZfSingleChoiceQuestionGql(
    ZfSingleChoiceQuestionBaseGql[ZfSingleChoiceQuestion],
):
    pass
