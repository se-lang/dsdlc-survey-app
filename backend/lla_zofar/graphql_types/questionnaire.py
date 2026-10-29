import datetime
from typing import Iterable, Sequence, cast, MutableSequence
from uuid import UUID

import strawberry
import strawberry_django
from django.core.exceptions import ValidationError
from django.db.models import F, Prefetch, QuerySet
from strawberry import Info, Parent
from strawberry.relay import GlobalID
from strawberry.types import get_object_definition
from strawberry_django.optimizer import optimize
from strawberry_django.relay import resolve_model_nodes

from lebenslaeufe_app.graphql_helpers import DjangoInfo, is_root_field, get_gql_uuids
from lla_questionnaire.graphql_types.questionnaire import (
    QuestionnaireStatusGql,
    QuestionnaireCompletionStateGql,
    QuestionnaireGql,
)
from lla_zofar.graphql_types.page import ZfPageType
from lla_zofar.models import (
    ZofarPersonQuestionnaireStatus,
    ZofarPersonQuestionnaire,
    ZofarPersonQuestionnaireQuerySet,
    ActiveZofarState,
    ZofarState,
)


@strawberry_django.type(
    ZofarPersonQuestionnaireStatus,
    name='ZfQuestionnaireStatus',
)
class ZfQuestionnaireStatusGql(QuestionnaireStatusGql):
    completion_state: QuestionnaireCompletionStateGql
    first_visit: datetime.datetime | None
    last_visit: datetime.datetime | None
    hidden: bool = strawberry_django.field(field_name='blocked')

    @classmethod
    def resolve_node(cls, node_id: str, *, info: Info, required: bool = False):
        return cls.resolve_nodes(info=info, required=required, node_ids=(node_id,))[0]

    @classmethod
    def resolve_nodes(
        cls, *, info: Info, node_ids: Iterable[str], required: bool = False
    ):
        if not isinstance(node_ids, Sequence):
            node_ids = list(node_ids)

        resolved = cast(
            Iterable[ZofarPersonQuestionnaireStatus | None],
            resolve_model_nodes(cls, info=info, node_ids=node_ids, required=False),
        )
        if not isinstance(resolved, MutableSequence):
            resolved = list(resolved)

        missing_id_idx: list[int] = []
        missing_ids: list[UUID] = []
        for idx, r in enumerate(resolved):
            if r is None:
                try:
                    missing_ids.append(UUID(node_ids[idx]))
                except ValueError:
                    pass  # invalid ID
                else:
                    missing_id_idx.append(idx)
        if missing_ids:
            existing_missing_ids = set(
                ZofarPersonQuestionnaire.objects.for_request(info.context.request)
                .filter(id__in=missing_ids)
                .values_list('id', flat=True)
            )
            for idx, missing_id in enumerate(missing_ids):
                if missing_id in existing_missing_ids:
                    resolved[idx] = ZofarPersonQuestionnaireStatus(
                        person_questionnaire_id=missing_id,
                    )
        if required and None in resolved:
            raise ZofarPersonQuestionnaireStatus.DoesNotExist()
        return resolved


@strawberry_django.type(ZofarPersonQuestionnaire, name='ZfQuestionnaire')
class ZfQuestionnaireGql(QuestionnaireGql):
    name: str = strawberry_django.field(annotate=F('questionnaire__label'))

    @strawberry_django.field(
        prefetch_related=lambda info: Prefetch(
            'status',
            queryset=optimize(ZofarPersonQuestionnaireStatus.objects.all(), info),
        )
    )
    @staticmethod
    def status(parent: Parent[ZofarPersonQuestionnaire]) -> ZfQuestionnaireStatusGql:
        if hasattr(parent, 'status'):
            return parent.status
        else:
            return ZofarPersonQuestionnaireStatus(person_questionnaire=parent)

    @classmethod
    def get_queryset(
        cls, qs: ZofarPersonQuestionnaireQuerySet, info: DjangoInfo
    ) -> QuerySet:
        if is_root_field(info):
            qs = qs.for_request(info.context.request)
        return qs

    @strawberry_django.field()
    @staticmethod
    def current_page(parent: Parent[ZofarPersonQuestionnaire]) -> ZfPageType:
        state: ActiveZofarState
        with ZofarState.objects.activate(person_questionnaire=parent) as state:
            return ZfPageType(
                zofar_state=state,
                zf_page=state.get_current_page(),
            )


@strawberry.type
class QuestionnaireMutations:
    @strawberry_django.mutation(handle_django_errors=False)
    @staticmethod
    def refresh_questionnaire_status(
        info: DjangoInfo, status_ids: list[GlobalID]
    ) -> list[QuestionnaireStatusGql]:
        if len(status_ids) > 100:
            raise ValidationError('Too many status to refresh')
        uuids = get_gql_uuids(status_ids, ZfQuestionnaireStatusGql)
        return ZofarPersonQuestionnaireStatus.objects.bulk_status_update(
            uuids, request=info.context.request
        )


@strawberry.type
class QuestionnaireQueries:
    @strawberry_django.field()
    @staticmethod
    def zofar_lookup_external_questionnaire_id(
        external_id: str, info: DjangoInfo
    ) -> GlobalID | None:
        if not external_id:
            return None
        zpq_id = (
            ZofarPersonQuestionnaire.objects.for_request(info.context.request)
            .filter(
                questionnaire__external_id=external_id,
            )
            .values_list('id', flat=True)
            .first()
        )
        if zpq_id is None:
            return None
        return GlobalID(
            get_object_definition(ZfQuestionnaireGql, strict=True).name,
            str(zpq_id),
        )
