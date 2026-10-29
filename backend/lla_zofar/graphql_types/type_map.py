from typing import Protocol

from lla_zofar.api_schema.base import ZfElement, ZfUnknownElement
from lla_zofar.api_schema.episodes import ZfEpisodes, ZfEpisodesTable
from lla_zofar.api_schema.misc import ZfDisplayContainer
from lla_zofar.api_schema.questions_matrix_differential import (
    ZfDifferentialMatrix,
    ZfDifferentialSingleChoiceMatrixItem,
)
from lla_zofar.api_schema.questions_matrix_double import (
    ZfDoubleMatrix,
    ZfDoubleMatrixItem,
    ZfSingleChoiceMatrixItemResponseDomainInDoubleMatrix,
)
from lla_zofar.api_schema.questions_matrix_multiple_choice import (
    ZfMultipleChoiceMatrix,
    ZfMultipleChoiceMatrixItem,
)
from lla_zofar.api_schema.questions_matrix_open import (
    ZfOpenMatrix,
    ZfOpenMatrixItem,
    ZfOpenMatrixOpenQuestion,
)
from lla_zofar.api_schema.questions_matrix_single_choice import (
    ZfSingleChoiceMatrix,
    ZfSingleChoiceMatrixItem,
)
from lla_zofar.api_schema.questions_multiple_choice import (
    ZfMultipleChoiceQuestion,
    ZfMultipleChoiceOption,
)
from lla_zofar.api_schema.questions_open import ZfOpenQuestion, ZfAttachedOpenQuestion
from lla_zofar.api_schema.questions_single_choice import (
    ZfSingleChoiceQuestion,
    ZfSingleChoiceOption,
)
from lla_zofar.api_schema.section import ZfSectionElement
from lla_zofar.api_schema.text import (
    ZfTextElement,
    ZfTextElementStandalone,
    ZfTitleTextElement,
)
from lla_zofar.graphql_types.base import ZfContainerGql
from lla_zofar.graphql_types.element import ZfElementGql
from lla_zofar.graphql_types.question_choice_multiple import (
    ZfMultipleChoiceQuestionElementGql,
    ZfMultipleChoiceOptionGql,
)
from lla_zofar.graphql_types.question_choice_single import (
    ZfSingleChoiceQuestionGql,
    ZfSingleChoiceOptionGql,
)
from lla_zofar.graphql_types.question_matrix_choice_multiple import (
    ZfMultipleChoiceMatrixQuestionElementGql,
    ZfMultipleChoiceMatrixQuestionCategoryElementGql,
)
from lla_zofar.graphql_types.question_matrix_choice_single import (
    ZfSingleChoiceMatrixQuestionElementGql,
    ZfSingleChoiceMatrixQuestionCategoryElementGql,
)
from lla_zofar.graphql_types.question_matrix_differential import (
    ZfDifferentialQuestionElementGql,
    ZfDifferentialQuestionPartElementGql,
)
from lla_zofar.graphql_types.question_matrix_double import (
    ZfDoubleMatrixQuestionElementGql,
    ZfDoubleMatrixQuestionCategoryElementGql,
    ZfDoubleMatrixQuestionPartElementGql,
)
from lla_zofar.graphql_types.question_matrix_open import (
    ZfOpenMatrixQuestionElementGql,
    ZfOpenMatrixQuestionCategoryElementGql,
)
from lla_zofar.graphql_types.question_open import ZfOpenQuestionGql
from lla_zofar.graphql_types.text import ZfHtmlElementGql
from lla_zofar.graphql_types.unknown import (
    ZfUnknownElementGql,
    ZfUnknownElementPlaceholderGql,
)
from lla_zofar.graphql_types.episodes import ZfEpisodesCalendarGql, ZfEpisodesTableGql


class ZfElementGqlConstructor(Protocol):
    def __call__(self, *, zf_element: ZfElement) -> ZfElementGql: ...


TYPE_MAP: dict[type[ZfElement], ZfElementGqlConstructor | None] = {
    ZfTextElement: ZfHtmlElementGql,
    ZfTextElementStandalone: ZfHtmlElementGql,
    ZfTitleTextElement: ZfHtmlElementGql,
    ZfDisplayContainer: ZfContainerGql,
    ZfSectionElement: ZfContainerGql,
    ZfMultipleChoiceQuestion: ZfMultipleChoiceQuestionElementGql,
    ZfMultipleChoiceOption: ZfMultipleChoiceOptionGql,
    ZfSingleChoiceQuestion: ZfSingleChoiceQuestionGql,
    ZfSingleChoiceOption: ZfSingleChoiceOptionGql,
    ZfOpenQuestion: ZfOpenQuestionGql,
    ZfAttachedOpenQuestion: ZfOpenQuestionGql,
    # Single Choice Matrix
    ZfSingleChoiceMatrix: ZfSingleChoiceMatrixQuestionElementGql,
    ZfSingleChoiceMatrixItem: ZfSingleChoiceMatrixQuestionCategoryElementGql,
    # Multiple Choice Matrix
    ZfMultipleChoiceMatrix: ZfMultipleChoiceMatrixQuestionElementGql,
    ZfMultipleChoiceMatrixItem: ZfMultipleChoiceMatrixQuestionCategoryElementGql,
    # Open Matrix
    ZfOpenMatrix: ZfOpenMatrixQuestionElementGql,
    ZfOpenMatrixItem: ZfOpenMatrixQuestionCategoryElementGql,
    ZfOpenMatrixOpenQuestion: ZfOpenQuestionGql,
    # Double Matrix
    ZfDoubleMatrix: ZfDoubleMatrixQuestionElementGql,
    ZfDoubleMatrixItem: ZfDoubleMatrixQuestionCategoryElementGql,
    ZfSingleChoiceMatrixItemResponseDomainInDoubleMatrix: ZfDoubleMatrixQuestionPartElementGql,
    # Differential
    ZfDifferentialMatrix: ZfDifferentialQuestionElementGql,
    ZfDifferentialSingleChoiceMatrixItem: ZfDifferentialQuestionPartElementGql,
    ZfEpisodes: ZfEpisodesCalendarGql,
    ZfEpisodesTable: ZfEpisodesTableGql,
    ZfUnknownElement: ZfUnknownElementGql,
}


def zf_element_to_gql(element: ZfElement) -> ZfElementGql | None:
    target_type = TYPE_MAP.get(type(element), ZfUnknownElementPlaceholderGql)
    return target_type(zf_element=element) if target_type is not None else None
