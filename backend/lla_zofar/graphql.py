from strawberry.tools import merge_types

from lla_zofar.graphql_types.guest_session import GuestSessionMutations
from lla_zofar.graphql_types.page import ZfEpisodeBoxedLayoutGql
from lla_zofar.graphql_types.questionnaire import (
    ZfQuestionnaireGql,
    QuestionnaireMutations,
    QuestionnaireQueries,
)
from lla_zofar.graphql_types.register_user import RegisterUserMutations
from lla_zofar.graphql_types.submit import SubmitMutations
from lla_zofar.graphql_types.token import TokenQueries, TokenMutations

Query = merge_types(
    'Query',
    (
        TokenQueries,
        QuestionnaireQueries,
    ),
)
Mutation = merge_types(
    'Mutation',
    (
        RegisterUserMutations,
        GuestSessionMutations,
        SubmitMutations,
        QuestionnaireMutations,
        TokenMutations,
    ),
)
EXTRA_TYPES = [
    ZfQuestionnaireGql,
    ZfEpisodeBoxedLayoutGql,
]
