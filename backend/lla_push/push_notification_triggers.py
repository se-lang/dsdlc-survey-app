from typing import Iterable, NamedTuple
from uuid import UUID

from django.db.models import Q
from django.dispatch import receiver
from django_celery_beat.models import ClockedSchedule

from lla_push.models.config_proto import PushNotificationTriggerConfigProto
from lla_push.triggers.base import (
    PushNotificationTriggerConfigFields,
    PushNotificationTrigger,
    PeriodicTaskSchedule,
    GetPushNotificationArgs,
)
from lla_push.triggers.registry import PushTriggerRegistry, PUSH_NOTIFICATION_TRIGGERS
from lla_push.triggers.trigger_result import TriggeredPushNotification
from django.utils.translation import gettext_lazy as _

from lla_questionnaire.models import Person
from lla_questionnaire.qnr_system_apps import filter_person_by_questionnaire


class FixedTimeTrigger(PushNotificationTrigger):
    config_fields = PushNotificationTriggerConfigFields.DATETIME

    def get_schedule(
        self, config: PushNotificationTriggerConfigProto
    ) -> PeriodicTaskSchedule:
        return ClockedSchedule.objects.get_or_create(
            clocked_time=config.config_datetime
        )[0]

    def get_notifications(
        self, args: GetPushNotificationArgs
    ) -> Iterable[TriggeredPushNotification]:
        trigger_data = {'d': args.trigger_config.config_datetime.isoformat()}
        for person_id in args.people.values_list('id', flat=True).iterator():
            yield TriggeredPushNotification(
                person_id=person_id, trigger_data=trigger_data
            )


class ManualTriggerData(NamedTuple):
    nonce: int
    default_receivers: bool
    people_ids: list[UUID]
    questionnaire_ids: list[UUID]


class ManualTrigger(PushNotificationTrigger[ManualTriggerData]):
    def get_notifications(
        self, args: GetPushNotificationArgs[ManualTriggerData]
    ) -> Iterable[TriggeredPushNotification]:
        people_qs = args.people if args.data.default_receivers else Person.objects.all()
        extra_filters = []
        if args.data.people_ids:
            extra_filters.append(Q(id__in=args.data.people_ids))
        if args.data.questionnaire_ids:
            extra_filters.append(
                filter_person_by_questionnaire(id__in=args.data.questionnaire_ids)
            )

        people_qs = people_qs.complex_filter(Q.create(extra_filters, Q.OR))

        for person_id in people_qs.values_list('id', flat=True).iterator():
            yield TriggeredPushNotification(
                person_id=person_id, trigger_data={'n': args.data.nonce}
            )


MANUAL_TRIGGER_ID = 'manual'


@receiver(
    PUSH_NOTIFICATION_TRIGGERS.register_signal, dispatch_uid='lla_push.push_triggers'
)
def push_triggers(registry: PushTriggerRegistry, **_kwargs):
    registry.register('fixed', _('Fixer Zeitpunkt'), FixedTimeTrigger())
    registry.register(MANUAL_TRIGGER_ID, _('Manuell ausgelöst'), ManualTrigger())
