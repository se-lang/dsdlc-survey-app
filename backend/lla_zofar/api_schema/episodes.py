import calendar
import dataclasses
import datetime
import logging
from collections.abc import Iterable
from contextvars import ContextVar
from enum import Enum, StrEnum
from functools import cached_property
from typing import Literal, Self

from pydantic import (
    BaseModel,
    Field,
    model_validator,
    ConfigDict,
    TypeAdapter,
)
from pydantic_extra_types.color import Color

from lla_zofar.api_schema.base import ZfElement
from lla_zofar.api_schema.specials import ZfEpisodeDate, ZfHtmlEntities

logger = logging.getLogger(__name__)


class ZfEpisodesConfigTypeValueItem(BaseModel):
    id: str
    label: ZfHtmlEntities
    description: ZfHtmlEntities


class ZfEpisodesConfigTypeValueItemWithColor(ZfEpisodesConfigTypeValueItem):
    color: Color


class ZfEpisodesConfigCategory(BaseModel):
    id: str
    label: ZfHtmlEntities
    type_ids: list[str] = Field(validation_alias='typeIds')


GAP_EPISODE_TYPE_ID = 'gap'
GAP_EPISODE_CATEGORY_ID = 'gap'


class ZfEpisodesConfigType[VALUE_ITEM_TYPE: ZfEpisodesConfigTypeValueItem](BaseModel):
    label: str
    values: list[VALUE_ITEM_TYPE]

    @cached_property
    def clean_values(self) -> list[VALUE_ITEM_TYPE]:
        return [
            item
            for item in self.values
            if item.id not in ('SlotDefault', GAP_EPISODE_TYPE_ID)
        ]


class ZfEpisodesConfigName(BaseModel):
    label: str
    values: str


class ZfEpisodesConfig[
    VALUE_ITEM_TYPE: ZfEpisodesConfigTypeValueItem = ZfEpisodesConfigTypeValueItem
](BaseModel):
    type: ZfEpisodesConfigType[VALUE_ITEM_TYPE]
    categories: list[ZfEpisodesConfigCategory]
    name: ZfEpisodesConfigName
    actions: dict[str, str]
    min_month_label: ZfHtmlEntities = Field(validation_alias='minMonth.label')
    max_month_label: ZfHtmlEntities = Field(validation_alias='maxMonth.label')
    dialog_title: ZfHtmlEntities = Field(validation_alias='dialog.title')
    dialog_btn_save_label: ZfHtmlEntities = Field(
        validation_alias='dialog.btn.save.label'
    )
    dialog_btn_cancel_label: ZfHtmlEntities = Field(
        validation_alias='dialog.btn.cancel.label'
    )
    dialog_range_start_label: ZfHtmlEntities = Field(
        validation_alias='dialog.range.start.label'
    )
    dialog_range_before_start_label: ZfHtmlEntities = Field(
        validation_alias='dialog.range.beforestart.label'
    )
    dialog_range_after_end_label: ZfHtmlEntities = Field(
        validation_alias='dialog.range.afterend.label'
    )
    dialog_range_end_label: ZfHtmlEntities = Field(
        validation_alias='dialog.range.end.label'
    )

    @cached_property
    def clean_categories(self) -> list[ZfEpisodesConfigCategory]:
        assigned_type_ids = set(
            type_id for c in self.categories for type_id in c.type_ids
        )
        missing_type_ids = [
            t.id for t in self.type.clean_values if t.id not in assigned_type_ids
        ]
        new_categories = [
            category
            for category in self.categories
            if category.id != GAP_EPISODE_CATEGORY_ID
        ]
        if missing_type_ids:
            if len(new_categories) == 0:
                logger.warning(
                    'Generating fake "Other" category for unassigned episode types (%s)'
                    ' when there are no categories configured.',
                    missing_type_ids,
                )
                return [
                    ZfEpisodesConfigCategory(
                        id='__dummy__other',
                        label='Sonstiges',
                        type_ids=missing_type_ids,
                    )
                ]
            else:
                last_category = new_categories[-1]
                logger.warning(
                    'Assigning unassigned episode types (%s) to last category %s'
                    ' automatically',
                    missing_type_ids,
                    last_category.label,
                )
                new_categories[-1] = last_category.model_copy(
                    update={'type_ids': [*last_category.type_ids, *missing_type_ids]}
                )
        return new_categories


