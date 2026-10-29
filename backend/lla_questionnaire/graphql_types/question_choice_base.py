from enum import Enum

import strawberry

from lla_questionnaire.graphql_types.base import QnrLabeledElement, QnrParentElement


@strawberry.enum(name='QnrLabelPosition')
class LabelPositionGql(Enum):
    left = 'left'
    right = 'right'


@strawberry.interface
class QnrChoiceOptionElement(QnrLabeledElement):
    label_position: LabelPositionGql
    attached_open_question_ids: list[str]


@strawberry.interface
class QnrChoiceQuestionElement(QnrParentElement):
    option_ids: list[str]
