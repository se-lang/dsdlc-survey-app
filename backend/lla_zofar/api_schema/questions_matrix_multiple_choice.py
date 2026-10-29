from functools import cached_property
from typing import Literal


from lla_zofar.api_schema.base import required_child
from .questions_matrix_choice_base import (
    ZfChoiceMatrixItem,
    ZfChoiceMatrixResponseDomain,
    ZfChoiceMatrix,
    ZfChoiceMatrixUnit,
)
from .questions_multiple_choice import ZfMultipleChoiceOption


class ZfMultipleChoiceMatrixItem(ZfChoiceMatrixItem[ZfMultipleChoiceOption]):
    type: Literal[
        'de.his.zofar.presentation.surveyengine.ui.components.question.matrix.multiplechoice.UIMultipleChoiceCompositeItem'
    ]

    @cached_property
    def options(self) -> list[ZfMultipleChoiceOption]:
        return list(self.find_children(ZfMultipleChoiceOption))


class ZfMultipleChoiceMatrixUnit(ZfChoiceMatrixUnit[ZfMultipleChoiceMatrixItem]):
    type: Literal[
        'de.his.zofar.presentation.surveyengine.ui.components.question.matrix.multiplechoice.UIMultipleChoiceCompositeResponseDomainUnit'
    ]
    ITEM_CLASS = ZfMultipleChoiceMatrixItem


class ZfMultipleChoiceMatrixResponseDomain(
    ZfChoiceMatrixResponseDomain[ZfMultipleChoiceMatrixItem]
):
    type: Literal[
        'de.his.zofar.presentation.surveyengine.ui.components.question.matrix.multiplechoice.UIMultipleChoiceCompositeResponseDomain'
    ]

    ITEM_CLASS = ZfMultipleChoiceMatrixItem
    UNIT_CLASS = ZfMultipleChoiceMatrixUnit


class ZfMultipleChoiceMatrix(ZfChoiceMatrix[ZfMultipleChoiceMatrixResponseDomain]):
    type: Literal[
        'de.his.zofar.presentation.surveyengine.ui.components.question.matrix.multiplechoice.UIMultipleChoiceComposite'
    ]

    RESPONSE_DOMAIN_CLASS = ZfMultipleChoiceMatrixResponseDomain

    required_domain = required_child(ZfMultipleChoiceMatrixResponseDomain)
