from collections.abc import Iterable
from functools import cached_property
from typing import Literal

from lla_zofar.api_schema.base import ZfParentElement, required_child
from lla_zofar.api_schema.questions_single_choice import (
    ZfSingleChoiceOption,
    ZfDropdownMissingResponseDomain,
)
from .questions_matrix_choice_base import (
    ZfChoiceMatrixItemResponseDomain,
    ZfChoiceMatrixItem,
    ZfChoiceMatrixResponseDomain,
    ZfChoiceMatrix,
)


class ZfSingleChoiceMatrixItemResponseDomain(ZfChoiceMatrixItemResponseDomain):
    type: Literal[
        'de.his.zofar.presentation.surveyengine.ui.components.question.matrix.singlechoice.UISingleChoiceMatrixItemResponseDomain'
    ]


class ZfSingleChoiceMatrixItem(
    ZfChoiceMatrixItem[ZfSingleChoiceOption], ZfParentElement
):
    type: Literal[
        'de.his.zofar.presentation.surveyengine.ui.components.question.matrix.singlechoice.UISingleChoiceMatrixItem'
    ]

    required_domain = required_child(
        ZfSingleChoiceMatrixItemResponseDomain | ZfDropdownMissingResponseDomain
    )

    @cached_property
    def label(self) -> str:
        label_option = next((opt for opt in self.all_options if opt.label_option), None)
        if label_option:
            return label_option.label
        else:
            return super().label

    @cached_property
    def response_domain(
        self,
    ) -> ZfSingleChoiceMatrixItemResponseDomain | ZfDropdownMissingResponseDomain:
        return next(
            iter(
                self.find_children(
                    ZfSingleChoiceMatrixItemResponseDomain
                    | ZfDropdownMissingResponseDomain
                )
            )
        )

    def graphql_form_values(self) -> Iterable[tuple[str, str | None]]:
        selected_option = next(
            iter(option for option in self.options if option.input_selected), None
        )
        if selected_option:
            yield self.response_domain.id, selected_option.value

    @cached_property
    def all_options(self) -> list[ZfSingleChoiceOption]:
        rd = self.response_domain
        if isinstance(rd, ZfDropdownMissingResponseDomain):
            return self.response_domain.dropdown_children
        else:
            return list(self.response_domain.find_children(ZfSingleChoiceOption))

    @cached_property
    def options(self) -> list[ZfSingleChoiceOption]:
        return [opt for opt in self.all_options if not opt.label_option]


class ZfSingleChoiceMatrixResponseDomain(
    ZfChoiceMatrixResponseDomain[ZfSingleChoiceMatrixItem]
):
    type: Literal[
        'de.his.zofar.presentation.surveyengine.ui.components.question.matrix.singlechoice.UISingleChoiceMatrixResponseDomain'
    ]
    differential: Literal[False]

    ITEM_CLASS = ZfSingleChoiceMatrixItem
    UNIT_CLASS = None  # Single choice don't seem to have units?


class ZfSingleChoiceMatrix(ZfChoiceMatrix[ZfSingleChoiceMatrixResponseDomain]):
    type: Literal[
        'de.his.zofar.presentation.surveyengine.ui.components.question.matrix.singlechoice.UISingleChoiceMatrix'
    ]

    RESPONSE_DOMAIN_CLASS = ZfSingleChoiceMatrixResponseDomain

    required_domain = required_child(ZfSingleChoiceMatrixResponseDomain)
