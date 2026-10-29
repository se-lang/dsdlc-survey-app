from enum import Enum
from uuid import UUID

import strawberry
import strawberry_django
from django.db.models import Exists, OuterRef, Subquery, QuerySet
from strawberry import Parent
from strawberry.relay import Node, NodeID

from lebenslaeufe_app.graphql_helpers import DjangoInfo, OptimizerRefetch
from lebenslaeufe_app.ratelimit import RateLimit
from lla_zofar.models import ZofarPersonQuestionnaire, ZofarPerson


@strawberry.enum()
class ZofarTokenAccountState(Enum):
    NO_ACCOUNT = 'NO_ACCOUNT'
    ACCOUNT = 'ACCOUNT'


@strawberry_django.type(ZofarPerson, name='ZofarToken')
class ZofarTokenGql(Node):
    id: NodeID[UUID]

    has_seen_tour: bool
    token: str = strawberry_django.field(
        annotate=Subquery(
            ZofarPersonQuestionnaire.objects.filter(person_id=OuterRef('id')).values(
                'token'
            )[:1]
        ),
    )

    @strawberry_django.field(
        only='user_id',
        extensions=[RateLimit('10/m')],
    )
    @staticmethod
    def account_state(
        parent: Parent[ZofarPerson],
    ) -> ZofarTokenAccountState:
        if parent.user_id is None:
            return ZofarTokenAccountState.NO_ACCOUNT
        else:
            return ZofarTokenAccountState.ACCOUNT

    @classmethod
    def get_queryset(cls, qs: QuerySet, info: DjangoInfo) -> QuerySet:
        if not (info.path.typename == 'Query' and info.path.key == 'zofarToken'):
            filter_ = ZofarPerson.objects.get_filter(info.context.request)
            qs = qs.none() if filter_ is None else qs.filter(filter_)
        return qs


@strawberry.type
class TokenQueries:
    @strawberry_django.field()
    @staticmethod
    def zofar_token(info: DjangoInfo, token: str | None = None) -> ZofarTokenGql | None:
        qs = ZofarPerson.objects.all()
        if token is None:
            filter_ = ZofarPerson.objects.get_filter(info.context.request)
        else:
            filter_ = Exists(
                ZofarPersonQuestionnaire.objects.filter(
                    token=token, person_id=OuterRef('pk')
                )
            )
        return qs.none() if filter_ is None else qs.filter(filter_)


@strawberry.input
class ZofarTokenUpdate:
    mark_tour_seen: bool | None = strawberry.UNSET


@strawberry.type
class TokenMutations:
    @strawberry_django.mutation(
        extensions=[OptimizerRefetch()], handle_django_errors=True
    )
    @staticmethod
    def update_zofar_token(info: DjangoInfo, data: ZofarTokenUpdate) -> ZofarTokenGql:
        qs = ZofarPerson.objects.all().only('pk', 'has_seen_tour')
        filter_ = ZofarPerson.objects.get_filter(info.context.request)
        qs = qs.none() if filter_ is None else qs.filter(filter_)
        qs = qs[:1]
        person = qs.get()
        if data.mark_tour_seen and not person.has_seen_tour:
            person.has_seen_tour = True
            person.save(update_fields=('has_seen_tour',))
        return person
