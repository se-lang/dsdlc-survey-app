from collections.abc import Iterable
from functools import cached_property
from typing import Literal

from pydantic import Field

from .base import ZfParentElement, ZfElement
from .text import ZfTitleTextElement


class ZfSectionElement(ZfParentElement):
    type: Literal[
        'de.his.zofar.presentation.surveyengine.ui.components.container.Section'
    ]
    page: bool = Field(strict=False, default=False)
    accordion: bool = Field(strict=False, default=False)

    @cached_property
    def title_element(self) -> ZfTitleTextElement | None:
        if self.page:
            return next(
                iter(self.find_children(ZfTitleTextElement, search='header')), None
            )
        else:
            return None

    def graphql_children(self) -> 'Iterable[ZfElement]':
        if (title := self.title_element) is not None:
            # Make sure we don't include the title element in the children
            yield from filter(lambda c: c is not title, self.header)
            yield from self.children
        else:
            yield from super().graphql_children()
