import datetime
import enum
from abc import ABC, abstractmethod
from collections.abc import Iterable
from dataclasses import dataclass
from enum import Flag
from typing import Any

from django.db.models import QuerySet
from django.utils.translation import gettext
from django_celery_beat.models import (
    CrontabSchedule,
    IntervalSchedule,
    SolarSchedule,
    ClockedSchedule,
)
from django_stubs_ext import StrOrPromise

from lla_push.models import PushNotification
from lla_push.models.config_proto import PushNotificationTriggerConfigProto
from lla_push.triggers.trigger_result import TriggeredPushNotification
from lla_questionnaire.models import Person


class PushNotificationTriggerConfigFields(Flag):
    DATETIME = enum.auto()
    TIME = enum.auto()

    @property
    def db_field_name(self):
        return f'config_{self.name.lower()}'

    def translation(self) -> str:
        match self:
            case PushNotificationTriggerConfigFields.DATETIME:
                return gettext('Zeitpunkt')
            case PushNotificationTriggerConfigFields.TIME:
                return gettext('Uhrzeit')
            case _:
                raise ValueError()


type PeriodicTaskSchedule = (
    IntervalSchedule | CrontabSchedule | SolarSchedule | ClockedSchedule
)


@dataclass
class GetPushNotificationArgs[D = None]:
    trigger_config: PushNotificationTriggerConfigProto
    people: QuerySet[Person]
    """
    the people that are eligible to receive the notification in the first place
    """
    now: datetime.datetime
    data: D
    """
    When triggered from schedule (``get_schedule``) will be obtained from
    `get_schedule_data`, otherwise can be anything, depending on the trigger.
    """


class PushNotificationTrigger[D = None](ABC):
    """
    A trigger for push notifications, configured in the database via PushNotificationTrigger.
    """

    config_fields = PushNotificationTriggerConfigFields(0)
    """
    Which fields from PushNotificationTriggerConfigFields should be set for this trigger.
    """

    def get_schedule(
        self, config: PushNotificationTriggerConfigProto
    ) -> PeriodicTaskSchedule | None:
        """
        Create the Celery schedule for this trigger based on the given config.
        ``get_notifications`` will be called according to the schedule.

        Return None to not trigger on a schedule, in this case the trigger must handle
        triggering in some other way.

        :param config:
        :return:
        """
        return None

    def get_schedule_data(self) -> D:
        return None

    def revalidate_delayed(
        self, config: PushNotificationTriggerConfigProto, notification: PushNotification
    ) -> bool:
        """
        When a delayed push notification is due to be sent, validate that it is still valid to be
        sent. If False is returned, push notification is not sent.
        :param config:
        :param notification:
        :return:
        """
        return True

    @abstractmethod
    def get_notifications(
        self, args: GetPushNotificationArgs[D]
    ) -> Iterable[TriggeredPushNotification]:
        """
        Generate the notifications that should be sent right now according to the trigger.
        :param args:
        :return:
        """
        ...

    def get_template_context_keys(self) -> Iterable[tuple[str, StrOrPromise]]:
        return ()

    def get_template_context(
        self,
        config: PushNotificationTriggerConfigProto,
        notification: PushNotification,
        context: dict[str, Any],
    ) -> None:
        """
        Generate the template context.
        :param config:
        :param notification:
        :param context: the context
        :return:
        """
        pass
