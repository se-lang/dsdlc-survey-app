import strawberry
from django.utils.html import strip_tags

from lla_questionnaire.graphql_types.question_choice_base import (
    QnrChoiceOptionElement,
    LabelPositionGql,
)
from lla_zofar.api_schema.questions_choice import ZfChoiceOptionBase
from lla_zofar.graphql_types.element import ZfElementGql, gql_id


@strawberry.interface(name='ZfChoiceOptionBaseElement')
class ZfChoiceOptionBaseGql[EL: ZfChoiceOptionBase](
    ZfElementGql[EL], QnrChoiceOptionElement
):
    @strawberry.field()
    def attached_open_question_ids(self) -> list[str]:
        return [
            gql_id(question) for question in self.zf_element.attached_open_questions
        ]

    @strawberry.field()
    def label(self) -> str:
        return strip_tags(self.zf_element.label)

    @strawberry.field()
    def label_position(self) -> LabelPositionGql:
        return LabelPositionGql(self.zf_element.label_position)
