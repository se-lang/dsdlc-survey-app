from typing import NewType

import strawberry

from lla_questionnaire.graphql_types.element import QuestionnaireElement

QuestionnaireFormControlValue = strawberry.scalar(
    NewType('QuestionnaireFormControlValue', object),
    description='The QuestionnaireFormControlValue scalar represents a value of a form control.'
    'The type of value depends on the type of form control.',
    serialize=lambda v: v,
    parse_value=lambda v: v,
)


@strawberry.type
class QuestionnaireFormValue:
    form_control_id: str
    value: QuestionnaireFormControlValue | None


@strawberry.interface
class QnrFormControlElement(QuestionnaireElement):
    form_control_id: str
