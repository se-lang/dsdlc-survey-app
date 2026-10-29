from django.dispatch import receiver
from strawberry.tools import merge_types
from strawberry.types import get_object_definition
from strawberry_django.pagination import OffsetPaginated

from lebenslaeufe_app.graphql_schema import (
    register_graphql_types,
    GraphqlExtraTypeRegistry,
)
from lla_questionnaire.graphql_types.files import QnrFilesQuery
from lla_questionnaire.graphql_types.news import QnrNewsMutation, QnrNewsQuery
from lla_questionnaire.graphql_types.page import (
    QuestionnairePageLayoutBoxed,
    QuestionnairePageLayoutFull,
)
from lla_questionnaire.graphql_types.element_type_init import (
    send_init_questionnaire_elements_if_necessary,
    questionnaire_element_subclasses,
)
from lla_questionnaire.graphql_types.questionnaire import QnrQuery
from lla_questionnaire.graphql_types.validators import (
    MaxValueValidator,
    MinValueValidator,
    MaxTextLengthValidator,
    TextPatternValidator,
    EmailValidator,
    MaxDateValidator,
    MinDateValidator,
)
from lla_questionnaire.qnr_system_apps import questionnaire_types

Query = merge_types(
    'Query',
    (
        QnrQuery,
        QnrNewsQuery,
        QnrFilesQuery,
    ),
)
Mutation = merge_types('Mutation', (QnrNewsMutation,))


EXTRA_TYPES = (
    MaxValueValidator,
    MinValueValidator,
    MaxDateValidator,
    MinDateValidator,
    MaxTextLengthValidator,
    TextPatternValidator,
    EmailValidator,
    QuestionnairePageLayoutBoxed,
    QuestionnairePageLayoutFull,
)


@receiver(register_graphql_types, dispatch_uid='lla_questionnaire_element_types')
def register_questionnaire_subtypes(registry: GraphqlExtraTypeRegistry, **kwargs):
    # Once all graphql modules have been evaluated, ask any questionnaire system app to evaluate its
    # QuestionnaireElement subtypes by sending the init_questionnaire_elements signal.
    send_init_questionnaire_elements_if_necessary()

    # Once all subtypes have been evaluated, register all known subtypes to the GraphQL schema.
    registry.register(questionnaire_element_subclasses)

    # Make sure there is an OffsetPaginated[T] for any PersonQuestionnaire subtype in the schema.
    # This is required for QnrQuery.questionnaires
    for questionnaire_type in questionnaire_types():
        registry.register(
            get_object_definition(OffsetPaginated).resolve_generic(
                OffsetPaginated[questionnaire_type.person_questionnaire_gql]
            )
        )