class ZfEpisodeValueState(Enum):
    new = 'new'
    done = 'done'
    updated = 'updated'


class ZfEpisodeValueFlag(StrEnum):
    start_hangover = 'sHO'
    end_hangover = 'eHO'
    generated_parent = 'gEP'
    generated_child = 'gEC'
    unknown1 = 'noM'
    unknown2 = 'iJo'


@dataclasses.dataclass(frozen=True)
class EpisodeDataValidationContext:
    type_ids: set[str]


_episode_data_validation_context_var: ContextVar[EpisodeDataValidationContext] = (
    ContextVar('EpisodeDataValidationContext')
)


class ZfEpisodeValue(BaseModel):
    model_config = ConfigDict(
        validate_by_alias=True,
        validate_by_name=True,
        serialize_by_alias=True,
        extra='allow',
    )

    id: str = Field(strict=False, coerce_numbers_to_str=True)
    type: str
    type_color: str = Field(alias='typeColor')
    name: str = Field(default='')
    start_date: ZfEpisodeDate = Field(alias='startDate')
    end_date: ZfEpisodeDate = Field(alias='endDate')
    state: ZfEpisodeValueState
    flags: set[ZfEpisodeValueFlag] = Field(default_factory=set)
    event: bool = Field(default=False)
    hidden: bool = Field(default=False)
    badge: str | None = Field(default=None)
    aufsatz: bool = Field(default=False, strict=False)

    @model_validator(mode='after')
    def validate_start_end(self) -> Self:
        if self.start_date > self.end_date:
            raise ValueError("'startDate' must be before 'endDate'")
        return self


zf_episode_value_list_type_adapter = TypeAdapter(list[ZfEpisodeValue])


class ZfEpisodesBase[VALUE_ITEM_TYPE: ZfEpisodesConfigTypeValueItem](ZfElement):
    min_year: int = Field(validation_alias='minYear', gt=0, strict=False)
    max_year: int = Field(validation_alias='maxYear', gt=0, strict=False)
    min_month: int = Field(validation_alias='minMonth', ge=1, le=12, strict=False)
    max_month: int = Field(validation_alias='maxMonth', ge=1, le=12, strict=False)
    config: ZfEpisodesConfig[VALUE_ITEM_TYPE]
    value: list[ZfEpisodeValue]

    def visible_values(self) -> Iterable[ZfEpisodeValue]:
        for v in self.value:
            if not v.hidden:
                yield v

    @property
    def min_date(self) -> datetime.date:
        return datetime.date(self.min_year, self.min_month, 1)

    @property
    def max_date(self) -> datetime.date:
        return datetime.date(
            year=self.max_year,
            month=self.max_month,
            day=calendar.monthrange(self.max_year, self.max_month)[1],
        )

    @model_validator(mode='after')
    def validate_min_max_date(self) -> Self:
        if self.min_date > self.max_date:
            raise ValueError(
                "'minYear' with 'minMonth' must be less than or equal to 'maxYear' with maxMonth"
            )
        return self

    @model_validator(mode='after')
    def validate_value_type_ids(self) -> Self:
        type_ids = set(v.id for v in self.config.type.values)
        for value_item in self.value:
            if value_item.type not in type_ids and value_item.type != 'gap':
                raise ValueError(f'Invalid episode type ID {value_item.type}')
        return self


class ZfEpisodes(ZfEpisodesBase[ZfEpisodesConfigTypeValueItemWithColor]):
    type: Literal[
        'de.his.zofar.presentation.surveyengine.ui.components.composite.episodes.UIEpisodes'
    ]


class ZfEpisodesTable(ZfEpisodesBase[ZfEpisodesConfigTypeValueItem]):
    type: Literal[
        'de.his.zofar.presentation.surveyengine.ui.components.composite.episodes.UIEpisodesTable'
    ]
