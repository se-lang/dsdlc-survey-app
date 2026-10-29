from typing import cast, Any
from uuid import UUID

from django.db.models import QuerySet, Q, Exists, OuterRef, OrderBy, F
from django.http import HttpRequest
from strawberry_django.utils.typing import WithStrawberryDjangoObjectDefinition

from lla_questionnaire.qnr_system_apps import QnrTypeDefinition
from lla_zofar.graphql_types.questionnaire import ZfQuestionnaireGql
from lla_zofar.models import (
    ZofarPersonQuestionnaire,
    ZofarPerson,
    SESSION_KEY_ZOFAR_PERSON_ID,
)


class ZofarQuestionnaireType(QnrTypeDefinition):
    person_questionnaire_gql = cast(
        WithStrawberryDjangoObjectDefinition, ZfQuestionnaireGql
    )

    def get_person_questionnaire_queryset(self, request: HttpRequest) -> QuerySet:
        return ZofarPersonQuestionnaire.objects.for_request(request)

    def get_person_questionnaire_order(self, prefix: str) -> OrderBy:
        return F(f'{prefix}zofarpersonquestionnaire__questionnaire__order_index').asc()

    def get_active_person_filter(
        self, request: HttpRequest, prefix: str = ''
    ) -> Q | None:
        return ZofarPerson.objects.get_filter(request, prefix=prefix + 'zofarperson__')

    def get_active_person_id(self, request: HttpRequest) -> UUID | None:
        user = request.user
        if user.is_authenticated:
            return (
                ZofarPerson.objects.filter(user=user)
                .values_list('id', flat=True)
                .first()
            )
        else:
            return request.session.get(SESSION_KEY_ZOFAR_PERSON_ID)

    def filter_person_by_questionnaire(self, questionnaire_filter: dict[str, Any]) -> Q:
        if all(
            field_name == 'id' or field_name.startswith('id__')
            for field_name in questionnaire_filter.keys()
        ):
            prefix = 'questionnaire_'
        else:
            prefix = 'questionnaire__questionnaire__'

        zpq_filter = Q(
            **{
                prefix + field_name: field_value
                for field_name, field_value in questionnaire_filter.items()
            }
        )

        return Q(
            Exists(
                ZofarPersonQuestionnaire.objects.filter(
                    person_id=OuterRef('pk'),
                ).complex_filter(zpq_filter)
            )
        )
