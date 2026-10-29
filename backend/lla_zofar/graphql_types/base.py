import strawberry

from lla_questionnaire.graphql_types.base import QnrContainerElement, QnrParentElement
from lla_questionnaire.graphql_types.element import QuestionnaireElement
from lla_zofar.api_schema.base import ZfParentElement
from lla_zofar.graphql_types.element import ZfElementGql, gql_id


@strawberry.interface(name='ZfParentElement')
class ZfParentElementGql[EL: ZfParentElement](ZfElementGql[EL], QnrParentElement):
    @strawberry.field()
    def children(self) -> list[QuestionnaireElement]:
        from lla_zofar.graphql_types.type_map import zf_element_to_gql

        return [
            zf_element_to_gql(e)
            for child in self.zf_element.graphql_children()
            for e in child.graphql_elements()
        ]

    @strawberry.field()
    def children_ids(self) -> list[str]:
        return [
            gql_id(e)
            for child in self.zf_element.graphql_children()
            for e in child.graphql_elements()
        ]


@strawberry.type(name='ZfContainerElement')
class ZfContainerGql(ZfParentElementGql[ZfParentElement], QnrContainerElement):
    pass
