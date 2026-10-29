from collections.abc import Mapping, Iterable
from typing import Literal, Annotated, Any

from pydantic import Field, Discriminator, Tag

from lla_zofar.api_schema.questions_matrix_single_choice import (
    ZfSingleChoiceMatrix,
    ZfSingleChoiceMatrixResponseDomain,
    ZfSingleChoiceMatrixItem,
)


class ZfDifferentialSingleChoiceMatrixItem(ZfSingleChoiceMatrixItem):
    pass


class ZfDifferentialMatrixResponseDomain(ZfSingleChoiceMatrixResponseDomain):
    differential: Literal[True]
    children: list[ZfDifferentialSingleChoiceMatrixItem] = Field(
        validation_alias='childs', default_factory=list
    )


class ZfDifferentialMatrix(ZfSingleChoiceMatrix):
    RESPONSE_DOMAIN_CLASS = ZfDifferentialMatrixResponseDomain


ZfSingleChoiceOrDifferentialResponseDomain = Annotated[
    ZfSingleChoiceMatrixResponseDomain | ZfDifferentialMatrixResponseDomain,
    Field(discriminator='differential'),
]


def _single_choice_or_differential_matrix_discriminator(v: Any) -> str | None:
    if isinstance(v, Mapping):
        children = v.get('childs')
    else:
        children = getattr(v, 'childs', None)
    if not isinstance(children, Iterable):
        return None
    for c in children:
        if isinstance(c, Mapping):
            c_type = c.get('type')
            differential = c.get('differential')
        else:
            c_type = getattr(c, 'type', None)
            differential = getattr(c, 'differential', None)
        if (
            isinstance(differential, bool)
            and c_type
            == 'de.his.zofar.presentation.surveyengine.ui.components.question.matrix.'
            'singlechoice.UISingleChoiceMatrixResponseDomain'
        ):
            return 'diff' if differential else 'single'
    return None


type ZfSingleChoiceOrDifferentialMatrix = Annotated[
    Annotated[ZfSingleChoiceMatrix, Tag('single')]
    | Annotated[ZfDifferentialMatrix, Tag('diff')],
    Discriminator(_single_choice_or_differential_matrix_discriminator),
]
