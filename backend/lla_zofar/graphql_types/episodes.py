import datetime
from enum import Enum
from functools import cached_property

import strawberry
from django.conf import settings

from lla_zofar.api_schema.episodes import (
    ZfEpisodesConfig,
    ZfEpisodesConfigTypeValueItem,
    ZfEpisodesConfigCategory,
    ZfEpisodeValue,
    GAP_EPISODE_TYPE_ID,
    ZfEpisodesBase,
    ZfEpisodes,
    ZfEpisodesTable,
    ZfEpisodeValueState,
)
from lla_zofar.graphql_types.element import ZfElementGql


@strawberry.type(name='ZfEpisodeType')
class ZfEpisodeTypeGql:
    _episode_config: strawberry.Private[ZfEpisodesConfig]
    _zf_type: strawberry.Private[ZfEpisodesConfigTypeValueItem | None] = None
    _zf_category_gql: strawberry.Private['ZfEpisodeCategoryGql | None'] = None
    _zf_type_id: strawberry.Private[str | None] = None

    @cached_property
    def _resolved_zf_type(self) -> ZfEpisodesConfigTypeValueItem:
        if self._zf_type is None:
            _type = next(
                (
                    t
                    for t in self._episode_config.type.values
                    if t.id == self._zf_type_id
                ),
                None,
            )
            if _type is None:
                raise ValueError(
                    f"Reference to unknown episode type '{self._zf_type_id}'!"
                )
            return _type
        else:
            return self._zf_type

    @strawberry.field()
    def id(self) -> str:
        return self._zf_type_id if self._zf_type_id else self._zf_type.id

    @strawberry.field()
    def label(self) -> str:
        return self._resolved_zf_type.label

    @strawberry.field()
    def description(self) -> str:
        return self._resolved_zf_type.description

    @strawberry.field()
    def category(self) -> 'ZfEpisodeCategoryGql':
        if self._zf_category_gql is not None:
            return self._zf_category_gql
        else:
            type_id = self.id()
            zf_category = next(
                (
                    c
                    for c in self._episode_config.clean_categories
                    if type_id in c.type_ids
                ),
                None,
            )
            if zf_category is None:
                raise ValueError(f"Category not found for episode type '{type_id}'!")
            return ZfEpisodeCategoryGql(
                _episode_config=self._episode_config,
                _zf_category=zf_category,
            )

    @strawberry.field()
    def allow_events(self) -> bool:
        return settings.LLA_CONFIG.zofar.events_enabled and self.id() == 'oth'

    @strawberry.field()
    def has_detail_questions(self) -> bool:
        return self.id() not in ('sco', 'fam', 'mpl')


@strawberry.type(name='ZfEpisodeCategory')
class ZfEpisodeCategoryGql:
    _episode_config: strawberry.Private[ZfEpisodesConfig]
    _zf_category: strawberry.Private[ZfEpisodesConfigCategory]

    @strawberry.field()
    def id(self) -> str:
        return self._zf_category.id

    @strawberry.field()
    def label(self) -> str:
        return self._zf_category.label

    @strawberry.field()
    def sort_index(self) -> int:
        return next(
            i
            for i, c in enumerate(self._episode_config.clean_categories)
            if c.id == self._zf_category.id
        )

    @strawberry.field()
    def type_ids(self) -> list[str]:
        return self._zf_category.type_ids

    @strawberry.field()
    def types(self) -> list[ZfEpisodeTypeGql]:
        return [
            ZfEpisodeTypeGql(
                _episode_config=self._episode_config,
                _zf_type_id=type_id,
                _zf_category_gql=self,
            )
            for type_id in self._zf_category.type_ids
        ]


@strawberry.enum(name='ZfEpisodeFlags')
class ZfEpisodeFlagsGql(Enum):
    BEFORE_START = 'sHO'
    AFTER_END = 'eHO'


@strawberry.enum(name='ZfEpisodeState')
class ZfEpisodeStateGql(Enum):
    new = 'NEW'
    done = 'DONE'
    updated = 'UPDATED'


