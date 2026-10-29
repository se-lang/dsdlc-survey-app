import logging
from abc import abstractmethod
from typing import Iterable, NamedTuple, Any
from uuid import UUID

from django.db import transaction
from django.db.models import Exists, OuterRef, Q, QuerySet
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.translation import gettext_lazy as _
from django_stubs_ext import StrOrPromise
from pydantic import BaseModel, ValidationError

from lla_push.models import PushNotification
from lla_push.models.config_proto import PushNotificationTriggerConfigProto
from lla_push.triggers.base import (
    PushNotificationTrigger,
    GetPushNotificationArgs,
)
from lla_push.triggers.registry import PushTriggerRegistry, PUSH_NOTIFICATION_TRIGGERS
from lla_push.triggers.trigger_result import TriggeredPushNotification
from lla_zofar.models import (
    ZofarPersonQuestionnaire,
    ZofarQuestionnaireCompletionState,
    questionnaire_status_bulk_change,
)

logger = logging.getLogger(__name__)


class QuestionnaireTriggerData(NamedTuple):
    questionnaire_id: UUID


class QuestionnaireSerializedTriggerData(BaseModel):
    q: UUID


class BaseQuestionnaireTrigger(PushNotificationTrigger[QuestionnaireTriggerData]):
    def get_template_context_keys(self) -> Iterable[tuple[str, StrOrPromise]]:
        yield 'questionnaire_label', _('Name der Umfrage')

    def get_template_context(
        self,
        config: PushNotificationTriggerConfigProto,
        notification: PushNotification,
        context: dict[str, Any],
    ) -> None:
        super().get_template_context(config, notification, context)
        data = QuestionnaireSerializedTriggerData.model_validate(
            notification.trigger_data
        )
        label = (
            self.get_person_questionnaire_qs(data.q)
            .filter(person_id=notification.person_id)
            .values_list('questionnaire__label', flat=True)
            .first()
        )
        context['questionnaire_label'] = label or ''

    @classmethod
    @abstractmethod
    def get_person_questionnaire_qs(
        cls, questionnaire_id: UUID
    ) -> QuerySet[ZofarPersonQuestionnaire]: ...

    def revalidate_delayed(
        self, config: PushNotificationTriggerConfigProto, notification: PushNotification
    ) -> bool:
        try:
            data = QuestionnaireSerializedTriggerData.model_validate(
                notification.trigger_data
            )
            return (
                self.get_person_questionnaire_qs(data.q)
                .filter(person_id=notification.person_id)
                .exists()
            )
        except ValidationError as e:
            logger.warning(
                '%s received unparsable trigger data, ignoring', type(self).__name__, e
            )
            return False

    def get_notifications(
        self, args: GetPushNotificationArgs[QuestionnaireTriggerData]
    ) -> Iterable[TriggeredPushNotification]:
        trigger_data = {'q': args.data.questionnaire_id.hex}

        people = args.people.filter(
            Exists(
                self.get_person_questionnaire_qs(args.data.questionnaire_id).filter(
                    person_id=OuterRef('pk'),
                )
            )
        )
        for person_id in people.values_list('id', flat=True).iterator():
            yield TriggeredPushNotification(
                person_id=person_id, trigger_data=trigger_data
            )


class NewQuestionnaireTrigger(BaseQuestionnaireTrigger):
    @classmethod
    def get_person_questionnaire_qs(
        cls, questionnaire_id: UUID
    ) -> QuerySet[ZofarPersonQuestionnaire]:
        return ZofarPersonQuestionnaire.objects.filter(
            questionnaire_id=questionnaire_id,
        ).complex_filter(
            Q(status__isnull=True)
            | Q(status__completion_state=ZofarQuestionnaireCompletionState.NEW)
        )


class UnfinishedQuestionnaireTrigger(BaseQuestionnaireTrigger):
    @classmethod
    def get_person_questionnaire_qs(
        cls, questionnaire_id: UUID
    ) -> QuerySet[ZofarPersonQuestionnaire]:
        return ZofarPersonQuestionnaire.objects.filter(
            questionnaire_id=questionnaire_id,
            status__completion_state=ZofarQuestionnaireCompletionState.STARTED,
        )


NEW_QUESTIONNAIRE_TRIGGER_TYPE_ID = 'new_zofar_questionnaire'
UNFINISHED_QUESTIONNAIRE_TRIGGER_TYPE_ID = 'unfinished_zofar_questionnaire'


@receiver(
    PUSH_NOTIFICATION_TRIGGERS.register_signal, dispatch_uid='lla_zofar.push_triggers'
)
def push_triggers(registry: PushTriggerRegistry, **_kwargs):
    registry.register(
        NEW_QUESTIONNAIRE_TRIGGER_TYPE_ID,
        _('Neue Zofar Umfrage'),
        NewQuestionnaireTrigger(),
    )
    registry.register(
        UNFINISHED_QUESTIONNAIRE_TRIGGER_TYPE_ID,
        _('Nicht fertiggestellte Zofar Umfrage'),
        UnfinishedQuestionnaireTrigger(),
    )


@receiver(
    post_save,
    sender=ZofarPersonQuestionnaire,
    dispatch_uid='lla_zofar.new_questionnaire_trigger',
)
def person_questionnaire_post_save(
    instance: ZofarPersonQuestionnaire, created: bool, **_kwargs
):
    from lla_push.models.config import PushNotificationTriggerConfig
    from lla_push.tasks import run_push_notification_trigger_config

    if created:

        def on_commit():
            trigger_data = QuestionnaireTriggerData(instance.questionnaire_id)

            trigger_ids = PushNotificationTriggerConfig.objects.filter(
                trigger_type=NEW_QUESTIONNAIRE_TRIGGER_TYPE_ID
            ).values_list('pk', flat=True)
            for trigger in trigger_ids:
                run_push_notification_trigger_config.delay(trigger, trigger_data)

        transaction.on_commit(on_commit)


@receiver(
    questionnaire_status_bulk_change,
    dispatch_uid='lla_zofar.unfinished_questionnaire_trigger',
)
def questionnaire_status_bulk_save(started_questionnaire_ids: list[UUID], **_kwargs):
    from lla_push.models.config import PushNotificationTriggerConfig
    from lla_push.tasks import run_push_notification_trigger_config

    if not started_questionnaire_ids:
        return

    def on_commit():
        trigger_ids = PushNotificationTriggerConfig.objects.filter(
            trigger_type=UNFINISHED_QUESTIONNAIRE_TRIGGER_TYPE_ID
        ).values_list('pk', flat=True)

        for questionnaire_id in started_questionnaire_ids:
            trigger_data = QuestionnaireTriggerData(questionnaire_id)
            for trigger in trigger_ids:
                run_push_notification_trigger_config.delay(trigger, trigger_data)

    transaction.on_commit(on_commit)
