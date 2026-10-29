from typing import Annotated

from pydantic import Field, Discriminator, Tag

from .app_info_container import ZfContainerUnion
from .buttons import ZfButtonElement
from .episodes import ZfEpisodes, ZfEpisodesTable
from .misc import ZfPictureBar, ZfUiSort
from .questions_matrix_differential import (
    ZfSingleChoiceOrDifferentialResponseDomain,
    ZfSingleChoiceOrDifferentialMatrix,
)
from .questions_matrix_double import (
    ZfDoubleMatrix,
    ZfDoubleMatrixItem,
    ZfDoubleMatrixResponseDomain,
)
from .questions_matrix_multiple_choice import (
    ZfMultipleChoiceMatrix,
    ZfMultipleChoiceMatrixItem,
    ZfMultipleChoiceMatrixResponseDomain,
    ZfMultipleChoiceMatrixUnit,
)
from .questions_matrix_open import (
    ZfOpenMatrix,
    ZfOpenMatrixItem,
    ZfOpenMatrixResponseDomain,
)
from .questions_matrix_single_choice import (
    ZfSingleChoiceMatrixItem,
    ZfSingleChoiceMatrixItemResponseDomain,
)
from .questions_multiple_choice import (
    ZfMultipleChoiceOption,
    ZfMultipleChoiceResponseDomain,
    ZfMultipleChoiceQuestion,
)
from .questions_open import (
    ZfOpenOption,
    ZfOpenQuestionResponseDomain,
    ZfOpenQuestion,
    ZfAttachedOpenQuestion,
)
from .questions_single_choice import (
    ZfSingleChoiceOption,
    ZfDropdownMissingResponseDomain,
    ZfRadioButtonSingleChoiceResponseDomain,
    ZfSingleChoiceQuestion,
)
from .section import ZfSectionElement
from .text import (
    ZfTitleTextElement,
    discriminate_plain_text,
    ZfTextElementStandalone,
    ZfTextElement,
)

type ZfNormalElement = Annotated[
    ZfButtonElement
    | ZfTextElement
    | ZfTitleTextElement
    | ZfSectionElement
    | ZfPictureBar
    | ZfUiSort
    | ZfContainerUnion
    | ZfEpisodes
    | ZfEpisodesTable
    | ZfMultipleChoiceQuestion
    | ZfMultipleChoiceResponseDomain
    | ZfMultipleChoiceOption
    | ZfSingleChoiceQuestion
    | ZfSingleChoiceOption
    | ZfRadioButtonSingleChoiceResponseDomain
    | ZfDropdownMissingResponseDomain
    | ZfOpenQuestion
    | ZfAttachedOpenQuestion
    | ZfOpenQuestionResponseDomain
    | ZfOpenOption
    # Single choice matrix
    | ZfSingleChoiceOrDifferentialMatrix
    | ZfSingleChoiceMatrixItem
    | ZfSingleChoiceOrDifferentialResponseDomain
    | ZfSingleChoiceMatrixItemResponseDomain
    # Multiple choice matrix
    | ZfMultipleChoiceMatrix
    | ZfMultipleChoiceMatrixItem
    | ZfMultipleChoiceMatrixResponseDomain
    | ZfMultipleChoiceMatrixUnit
    # Open matrix
    | ZfOpenMatrix
    | ZfOpenMatrixItem
    | ZfOpenMatrixResponseDomain
    # Double matrix
    | ZfDoubleMatrix
    | ZfDoubleMatrixItem
    | ZfDoubleMatrixResponseDomain,
    Field(
        discriminator='type',
    ),
]

# Sometimes Zofar includes plain text elements... deal with them with a custom Discriminator
ZfAnyElement = Annotated[
    Annotated[ZfNormalElement, Tag('other')]
    | Annotated[ZfTextElementStandalone, Tag('plain_text')],
    Discriminator(discriminate_plain_text),
]
"""
A Union for Pydantic to deserialize any Element.
"""