@strawberry.type(name='ZfEpisodeEntry')
class ZfEpisodeEntryGql:
    raw_value: strawberry.Private[ZfEpisodeValue]

    @strawberry.field()
    def id(self) -> str:
        return self.raw_value.id

    @strawberry.field()
    def label(self) -> str:
        return self.raw_value.name

    @strawberry.field()
    def episode_type_id(self) -> str:
        return self.raw_value.type

    @strawberry.field()
    def start_date(self) -> datetime.date:
        return self.raw_value.start_date

    @strawberry.field()
    def end_date(self) -> datetime.date:
        return self.raw_value.end_date

    @strawberry.field()
    def event(self) -> bool:
        return self.raw_value.event

    @strawberry.field()
    def gap(self) -> bool:
        return self.raw_value.type == GAP_EPISODE_TYPE_ID

    @strawberry.field()
    def badge(self) -> str | None:
        return self.raw_value.badge

    @strawberry.field()
    def state(self) -> ZfEpisodeStateGql:
        return ZfEpisodeStateGql[self.raw_value.state.name]

    @strawberry.field()
    def flags(self) -> list[ZfEpisodeFlagsGql]:
        return [
            ZfEpisodeFlagsGql(v) for v in self.raw_value.flags if v in ZfEpisodeFlagsGql
        ]

    @strawberry.field()
    def allow_edit_dialog(self) -> bool:
        return not (
            self.raw_value.aufsatz and self.raw_value.state == ZfEpisodeValueState.new
        )


@strawberry.interface(name='ZfEpisodesBase')
class ZfEpisodesBaseGql[T: ZfEpisodesBase](ZfElementGql[T]):
    @strawberry.field()
    def min_date(self) -> datetime.date:
        return self.zf_element.min_date

    @strawberry.field()
    def max_date(self) -> datetime.date:
        return self.zf_element.max_date

    @strawberry.field()
    def save_btn_label(self) -> str:
        return self.zf_element.config.dialog_btn_save_label

    @strawberry.field()
    def cancel_btn_label(self) -> str:
        return self.zf_element.config.dialog_btn_cancel_label

    @strawberry.field()
    def name_field_label(self) -> str:
        return self.zf_element.config.name.label

    @strawberry.field()
    def type_field_label(self) -> str:
        return self.zf_element.config.type.label

    @strawberry.field()
    def start_field_label(self) -> str:
        return self.zf_element.config.dialog_range_start_label

    @strawberry.field()
    def end_field_label(self) -> str:
        return self.zf_element.config.dialog_range_end_label

    @strawberry.field()
    def before_start_field_label(self) -> str:
        return f'{self.zf_element.config.dialog_range_before_start_label} {{{{date}}}}'

    @strawberry.field()
    def after_end_field_label(self) -> str:
        return f'{self.zf_element.config.dialog_range_after_end_label} {{{{date}}}}'

    @strawberry.field()
    def episode_types(self) -> list[ZfEpisodeTypeGql]:
        zf_episodes_config = self.zf_element.config
        return [
            ZfEpisodeTypeGql(_episode_config=zf_episodes_config, _zf_type=zf_type)
            for zf_type in zf_episodes_config.type.clean_values
        ]

    @strawberry.field()
    def episode_categories(self) -> list[ZfEpisodeCategoryGql]:
        zf_episode_config = self.zf_element.config
        return [
            ZfEpisodeCategoryGql(_episode_config=zf_episode_config, _zf_category=c)
            for c in zf_episode_config.clean_categories
        ]

    @strawberry.field()
    def entries(self) -> list[ZfEpisodeEntryGql]:
        return [
            ZfEpisodeEntryGql(raw_value=value)
            for value in self.zf_element.visible_values()
        ]


@strawberry.type(name='ZfEpisodesCalendarElement')
class ZfEpisodesCalendarGql(ZfEpisodesBaseGql[ZfEpisodes]):
    pass


@strawberry.type(name='ZfEpisodesTableElement')
class ZfEpisodesTableGql(ZfEpisodesBaseGql[ZfEpisodesTable]):
    pass
