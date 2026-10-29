from collections.abc import Iterable
from typing import Literal, TYPE_CHECKING

from pydantic import Field

from lla_zofar.api_schema.base import required_child
from .questions_matrix_base import ZfMatrixItem, ZfMatrixResponseDomain
from .questions_matrix_choice_base import (
    ZfChoiceMatrix,
)
from .questions_open import ZfOpenOption, ZfOpenQuestionFromOpenOptionBase

if TYPE_CHECKING:
    from .unions import ZfAnyElement


class ZfOpenMatrixOpenQuestion(ZfOpenQuestionFromOpenOptionBase):
    zf_open_option: ZfOpenOption

    @property
    def open_option(self) -> ZfOpenOption | None:
        return self.zf_open_option


class ZfOpenMatrixItem(ZfMatrixItem):
    type: Literal[
        'de.his.zofar.presentation.surveyengine.ui.components.question.matrix.open.UIOpenMatrixItem'
    ]
    children: 'list[ZfOpenOption]' = Field(
        validation_alias='childs', default_factory=list
    )

    def graphql_children(self) -> 'Iterable[ZfAnyElement]':
        for option in self.find_children(ZfOpenOption):
            yield ZfOpenMatrixOpenQuestion.model_construct(
                id=option.id, type='__fake__', zf_open_option=option
            )


class ZfOpenMatrixResponseDomain(ZfMatrixResponseDomain[ZfOpenMatrixItem]):
    type: Literal[
        'de.his.zofar.presentation.surveyengine.ui.components.question.matrix.open.UIOpenMatrixResponseDomain'
    ]

    ITEM_CLASS = ZfOpenMatrixItem
    UNIT_CLASS = None


class ZfOpenMatrix(ZfChoiceMatrix[ZfOpenMatrixResponseDomain]):
    type: Literal[
        'de.his.zofar.presentation.surveyengine.ui.components.question.matrix.open.UIOpenMatrix'
    ]

    RESPONSE_DOMAIN_CLASS = ZfOpenMatrixResponseDomain

    required_domain = required_child(ZfOpenMatrixResponseDomain)
