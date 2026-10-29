import abc
from collections.abc import Iterable, Sequence
from functools import cached_property
from typing import ClassVar, TYPE_CHECKING, Literal

from pydantic import Field

from lla_zofar.api_schema.base import ZfParentElement, ZfGqlVisibility
from lla_zofar.api_schema.questions_open import ZfAttachedOpenQuestion
from lla_zofar.api_schema.specials import ZfDoubleEncodedHtml

if TYPE_CHECKING:
    from lla_zofar.api_schema.unions import ZfAnyElement


class ZfChoiceOptionBase(ZfParentElement, abc.ABC):
    input_selected: bool = Field(
        validation_alias='input-selected', strict=False, default=False
    )
    label: ZfDoubleEncodedHtml
    label_position: Literal['left', 'right'] = Field(validation_alias='label-position')

    @cached_property
    def attached_open_questions(self) -> Sequence[ZfAttachedOpenQuestion]:
        return tuple(self.find_children(ZfAttachedOpenQuestion))


class ZfChoiceResponseDomainBase(ZfParentElement):
    def graphql_visibility(self) -> ZfGqlVisibility:
        return ZfGqlVisibility.REPLACE_WITH_CHILDREN


class ZfChoiceQuestionBase[C: ZfChoiceOptionBase, RD: ZfChoiceResponseDomainBase](
    ZfParentElement
):
    CHOICE_CLASS: ClassVar[type]
    RESPONSE_DOMAIN_CLASS: ClassVar[type]

    @cached_property
    def options(self) -> list[C]:
        return list(self.response_domain.find_children_recursive(self.CHOICE_CLASS))

    def graphql_children(self) -> 'Iterable[ZfAnyElement]':
        yield from self.header
        for child in self.children:
            # https://youtrack.jetbrains.com/issue/PY-32860/Type-variables-cannot-be-used-with-instance-and-class-checks-error-due-to-type-annotation-with-type-variables
            # noinspection PyTypeHints
            if not isinstance(child, (self.RESPONSE_DOMAIN_CLASS, self.CHOICE_CLASS)):
                yield child

    def graphql_references(self) -> 'Iterable[ZfAnyElement]':
        yield from super().graphql_references()
        if self.graphql_visibility() != ZfGqlVisibility.HIDDEN:
            yield from self.options

    @cached_property
    def response_domain(self) -> RD:
        return next(iter(self.find_children(self.RESPONSE_DOMAIN_CLASS)))
