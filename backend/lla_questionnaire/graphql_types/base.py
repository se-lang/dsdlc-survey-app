import strawberry

from lla_questionnaire.graphql_types.element import QuestionnaireElement


@strawberry.interface
class QnrHasElementChildren:
    children_ids: list[str]


@strawberry.interface
class QnrParentElement(QnrHasElementChildren, QuestionnaireElement):
    pass


@strawberry.interface
class QnrLabeledElement(QuestionnaireElement):
    label: str


@strawberry.interface
class QnrContainerElement(QnrParentElement):
    pass
