import enum

import strawberry
import strawberry_django
from django.db.models import QuerySet, Q
from strawberry.relay import Node

from lebenslaeufe_app.graphql import FileGql
from lebenslaeufe_app.graphql_helpers import DjangoInfo
from lla_questionnaire.models import QuestionnaireFile
from lla_questionnaire.qnr_system_apps import questionnaire_types


@strawberry.enum(name='QuestionnaireFileType')
class QuestionnaireFileTypeGql(enum.Enum):
    FILE = 'FILE'
    PRIVACY = 'PRIVACY'


@strawberry_django.filter_type(QuestionnaireFile, name='QuestionnaireFileFilter')
class QuestionnaireFileFilterGql:
    type: QuestionnaireFileTypeGql | None


@strawberry_django.type(QuestionnaireFile, name='QuestionnaireFile')
class QuestionnaireFileGql(Node):
    title: str
    description: str
    file: FileGql
    type: QuestionnaireFileTypeGql

    @classmethod
    def get_queryset(cls, qs: QuerySet, info: DjangoInfo) -> QuerySet:
        filters = []
        for qt in questionnaire_types():
            qt_qs = qt.get_person_questionnaire_queryset(info.context.request)
            filters.append(Q(questionnaire_id__in=qt_qs.values('questionnaire_id')))
        return qs.filter(Q.create(filters, Q.OR))


@strawberry.type()
class QnrFilesQuery:
    questionnaire_files: list[QuestionnaireFileGql] = strawberry_django.field(
        filters=QuestionnaireFileFilterGql, pagination=True
    )
