import strawberry

from lla_questionnaire.graphql_types.text import QnrPlainTextSectionElement
from lla_zofar.graphql_types.element import ZfElementGql


@strawberry.type(name='ZfUnknownElement')
class ZfUnknownElementGql(ZfElementGql, QnrPlainTextSectionElement):
    @strawberry.field()
    def text(self) -> str:
        return f'UNIMPLEMENTED ZOFAR ELEMENT: {self.zf_element.type}'


@strawberry.type(name='ZfUnmappedElement')
class ZfUnknownElementPlaceholderGql(ZfElementGql, QnrPlainTextSectionElement):
    @strawberry.field()
    def text(self) -> str:
        return f'ZOFAR ELEMENT NOT MAPPED TO GQL: {type(self.zf_element).__name__}'
