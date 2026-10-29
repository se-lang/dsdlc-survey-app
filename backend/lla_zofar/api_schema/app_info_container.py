import html
import json
from collections.abc import Mapping
from functools import cached_property
from typing import Annotated, Any, Literal

from pydantic import Tag, Discriminator, Field, BeforeValidator, ConfigDict

from lla_zofar.api_schema.base import ZfGqlVisibility, ZfElement
from lla_zofar.api_schema.episodes import ZfEpisodeValue
from lla_zofar.api_schema.misc import ZfDisplayContainer


class ZfAppInfoEpisodeIndex(ZfElement):
    content: Annotated[tuple[Annotated[int, Field(strict=False)]], Field(strict=True)]


def _decode_html_encoded_json_string(value: Any):
    if not isinstance(value, str):
        raise TypeError('must be a string')
    return json.loads(html.unescape(value))


class ZfAppInfoEpisodeObj(ZfElement):
    content: tuple[
        Annotated[ZfEpisodeValue, BeforeValidator(_decode_html_encoded_json_string)]
    ]


class ZfAppInfoUnknown(ZfElement):
    model_config = ConfigDict(extra='allow')


def _discriminate_app_info(
    data: Any,
) -> Literal['episode_index', 'episode_obj', 'unknown']:
    if isinstance(data, Mapping):
        id_ = data.get('id')
    else:
        id_ = getattr(data, 'id', None)
    if not isinstance(id_, str):
        return 'unknown'
    elif id_.endswith(':app:episodeIndex'):
        return 'episode_index'
    elif id_.endswith(':app:episodeObj'):
        return 'episode_obj'
    else:
        return 'unknown'


type ZfAppInfoChildren = Annotated[
    Annotated[ZfAppInfoEpisodeIndex, Tag('episode_index')]
    | Annotated[ZfAppInfoEpisodeObj, Tag('episode_obj')]
    | Annotated[ZfAppInfoUnknown, Tag('unknown')],
    Discriminator(_discriminate_app_info),
]


class ZfAppInfoContainer(ZfDisplayContainer):
    children: list[ZfAppInfoChildren] = Field(
        validation_alias='childs', default_factory=list
    )

    @cached_property
    def episode_data(self) -> ZfAppInfoEpisodeObj | None:
        return next(iter(self.find_children(ZfAppInfoEpisodeObj)), None)

    def graphql_visibility(self) -> ZfGqlVisibility:
        return ZfGqlVisibility.HIDDEN


def _discriminate_app_info_container(data: Any) -> Literal['app', 'default']:
    if isinstance(data, Mapping):
        id_ = data.get('id')
    else:
        id_ = getattr(data, 'id', None)
    if isinstance(id_, str) and id_.endswith(':app'):
        return 'app'
    else:
        return 'default'


type ZfContainerUnion = Annotated[
    Annotated[ZfAppInfoContainer, Tag('app')]
    | Annotated[ZfDisplayContainer, Tag('default')],
    Discriminator(discriminator=_discriminate_app_info_container),
]
