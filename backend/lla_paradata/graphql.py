import dataclasses
from collections import defaultdict
from typing import Optional, Any
from uuid import UUID

import strawberry
import strawberry_django
from django.core.exceptions import ValidationError
from django.utils import timezone
from strawberry.relay import GlobalID
from strawberry_django.fields.types import OperationInfo

from lebenslaeufe_app.graphql import DurationScalar
from lebenslaeufe_app.graphql_helpers import DjangoInfo, get_gql_uuid
from lla_paradata.registry import PARADATA_REGISTRY
from lla_paradata.models import ParadataEvent
from lla_questionnaire.graphql_types.questionnaire import QuestionnaireGql
from lla_questionnaire.qnr_system_apps import get_active_person_id, questionnaire_types

ParadataValueGql = strawberry.input(
    type(
        'ParadataValueGql',
        (),
        {
            '__annotations__': {
                d.key: Optional[d.build_graphql_type()]
                for d in PARADATA_REGISTRY.get_registrations()
                if d.client_side
            },
            **{
                d.key: strawberry.UNSET
                for d in PARADATA_REGISTRY.get_registrations()
                if d.client_side
            },
        },
    ),
    name='ParadataValue',
    one_of=True,
)


@strawberry.input(name='ParadataInput')
class ParadataInputGql:
    time_ago: DurationScalar
    value: ParadataValueGql
    questionnaire_id: GlobalID | None = None

    def get_key_value(self) -> tuple[str, Any]:
        for field in dataclasses.fields(self.value):
            value = getattr(self.value, field.name)
            if value is not strawberry.UNSET:
                return field.name, value
        raise ValueError('ParadataValueGql must have one value set.')


def _get_questionnaire_ids(
    info: DjangoInfo, data: list[ParadataInputGql]
) -> dict[GlobalID, UUID]:
    person_questionnaire_ids_to_gid: dict[UUID, list[GlobalID]] = defaultdict(list)
    for datum in data:
        if datum.questionnaire_id is not None and issubclass(
            datum.questionnaire_id.resolve_type(info), QuestionnaireGql
        ):
            person_questionnaire_ids_to_gid[
                get_gql_uuid(datum.questionnaire_id)
            ].append(datum.questionnaire_id)

    gid_to_questionnaire_id: dict[GlobalID, UUID] = dict()

    for qt in questionnaire_types():
        qs = (
            qt.get_person_questionnaire_queryset(info.context.request)
            .filter(pk__in=person_questionnaire_ids_to_gid.keys())
            .values_list('pk', 'questionnaire_id')
        )
        for id_, questionnaire_id in qs:
            for gid in person_questionnaire_ids_to_gid[id_]:
                gid_to_questionnaire_id[gid] = questionnaire_id

    return gid_to_questionnaire_id


@strawberry.type
class Mutation:
    @strawberry_django.mutation(handle_django_errors=True)
    @staticmethod
    def add_paradata(
        info: DjangoInfo, data: list[ParadataInputGql]
    ) -> OperationInfo | None:
        now = timezone.now()
        person_id = get_active_person_id(info.context.request)
        if person_id is None:
            raise ValidationError('Not logged in')

        questionnaire_ids = _get_questionnaire_ids(info, data)
        objs: list[ParadataEvent] = []
        for datum in data:
            key, raw_value = datum.get_key_value()
            definition = PARADATA_REGISTRY[key]
            objs.append(
                ParadataEvent(
                    person_id=person_id,
                    active_questionnaire_id=questionnaire_ids.get(
                        datum.questionnaire_id
                    ),
                    timestamp=now - datum.time_ago,
                    key=key,
                    value=definition.value_to_db(raw_value),
                )
            )

        ParadataEvent.objects.bulk_create(objs)
