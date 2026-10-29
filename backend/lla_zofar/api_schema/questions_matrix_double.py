from collections.abc import Iterable
from functools import cached_property
from typing import Literal, TYPE_CHECKING, Any

from pydantic import Field

from lla_zofar.api_schema.questions_matrix_base import (
    ZfMatrixItem,
    ZfMatrix,
    ZfMatrixResponseDomain,
)
from lla_zofar.api_schema.questions_matrix_single_choice import (
    ZfSingleChoiceMatrixItemResponseDomain,
)

if TYPE_CHECKING:
    from .unions import ZfAnyElement


class ZfSingleChoiceMatrixItemResponseDomainInDoubleMatrix(
    ZfSingleChoiceMatrixItemResponseDomain
):
    _title: str | None = None

    @property
    def title(self) -> str:
        if (title := self._title) is None:
            raise RuntimeError(
                'ZfSingleChoiceMatrixItemResponseDomainInDoubleMatrix title '
                'not initialized'
            )
        return title


class ZfDoubleMatrixItem(ZfMatrixItem):
    # noinspection PyTypeHints
    type: Literal[
        'de.his.zofar.presentation.surveyengine.ui.components.question.composite.'
        'doublematrix.UIDoubleMatrixItem'
    ]
    question: list[str] = Field()
    left: ZfSingleChoiceMatrixItemResponseDomainInDoubleMatrix
    right: ZfSingleChoiceMatrixItemResponseDomainInDoubleMatrix

    @cached_property
    def label(self) -> str:
        return ''.join(self.question)

    def graphql_children(self) -> 'Iterable[ZfAnyElement]':
        yield self.left
        yield self.right


class ZfDoubleMatrixResponseDomain(ZfMatrixResponseDomain[ZfDoubleMatrixItem]):
    ITEM_CLASS = ZfDoubleMatrixItem

    # noinspection PyTypeHints
    type: Literal[
        'de.his.zofar.presentation.surveyengine.ui.components.question.composite.'
        'doublematrix.UIDoubleMatrixResponseDomain'
    ]
    left_header: list[str] = Field(alias='left-header')
    right_header: list[str] = Field(alias='right-header')

    def model_post_init(self, context: Any, /) -> None:
        super().model_post_init(context)

        left_header = ''.join(self.left_header)
        right_header = ''.join(self.right_header)

        for item in self.items:
            item.left._title = left_header
            item.right._title = right_header


class ZfDoubleMatrix(ZfMatrix[ZfDoubleMatrixResponseDomain]):
    RESPONSE_DOMAIN_CLASS = ZfDoubleMatrixResponseDomain
    # noinspection PyTypeHints
    type: Literal[
        'de.his.zofar.presentation.surveyengine.ui.components.question.composite.'
        'doublematrix.UIDoubleMatrix'
    ]
