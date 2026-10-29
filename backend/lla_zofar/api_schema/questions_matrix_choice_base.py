import abc
from collections.abc import Iterable
from functools import cached_property
from typing import TYPE_CHECKING

from lla_zofar.api_schema.base import ZfParentElement
from lla_zofar.api_schema.questions_choice import ZfChoiceOptionBase
from .questions_matrix_base import (
    ZfMatrixItem,
    ZfMatrix,
    ZfMatrixResponseDomain,
    ZfMatrixUnit,
)
from .questions_open import ZfAttachedOpenQuestion
from .text import ZfTextElementBase

if TYPE_CHECKING:
    from .unions import ZfAnyElement


class ZfChoiceMatrixItemResponseDomain(ZfParentElement):
    pass


class ZfChoiceMatrixItem[C: ZfChoiceOptionBase](ZfMatrixItem, abc.ABC):
    @property
    @abc.abstractmethod
    def options(self) -> list[C]: ...

    @cached_property
    def attached_open_question(self) -> ZfAttachedOpenQuestion | None:
        header = ''.join(
            h.plain_text for h in self.find_children(ZfTextElementBase, search='header')
        )

        result = next(iter(self.find_children(ZfAttachedOpenQuestion)), None)
        if result is not None:
            result = result.model_copy(update={'prefix_': header})
        return result

    def graphql_children(self) -> 'Iterable[ZfAnyElement]':
        return self.options


class ZfChoiceMatrixUnit[ITM: ZfChoiceMatrixItem](ZfMatrixUnit[ITM]):
    pass


class ZfChoiceMatrixResponseDomain[ITM: ZfChoiceMatrixItem](
    ZfMatrixResponseDomain[ITM], abc.ABC
):
    pass


class ZfChoiceMatrix[RD: ZfChoiceMatrixResponseDomain](ZfMatrix[RD], abc.ABC):
    def graphql_references(self) -> 'Iterable[ZfAnyElement]':
        yield from super().graphql_references()
        for rd_child in self.response_domain.children:
            if isinstance(rd_child, self.response_domain.ITEM_CLASS):
                yield rd_child
            if self.response_domain.UNIT_CLASS is not None and isinstance(
                rd_child, self.response_domain.UNIT_CLASS
            ):
                yield rd_child
