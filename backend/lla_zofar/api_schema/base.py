from enum import StrEnum
from types import UnionType
from typing import TYPE_CHECKING, Any, Iterable, Literal, overload

from pydantic import BaseModel, ConfigDict, Field, model_validator
from pydantic_core import PydanticCustomError

from ..zofar_form_field_ref import ZofarFormFieldRefType, ZofarFormFieldRefData

if TYPE_CHECKING:
    from .unions import ZfAnyElement


class ZfGqlVisibility(StrEnum):
    VISIBLE = 'visible'
    HIDDEN = 'hidden'
    REPLACE_WITH_CHILDREN = 'replace_with_children'


class ZfElement(BaseModel):
    """
    The base for all content elements that appear on the Zofar page.
    """

    model_config = ConfigDict(strict=True, frozen=True, defer_build=True)

    id: str
    type: str
    post: bool = Field(default=False)

    def get_children(self) -> 'Iterable[ZfElement]':
        """
        Get all children of this element.
        """
        return ()

    def form_field_references_recursive(self) -> Iterable[ZofarFormFieldRefData]:
        """
        Find all form fields in this element all its children. This method should not be overridden.
        """
        yield from self.form_field_references()
        for child in self.get_children():
            yield from child.form_field_references_recursive()

    def form_field_references(self) -> Iterable[ZofarFormFieldRefData]:
        """
        Get all form fields of this element.
        """
        if self.post:
            return (
                ZofarFormFieldRefData(
                    element_id=self.id,
                    type=ZofarFormFieldRefType.PLAIN,
                ),
            )
        return ()

    def graphql_form_values(self) -> Iterable[tuple[str, Any]]:
        """
        Any existing values for form controls represented by this element.
        They must be in the normalized format that the frontend expects, not in Zofar's format.
        """
        return ()

    def graphql_visibility(self) -> ZfGqlVisibility:
        """
        Whether and how this element should appear in GraphQL.
        """
        return ZfGqlVisibility.VISIBLE

    def graphql_children(self) -> 'Iterable[ZfAnyElement]':
        """
        The children of this element in GraphQL (if any).
        """
        return ()

    def graphql_elements(self) -> 'Iterable[ZfAnyElement]':
        """
        The elements that should appear in GraphQL where this element is.
        These may be zero (element is entirely hidden) or multiple elements.
        This shouldn't be overridden in subclasses, override graphql_children or graphql_visibility
        instead.
        """
        visibility = self.graphql_visibility()
        match visibility:
            case ZfGqlVisibility.VISIBLE:
                yield self
            case ZfGqlVisibility.REPLACE_WITH_CHILDREN:
                for child in self.graphql_children():
                    yield from child.graphql_elements()

    def graphql_references(self) -> 'Iterable[ZfAnyElement]':
        """
        Return all elements necessary to render this element, but does not include any children.
        """
        yield from self.graphql_elements()

    def graphql_references_recursive(self) -> 'Iterable[ZfAnyElement]':
        """
        Return all elements necessary to render this element, recursively.
        That is, return the element itself and any children or otherwise referenced elements.
        """
        for element in self.graphql_references():
            yield element
            for child in element.graphql_children():
                yield from child.graphql_references_recursive()


class ZfUnknownElement(ZfElement):
    pass


type ChildrenTypeCheckInput = type[ZfElement] | UnionType


class ZfParentElement(ZfElement):
    """
    An element that has children.
    """

    header: 'list[ZfAnyElement]' = Field(
        validation_alias='header', default_factory=list
    )
    children: 'list[ZfAnyElement]' = Field(
        validation_alias='childs', default_factory=list
    )

    def get_children(self) -> Iterable['ZfElement']:
        return self.children

    def graphql_children(self) -> 'Iterable[ZfElement]':
        yield from self.header
        yield from self.children

    @overload
    def find_children[T: ZfElement](
        self, child_type: type[T], *, search: Literal['children', 'header'] = 'children'
    ) -> Iterable[T]:
        """
        Find any elements that match the given type.
        :param child_type: the type to search
        :param search: where to search (children or header)
        """
        ...

    @overload
    def find_children(
        self, child_type: Any, *, search: Literal['children', 'header'] = 'children'
    ) -> 'Iterable[ZfElement]':
        """
        Find any elements that match the given type.
        :param child_type: the type to search
        :param search: where to search (children or header)
        """
        ...

    def find_children(
        self, child_type: Any, *, search: Literal['children', 'header'] = 'children'
    ) -> 'Iterable[ZfElement]':
        src = self.children if search == 'children' else self.header
        for child in src:
            if isinstance(child, child_type):
                yield child

    def find_children_recursive[T: ZfElement](self, child_type: type[T]) -> Iterable[T]:
        """
        Find any elements that match the given type, also search any children recursively.
        :param child_type: the type to search
        """
        for child in self.children:
            if isinstance(child, ZfParentElement):
                yield from child.find_children_recursive(child_type)
            if isinstance(child, child_type):
                yield child

    def has_child[T: ZfElement](self, child_type: type[T]) -> bool:
        """
        Check whether this element has any child of the given type.
        """
        return next(iter(self.find_children(child_type)), None) is not None

    def has_child_recursive[T: ZfElement](self, child_type: type[T]) -> bool:
        """
        Check whether this element has any child of the given type, checking recursively.
        """
        return next(iter(self.find_children_recursive(child_type)), None) is not None


def required_child(child_type: ChildrenTypeCheckInput) -> Any:
    """
    A validator that validates that the current element has at least one child of the given type.
    """

    def validator[P: ZfParentElement](parent: P) -> P:
        if not any(isinstance(child, child_type) for child in parent.children):
            raise PydanticCustomError(
                'zofar_children',
                '{parent_type} is required to have at least one child of {child_type}',
                {
                    'parent_type': type(parent).__name__,
                    'child_type': child_type.__name__,
                },
            )
        return parent

    return model_validator(mode='after')(validator)


def children_of_type(child_type: ChildrenTypeCheckInput) -> Any:
    """
    A validator that validates that the current element only has children of the given type.
    """

    def validator[P: ZfParentElement](parent: P) -> P:
        if any(not isinstance(child, child_type) for child in parent.children):
            raise PydanticCustomError(
                'zofar_children',
                '{parent_type} is required to have children of type {child_type}',
                {
                    'parent_type': type(parent).__name__,
                    'child_type': child_type.__name__,
                },
            )
        return parent

    return model_validator(mode='after')(validator)
