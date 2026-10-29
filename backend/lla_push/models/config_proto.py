import datetime
from typing import Protocol
from uuid import UUID


class PushNotificationTriggerConfigProto(Protocol):
    id: UUID
    delay: datetime.timedelta | None
    config_datetime: datetime.datetime | None
    config_time: datetime.time | None
