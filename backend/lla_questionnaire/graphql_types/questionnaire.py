import datetime
from enum import Enum

import strawberry
import strawberry_django
from django.db.models import QuerySet, F
from graphql import GraphQLObjectType
from strawberry.annotation import StrawberryAnnotation
from strawberry.relay import Node
from strawberry.types import get_object_definition
from strawberry_django import node
from strawberry_django.optimizer import optimize
from strawberry_django.pagination import OffsetPaginated

from lebenslaeufe_app.graphql_helpers import DjangoInfo
from lla_questionnaire.graphql_types.page import QuestionnairePage
from lla_questionnaire.models import PersonQuestionnaire
from lla_questionnaire.qnr_system_apps import questionnaire_types


@strawberry.enum(name='QuestionnaireCompletionState')
class QuestionnaireCompletionStateGql(Enum):
    NEW = 'NEW'
    STARTED = 'STARTED'
    FINISHED = 'FINISHED'


@strawberry.interface(name='QuestionnaireStatus')
class QuestionnaireStatusGql(Node):
    completion_state: QuestionnaireCompletionStateGql
    first_visit: datetime.datetime | None
    last_visit: datetime.datetime | None
    hidden: bool


@strawberry_django.interface(PersonQuestionnaire, name='Questionnaire')
class QuestionnaireGql(Node):
    name: str
    current_page: QuestionnairePage
    status: QuestionnaireStatusGql


@strawberry.type()
class QnrQuery:
    questionnaire: QuestionnaireGql | None = node()

    @strawberry_django.offset_paginated(
        OffsetPaginated[QuestionnaireGql], disable_optimization=True
    )
    @staticmethod
    def questionnaires(info: DjangoInfo) -> list[QuestionnaireGql]:
        # We have to run the optimizer on every PersonQuestionnaire subtype separately
        # First gather the list of PersonQuestionnaire subtypes and their QuerySets.
        questionnaire_qs: list[tuple[QuerySet, QuerySet]] = []
        for qt in questionnaire_types():
            qs = qt.get_person_questionnaire_queryset(info.context.request)
            gql_origin = qt.person_questionnaire_gql
            paginated_gql_type = info.schema.schema_converter.from_object(
                get_object_definition(
                    StrawberryAnnotation(OffsetPaginated[gql_origin]).resolve(),
                    strict=True,
                )
            )
            assert isinstance(paginated_gql_type, GraphQLObjectType)
            # noinspection PyProtectedMember
            modified_info = info._raw_info._replace(return_type=paginated_gql_type)
            questionnaire_qs.append(
                (qs, optimize(qs.model.objects.all(), modified_info))
            )

        # Now return a polymorphic queryset based on the QuerySets we collected above
        final_qs = PersonQuestionnaire.objects.with_subtypes(questionnaire_qs).order_by(
            *(qt.get_person_questionnaire_order('') for qt in questionnaire_types()),
            F('pk').asc(),
        )
        return final_qs
