import strawberry

from lla_questionnaire.graphql_types.form_control import QnrFormControlElement
from lla_zofar.api_schema.base import ZfElement
from lla_zofar.graphql_types.element import ZfElementGql


@strawberry.interface(name='ZfFormControlElement')
class ZfFormControlGql[EL: ZfElement = ZfElement](
    ZfElementGql[EL], QnrFormControlElement
):
    @strawberry.field()
    def form_control_id(self) -> str:
        return self.zf_element.id
