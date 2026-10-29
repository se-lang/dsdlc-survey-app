from functools import cached_property
from typing import Literal, NamedTuple, TYPE_CHECKING, Iterable, Any

from pydantic import Field, field_validator

from lla_zofar.api_schema.base import ZfGqlVisibility, required_child
from lla_zofar.api_schema.questions_choice import (
    ZfChoiceOptionBase,
    ZfChoiceResponseDomainBase,
    ZfChoiceQuestionBase,
)
from lla_zofar.api_schema.specials import ZfSpecialNullToNone
from lla_zofar.zofar_form_field_ref import ZofarFormFieldRefData, ZofarFormFieldRefType

if TYPE_CHECKING:
    pass


class ZfMultipleChoiceOption(ZfChoiceOptionBase):
    type: Literal[
        'de.his.zofar.presentation.surveyengine.ui.components.answer.options.MultipleOption'
    ]
    is_missing_item: bool = Field(validation_alias='missingItem', strict=False)
    order_index: int | None = Field(validation_alias='data-sequence', default=None)
    input_exclusive: bool = Field(validation_alias='input-exclusive', strict=False)
    possible_values: list[ZfSpecialNullToNone] = Field(
        validation_alias='possible-values'
    )

    def form_field_references(self) -> Iterable[ZofarFormFieldRefData]:
        return (
            ZofarFormFieldRefData(
                element_id=self.id,
                type=ZofarFormFieldRefType.MULTIPLE_CHOICE,
                multiple_choice_value=self.form_value,
            ),
        )

    def graphql_form_values(self) -> Iterable[tuple[str, Any]]:
        yield self.id, self.input_selected

    @cached_property
    def form_value(self) -> str:
        return next(v for v in self.possible_values if v is not None)

    @field_validator('possible_values', mode='after')
    @classmethod
    def validate_possible_values(cls, value: list[str | None]) -> list[str | None]:
        match value:
            case (None, str()) | (str(), None) | (str(),):
                pass
            case _:
                raise ValueError(
                    'possible_values must contain exactly one concrete value for '
                    'MultipleOption'
                )
        return value


class ZfMultipleChoiceResponseDomain(ZfChoiceResponseDomainBase):
    type: Literal[
        'de.his.zofar.presentation.surveyengine.ui.components.answer.responseDomain.MultipleChoiceResponseDomain'
    ]


class ZfEpisodesLoopCheckData(NamedTuple):
    id: str
    value: str


class ZfMultipleChoiceQuestion(
    ZfChoiceQuestionBase[ZfMultipleChoiceOption, ZfMultipleChoiceResponseDomain]
):
    type: Literal[
        'de.his.zofar.presentation.surveyengine.ui.components.question.atomic.UIMultipleChoiceQuestion'
    ]

    CHOICE_CLASS = ZfMultipleChoiceOption
    RESPONSE_DOMAIN_CLASS = ZfMultipleChoiceResponseDomain

    validate_children = required_child(ZfMultipleChoiceResponseDomain)

    @cached_property
    def episodes_loop_check(self) -> ZfEpisodesLoopCheckData | None:
        match self.children:
            case [
                ZfMultipleChoiceResponseDomain(
                    children=[
                        ZfMultipleChoiceOption(
                            id=str() as option_id,
                            label='loopCheck',
                            post=True,
                            possible_values=(None, str() as value)
                            | (str() as value, None),
                        )
                    ]
                )
            ]:
                return ZfEpisodesLoopCheckData(option_id, value)
            case _:
                return None

    @property
    def episodes_loop_check_id(self) -> str | None:
        lc = self.episodes_loop_check
        return lc.id if lc is not None else None

    def graphql_visibility(self) -> ZfGqlVisibility:
        if self.episodes_loop_check_id is not None:
            return ZfGqlVisibility.HIDDEN
        return super().graphql_visibility()
