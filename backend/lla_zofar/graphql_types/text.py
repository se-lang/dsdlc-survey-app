import strawberry

from lla_questionnaire.graphql_types.text import (
    QnrHtmlSectionElement,
    QnrTextSectionKind,
)
from lla_zofar.api_schema.text import ZfTextElementBase
from lla_zofar.graphql_types.element import ZfElementGql


@strawberry.type(name='ZfHtmlSectionElement')
class ZfHtmlElementGql(ZfElementGql[ZfTextElementBase], QnrHtmlSectionElement):
    @strawberry.field()
    def html(self) -> str:
        return ''.join(self.zf_element.content)

    @strawberry.field()
    def kind(self) -> QnrTextSectionKind:
        return QnrTextSectionKind[self.zf_element.kind.name]
