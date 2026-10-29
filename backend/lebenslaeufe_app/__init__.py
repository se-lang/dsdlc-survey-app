from zoneinfo import ZoneInfo

from django.db.migrations.serializer import BaseSerializer
from django.db.migrations.writer import MigrationWriter

# Make sure Celery is imported as it has side-effects
from . import celery as celery


class ZoneInfoSerializer(BaseSerializer):
    def serialize(self):
        return repr(self.value), {'import zoneinfo'}


MigrationWriter.register_serializer(ZoneInfo, ZoneInfoSerializer)
