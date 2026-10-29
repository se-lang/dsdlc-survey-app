from enum import Enum

import strawberry

from lla_questionnaire.graphql_types.element import QuestionnaireElement


@strawberry.enum()
class QnrTextSectionKind(Enum):
    GENERIC = 'generic'
    GENERIC_NO_SPACE = 'generic_no_space'
    QUESTION = 'question'
    INTRODUCTION = 'introduction'


@strawberry.interface
class QnrHtmlSectionElement(QuestionnaireElement):
    html: str
    kind: QnrTextSectionKind


@strawberry.interface
class QnrPlainTextSectionElement(QuestionnaireElement):
    text: str
