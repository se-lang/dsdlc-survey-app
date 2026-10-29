import strawberry

from lla_questionnaire.graphql_types.element import QuestionnaireElement
from lla_zofar.api_schema.base import ZfElement

ZF_ELEMENT_ID_PREFIX = 'zf-element:'


def gql_id(element: ZfElement) -> str:
    return f'{ZF_ELEMENT_ID_PREFIX}{element.id}'


@strawberry.interface(name='ZfElement')
class ZfElementGql[EL: ZfElement = ZfElement](QuestionnaireElement):
    zf_element: strawberry.Private[EL]

    @strawberry.field()
    def id(self) -> str:
        return gql_id(self.zf_element)
