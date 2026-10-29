import datetime
from collections.abc import Callable
from typing import cast, Any

import strawberry
import strawberry_django
from django.db import transaction
from django.db.models import Q, Value, QuerySet, Exists, OuterRef
from django.db.models.expressions import BaseExpression, Combinable
from django.db.models.lookups import Exact
from django.http import HttpRequest
from django.utils import timezone
from django.utils.html import linebreaks
from graphql import GraphQLResolveInfo
from strawberry import Parent, Info
from strawberry.django.context import StrawberryDjangoContext
from strawberry.extensions import FieldExtension
from strawberry.relay import Node, GlobalID
from strawberry_django.optimizer import optimize
from strawberry_django.queryset import run_type_get_queryset

from lebenslaeufe_app.graphql_helpers import DjangoInfo, get_gql_uuid
from lla_questionnaire.models import QuestionnaireNews, QuestionnaireNewsSeen
from lla_questionnaire.qnr_system_apps import questionnaire_types, get_active_person_id


def _questionnaire_news_seen(request: HttpRequest, prefix: str = '') -> Exists | None:
    filters: list[Q] = []
    for qt in questionnaire_types():
        person_filter = qt.get_active_person_filter(request, prefix=prefix + 'person__')
        if person_filter is not None:
            filters.append(person_filter)

    if not filters:
        return None
    else:
        return Exists(
            QuestionnaireNewsSeen.objects.filter(Q.create(filters, Q.OR)).filter(
                questionnaire_news_id=OuterRef(f'{prefix}pk')
            )
        )


def _annotate_questionnaire_news_seen(
    info: GraphQLResolveInfo,
) -> BaseExpression | Combinable:
    filter_ = _questionnaire_news_seen(
        cast(StrawberryDjangoContext, info.context).request
    )
    return filter_ if filter_ is not None else Value(False)


@strawberry_django.filter_type(QuestionnaireNews)
class QuestionnaireNewsFilter:
    @strawberry_django.filter_field()
    def seen(self, info: DjangoInfo, value: bool, prefix: str) -> Q:
        filter_ = _questionnaire_news_seen(info.context.request, prefix)
        if filter_ is None:
            return Q(Exact(Value(False), Value(True)))
        elif value:
            return Q(filter_)
        else:
            return ~Q(filter_)

    @strawberry_django.filter_field()
    def expired(self, value: bool, prefix: str) -> Q:
        expired = Q((f'{prefix}resolved_end_date__lte', timezone.localdate()))
        return expired if value else ~expired


@strawberry_django.order_type(QuestionnaireNews)
class QuestionnaireNewsOrder:
    title: strawberry.auto
    start_date: strawberry.auto = strawberry_django.order_field(name='date')


class ParagraphsExtension(FieldExtension):
    def resolve(
        self, next_: Callable[..., Any], source: Any, info: Info, **kwargs: Any
    ) -> Any:
        result = next_(source, info, **kwargs)
        if isinstance(result, str):
            return linebreaks(result, autoescape=True)
        else:
            return result


@strawberry_django.type(
    QuestionnaireNews,
    name='QuestionnaireNews',
    filters=QuestionnaireNewsFilter,
    ordering=QuestionnaireNewsOrder,
)
class QuestionnaireNewsGql(Node):
    title: str
    description: str
    content: str = strawberry_django.field(extensions=[ParagraphsExtension()])
    date: datetime.datetime = strawberry_django.field(field_name='start_date')

    seen: bool = strawberry_django.field(annotate=_annotate_questionnaire_news_seen)

    @strawberry_django.field(only=('resolved_end_date',))
    @staticmethod
    def expired(parent: Parent[QuestionnaireNews]) -> bool:
        return parent.resolved_end_date <= timezone.localdate()

    @classmethod
    def get_queryset(cls, qs: QuerySet, info: DjangoInfo) -> QuerySet:
        # Use an exists filter to avoid returning duplicate news
        # Filtering on M2M uses a join and could duplicate the News row
        filters = [
            Q(
                ~Exists(
                    QuestionnaireNews.questionnaire.through.objects.filter(
                        questionnairenews_id=OuterRef('pk'),
                    )
                )
            )
        ]
        for qt in questionnaire_types():
            qt_qs = qt.get_person_questionnaire_queryset(info.context.request)
            filters.append(
                Q(
                    Exists(
                        QuestionnaireNews.questionnaire.through.objects.filter(
                            questionnairenews_id=OuterRef('pk'),
                            questionnaire_id__in=qt_qs.values('questionnaire_id'),
                        )
                    )
                )
            )
        return qs.filter(Q.create(filters, Q.OR)).filter(
            start_date__lte=timezone.localdate()
        )


@strawberry.type()
class QnrNewsQuery:
    questionnaire_news: list[QuestionnaireNewsGql] = strawberry_django.field()


@strawberry.type
class QnrNewsMutation:
    @strawberry_django.mutation(handle_django_errors=True)
    @staticmethod
    def set_questionnaire_news_seen(
        info: DjangoInfo, news_id: GlobalID, seen: bool = True
    ) -> QuestionnaireNewsGql:
        with transaction.atomic():
            pk = get_gql_uuid(news_id, QuestionnaireNewsGql)
            person_id = get_active_person_id(info.context.request)
            if person_id is not None:
                if seen:
                    QuestionnaireNewsSeen.objects.get_or_create(
                        person_id=person_id,
                        questionnaire_news_id=pk,
                        defaults={'when': timezone.now},
                    )
                else:
                    QuestionnaireNewsSeen.objects.filter(
                        person_id=person_id,
                        questionnaire_news_id=pk,
                    ).delete()
            return optimize(
                run_type_get_queryset(
                    QuestionnaireNews.objects.all(), QuestionnaireNewsGql, info
                ),
                info,
            ).get(pk=pk)
