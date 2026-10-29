from abc import ABC, abstractmethod
from functools import cached_property
from typing import Literal, Any, Iterable, TYPE_CHECKING

from pydantic import Field

from lla_zofar.api_schema.base import required_child
from lla_zofar.api_schema.questions_choice import (
    ZfChoiceOptionBase,
    ZfChoiceResponseDomainBase,
    ZfChoiceQuestionBase,
)

if TYPE_CHECKING:
    pass


class ZfSingleChoiceOption(ZfChoiceOptionBase):
    type: Literal[
        'de.his.zofar.presentation.surveyengine.ui.components.answer.options.SingleOption'
    ]
    is_missing_item: bool = Field(validation_alias='missingItem', strict=False)
    label_option: bool = Field(validation_alias='labelOption', default=False)
    data_sequence: int | None = Field(validation_alias='data-sequence', default=None)
    value: str


class ZfSingleChoiceResponseDomainBase(ZfChoiceResponseDomainBase, ABC):
    possible_values: Any = Field(validation_alias='possible-values')

    @property
    @abstractmethod
    def real_options(self) -> list[ZfSingleChoiceOption]: ...


class ZfDropdownMissingResponseDomain(ZfSingleChoiceResponseDomainBase):
    type: Literal[
        'de.his.zofar.presentation.surveyengine.ui.components.answer.responseDomain.UIDropDownMissingResponseDomain'
    ]
    dropdown_children: list[ZfSingleChoiceOption] = Field(
        validation_alias='dropdown-childs'
    )
    missing_children: Any = Field(validation_alias='missing-childs', default=None)

    @cached_property
    def real_options(self) -> list[ZfSingleChoiceOption]:
        return [opt for opt in self.dropdown_children if not opt.label_option]

    def graphql_children(self) -> 'Iterable[ZfSingleChoiceOption]':
        return self.real_options


class ZfRadioButtonSingleChoiceResponseDomain(ZfSingleChoiceResponseDomainBase):
    type: Literal[
        'de.his.zofar.presentation.surveyengine.ui.components.answer.responseDomain.RadioButtonSingleChoiceResponseDomain'
    ]

    @cached_property
    def real_options(self) -> list[ZfSingleChoiceOption]:
        return [
            opt
            for opt in self.find_children_recursive(ZfSingleChoiceOption)
            if not opt.label_option
        ]


class ZfSingleChoiceQuestionBase(
    ZfChoiceQuestionBase[ZfSingleChoiceOption, ZfSingleChoiceResponseDomainBase]
):
    validate_children = required_child(ZfSingleChoiceResponseDomainBase)
    CHOICE_CLASS = ZfSingleChoiceOption
    RESPONSE_DOMAIN_CLASS = ZfSingleChoiceResponseDomainBase

    @property
    def options(self) -> list[ZfSingleChoiceOption]:
        return self.response_domain.real_options

    def graphql_form_values(self) -> Iterable[tuple[str, str | None]]:
        selected_option = next(
            iter(option for option in self.options if option.input_selected), None
        )
        if selected_option:
            yield self.response_domain.id, selected_option.value


class ZfSingleChoiceQuestion(ZfSingleChoiceQuestionBase):
    type: Literal[
        'de.his.zofar.presentation.surveyengine.ui.components.question.atomic.UISingleChoiceQuestion'
    ]
