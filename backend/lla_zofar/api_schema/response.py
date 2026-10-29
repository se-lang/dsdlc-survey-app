from functools import cached_property
from typing import Annotated, TYPE_CHECKING

from pydantic import BaseModel, Field, AfterValidator

from lla_zofar.api_schema.app_info_container import ZfAppInfoContainer
from lla_zofar.api_schema.page_buttons import ZfPageButton, ZfPageButtonType
from lla_zofar.api_schema.section import ZfSectionElement
from lla_zofar.api_schema.specials import ZfSpecialNullToNone, ZfSpecialNull
from lla_zofar.zofar_urls import validate_zofar_url, is_zofar_final_page_url

if TYPE_CHECKING:
    from lla_zofar.models import ActiveZofarState


ZfEpisodesPostData = list[dict]  # TODO: Validate data


ZfPostDataValue = (
    str | list[ZfSpecialNullToNone] | list[ZfEpisodesPostData | ZfSpecialNull]
)


class ZfPostData(BaseModel):
    target: Annotated[str, AfterValidator(validate_zofar_url)]
    # noinspection PyDataclass
    headers: dict[str, str] = Field(default_factory=dict, validation_alias='HEADER')
    body: dict[str, ZfPostDataValue] = Field(validation_alias='BODY')


class ZfApiResponse(BaseModel):
    """
    The root of the Zofar API response.
    """

    content_structure: ZfSectionElement = Field(validation_alias='contentStructure')
    post_data: ZfPostData = Field(validation_alias='postData')

    @cached_property
    def app_info(self) -> ZfAppInfoContainer | None:
        return next(
            iter(self.content_structure.find_children(ZfAppInfoContainer)), None
        )

    def is_final_page(self, zofar_state: 'ActiveZofarState') -> bool:
        return is_zofar_final_page_url(zofar_state.base_url, self.post_data.target)

    def get_buttons(self) -> list[ZfPageButton]:
        buttons = []
        for key, value in self.post_data.body.items():
            match value:
                case [str() as label, None] | [None, str() as label] if (
                    key in ZfPageButtonType
                ):
                    mapped_type = ZfPageButtonType(key)
                    if mapped_type != ZfPageButtonType.FINISH:
                        buttons.append(ZfPageButton(type=mapped_type, label=label))
        return buttons
