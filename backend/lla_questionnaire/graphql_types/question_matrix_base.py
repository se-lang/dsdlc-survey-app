import strawberry

from lla_questionnaire.graphql_types.base import QnrParentElement


@strawberry.interface
class QnrMatrixQuestionCategoryElement(QnrParentElement):
    label: str
    unit_label: str | None
    custom_label_element_id: str | None


@strawberry.interface
class QnrMatrixQuestionBaseElement(QnrParentElement):
    category_ids: list[str]
