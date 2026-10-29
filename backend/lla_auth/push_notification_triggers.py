from typing import Iterable

from django.dispatch import receiver
from django.utils.timezone import localdate
from django.utils.translation import gettext_lazy as _
from django_celery_beat.models import CrontabSchedule

from lla_push.models.config_proto import PushNotificationTriggerConfigProto
from lla_push.triggers.base import (
    PushNotificationTriggerConfigFields,
    PushNotificationTrigger,
    PeriodicTaskSchedule,
    GetPushNotificationArgs,
)
from lla_push.triggers.registry import PushTriggerRegistry, PUSH_NOTIFICATION_TRIGGERS
from lla_push.triggers.trigger_result import TriggeredPushNotification


class UserBirthdayTrigger(PushNotificationTrigger):
    config_fields = PushNotificationTriggerConfigFields.TIME

    def get_schedule(
        self, config: PushNotificationTriggerConfigProto
    ) -> PeriodicTaskSchedule:
        return CrontabSchedule.objects.get_or_create(
            hour=str(config.config_time.hour), minute=str(config.config_time.minute)
        )[0]

    def get_notifications(
        self, args: GetPushNotificationArgs
    ) -> Iterable[TriggeredPushNotification]:
        local_date = localdate(args.now)
        trigger_data = {'d': local_date.isoformat()}

        people = args.people.filter(
            user__date_of_birth=local_date,
        )
        for person_id in people.values_list('id', flat=True).iterator():
            yield TriggeredPushNotification(
                person_id=person_id, trigger_data=trigger_data
            )


@receiver(
    PUSH_NOTIFICATION_TRIGGERS.register_signal,
    dispatch_uid='lla_questionnaire.push_triggers',
)
def push_triggers(registry: PushTriggerRegistry, **_kwargs):
    registry.register('birthday', _('Geburtsdatum'), UserBirthdayTrigger())
