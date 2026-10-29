import abc
from collections.abc import Iterable
from functools import cached_property
from typing import TYPE_CHECKING, ClassVar, Any

from lla_zofar.api_schema.base import ZfParentElement
from lla_zofar.api_schema.questions_open import ZfAttachedOpenQuestion
from .text import ZfTextElementBase

if TYPE_CHECKING:
    from .unions import ZfAnyElement


class ZfMatrixItem(ZfParentElement, abc.ABC):
    _unit_label: str | None = None

    @property
    def unit_label(self) -> str | None:
        return self._unit_label

    @cached_property
    def label(self) -> str:
        return ''.join(
            el.plain_text for el in self.header if isinstance(el, ZfTextElementBase)
        )

    @property
    def attached_open_question(self) -> ZfAttachedOpenQuestion | None:
        return None

    def graphql_references(self) -> 'Iterable[ZfAnyElement]':
        yield from super().graphql_references()
        yield self
        if (attached_open := self.attached_open_question) is not None:
            yield attached_open


class ZfMatrixUnit[ITM: ZfMatrixItem](ZfParentElement, abc.ABC):
    ITEM_CLASS: ClassVar[type]

    def get_label(self) -> str:
        return ''.join(
            el.plain_text
            for el in self.find_children(ZfTextElementBase, search='header')
        )


class ZfMatrixResponseDomain[ITM: ZfMatrixItem](ZfParentElement, abc.ABC):
    ITEM_CLASS: ClassVar[type]
    UNIT_CLASS: ClassVar[type | None] = None

    @cached_property
    def items(self) -> list[ITM]:
        return list(self.find_children_recursive(self.ITEM_CLASS))

    def graphql_references(self) -> 'Iterable[ZfAnyElement]':
        for item in self.items:
            yield from item.graphql_references()

    def model_post_init(self, context: Any, /) -> None:
        if self.UNIT_CLASS is not None:
            for unit in self.find_children(self.UNIT_CLASS):
                unit_label = unit.get_label()
                if unit_label:
                    for unit_item in unit.find_children(self.ITEM_CLASS):
                        unit_item._unit_label = unit_label


class ZfMatrix[RD: ZfMatrixResponseDomain](ZfParentElement, abc.ABC):
    RESPONSE_DOMAIN_CLASS: ClassVar[type]

    @cached_property
    def response_domain(self) -> RD:
        return next(iter(self.find_children(self.RESPONSE_DOMAIN_CLASS)))

    def graphql_references(self) -> 'Iterable[ZfAnyElement]':
        yield self
        yield from self.header
        yield from self.response_domain.graphql_references()

    def graphql_children(self) -> 'Iterable[ZfAnyElement]':
        yield from self.header
