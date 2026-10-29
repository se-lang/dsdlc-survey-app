import strawberry

from lla_questionnaire.graphql_types.base import QnrParentElement
from lla_questionnaire.graphql_types.form_control import QnrFormControlElement


@strawberry.interface
class QnrDifferentialQuestionPartElement(QnrParentElement, QnrFormControlElement):
    option_ids: list[str]


@strawberry.interface
class QnrDifferentialQuestionElement(QnrParentElement):
    part_ids: list[str]
