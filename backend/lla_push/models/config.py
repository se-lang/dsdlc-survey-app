import datetime
import itertools
import logging
import uuid
from collections.abc import Iterable
from functools import cached_property
from typing import Any
from uuid import UUID

import html_text
import pycmarkgfm
from django.db import models
from django.db.models import Q, QuerySet, F
from django.db.models.fields.tuple_lookups import TupleIn
from django.forms.models import model_to_dict
from django.template import Template
from django.template.context import make_context
from django.utils import timezone
from django.utils.translation import gettext_lazy as _, pgettext_lazy
from django_celery_beat.models import (
    PeriodicTask,
    IntervalSchedule,
    CrontabSchedule,
    SolarSchedule,
    ClockedSchedule,
)
from kombu.utils.json import dumps as celery_json_dumps
from relativedeltafield import RelativeDeltaField

from lla_push.models import PushNotification
from lla_push.models.notification_bodies import PushNotificationBodies
from lla_push.triggers.base import (
    PushNotificationTrigger,
    GetPushNotificationArgs,
    PushNotificationTriggerConfigFields,
)
from lla_push.triggers.registry import PUSH_NOTIFICATION_TRIGGERS
from lla_questionnaire.models import Person, Questionnaire
from lla_questionnaire.qnr_system_apps import filter_person_by_questionnaire

logger = logging.getLogger(__name__)


class PushNotificationConfig(models.Model):
    """
    A configuration for push notifications that should be sent.
    Every configuration has a set of receivers (PushNotificationReceiverConfig) to which it will
    be delivered.
    Every configuration has a set of triggers (PushNotificationTriggerConfig) which determine
    when the notification will be sent.
    """

    id = models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True)
    subject = models.CharField(verbose_name=_('Betreff'), max_length=255)
    push_notification_text = models.TextField(
        verbose_name=_('Text (Push Benachrichtigung)'),
        max_length=512,
        help_text=PUSH_NOTIFICATION_TRIGGERS.create_template_help_text(),
    )
    email_html = models.TextField(verbose_name=_('Text (E-Mail)'))

    def __str__(self):
        return self.subject

    def get_people(self) -> QuerySet[Person]:
        """
        Get the people who are eligible to receive this notification.
        :return:
        """
        qs = []
        for receiver_config in self.receivers.all():
            r_q = receiver_config.get_person_filter()
            if r_q is not None:
                qs.append(r_q)

        people = Person.objects.all()
        if qs:
            people = people.complex_filter(Q.create(qs, Q.OR))
        return people

    @classmethod
    def get_template_context(cls, notification: PushNotification) -> dict[str, Any]:
        context: dict[str, Any] = {}
        notification.person.get_subclass_instance().get_push_notification_context(
            context
        )
        notification.trigger.get_template_context(notification, context)
        return context

    def create_notification_bodies(
        self, notification: PushNotification
    ) -> PushNotificationBodies:
        context = make_context(self.get_template_context(notification))
        subject = Template(self.subject).render(context)
        body = Template(self.push_notification_text).render(context)

        # TODO: Target URL configuration
        push = {
            'notification': {
                'title': subject,
                'body': body,
                'data': {
                    'onActionClick': {
                        'default': {
                            'operation': 'navigateLastFocusedOrOpen',
                            'url': '/',
                        }
                    }
                },
            }
        }

        email_md = Template(self.email_html).render(context)
        email_html = pycmarkgfm.gfm_to_html(email_md, pycmarkgfm.options.hardbreaks)
        email_text = html_text.extract_text(email_html)
        return PushNotificationBodies(
            push=push,
            email_subject=subject,
            email_text=email_text,
            email_html=email_html,
        )

    class Meta:
        verbose_name = _('Benachrichtigungskonfiguration')
        verbose_name_plural = _('Benachrichtigungskonfigurationen')


class PushNotificationReceiverType(models.TextChoices):
    EVERYONE = 'EVERYONE', _('Alle')
    SINGLE_PERSON = 'SINGLE_PERSON', _('Einzelne Personen')
    QUESTIONNAIRE = 'QUESTIONNAIRE', _('Umfrage')


class PushNotificationReceiverConfig(models.Model):
    id = models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True)
    config = models.ForeignKey(
        PushNotificationConfig, on_delete=models.CASCADE, related_name='receivers'
    )
    receiver_type = models.CharField(
        choices=PushNotificationReceiverType.choices,
        verbose_name=_('Typ'),
    )
    single_person = models.ManyToManyField(Person, blank=True, verbose_name=_('Person'))
    questionnaires = models.ManyToManyField(
        Questionnaire, blank=True, verbose_name=_('Umfrage')
    )

    def get_inline_title(self):
        return self.get_receiver_type_display()

    def get_person_filter(self) -> Q | None:
        """
        Create a filter for Person based on this receiver config. Return None to not filter.
        :return:
        """
        match self.receiver_type:
            case PushNotificationReceiverType.EVERYONE:
                return None
            case PushNotificationReceiverType.SINGLE_PERSON:
                person_ids = (
                    PushNotificationReceiverConfig.single_person.through.objects.filter(
                        pushnotificationreceiverconfig_id=self.id
                    ).values_list('person_id', flat=True)
                )
                return Q(pk__in=person_ids)
            case PushNotificationReceiverType.QUESTIONNAIRE:
                questionnaire_ids = PushNotificationReceiverConfig.questionnaires.through.objects.filter(
                    pushnotificationreceiverconfig_id=self.id
                ).values_list('questionnaire_id', flat=True)
                return Q(filter_person_by_questionnaire(id__in=questionnaire_ids))
            case _:
                raise ValueError('invalid receiver_type')

    class Meta:
        verbose_name = _('Empfänger')
        verbose_name_plural = pgettext_lazy('Plural', 'Empfänger')


_periodic_task_field_mapping = {
    IntervalSchedule: 'interval',
    CrontabSchedule: 'crontab',
    SolarSchedule: 'solar',
    ClockedSchedule: 'clocked',
}


TRIGGER_DATA_SCHEDULE = object()
"""
Placeholder for trigger data in run_trigger for when the trigger is triggered by schedule.
"""


class PushNotificationTriggerConfig(models.Model):
    id = models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True)
    config = models.ForeignKey(
        PushNotificationConfig, on_delete=models.CASCADE, related_name='triggers'
    )
    trigger_type = models.CharField(
        verbose_name=_('Typ'), choices=PUSH_NOTIFICATION_TRIGGERS.choices
    )
    delay = RelativeDeltaField(
        blank=True,
        null=True,
        verbose_name=_('Verzögerung'),
        help_text='Format: "3 months 4 hours"',
    )
    config_datetime = models.DateTimeField(
        blank=True,
        null=True,
        verbose_name=_('Zeitpunkt'),
        help_text=PUSH_NOTIFICATION_TRIGGERS.create_trigger_field_help_text(
            PushNotificationTriggerConfigFields.DATETIME
        ),
    )
    config_time = models.TimeField(
        blank=True,
        null=True,
        verbose_name=_('Uhrzeit'),
        help_text=PUSH_NOTIFICATION_TRIGGERS.create_trigger_field_help_text(
            PushNotificationTriggerConfigFields.TIME
        ),
    )

    def get_inline_title(self):
        return self.get_trigger_type_display()

    @classmethod
    def get_periodic_task_name(cls, trigger_config_id: UUID) -> str:
        return f'Push Notification Trigger Config: {trigger_config_id.hex}'

    def get_template_context(
        self, notification: PushNotification, context: dict[str, Any]
    ) -> None:
        self.trigger_instance.get_template_context(self, notification, context)

    @cached_property
    def trigger_instance(self) -> PushNotificationTrigger:
        return PUSH_NOTIFICATION_TRIGGERS[self.trigger_type][1]

    def save(self, *args, **kwargs):
        from lla_push.tasks import run_push_notification_trigger_config

        super().save(*args, **kwargs)

        schedule = self.trigger_instance.get_schedule(self)
        task_name = self.get_periodic_task_name(self.pk)
        if schedule is None:
            PeriodicTask.objects.filter(name=task_name).delete()
        else:
            field_name = _periodic_task_field_mapping[type(schedule)]
            PeriodicTask.objects.update_or_create(
                name=task_name,
                defaults={
                    'task': run_push_notification_trigger_config.s().task,
                    'interval': None,
                    'crontab': None,
                    'solar': None,
                    'clocked': None,
                    field_name: schedule,
                    'one_off': isinstance(schedule, ClockedSchedule),
                    'enabled': True,
                    'args': celery_json_dumps([self.pk]),
                    'kwargs': '{}',
                },
            )

    def delete(self, *args, **kwargs):
        pk = self.pk
        super().delete(*args, **kwargs)
        if pk:
            PeriodicTask.objects.filter(name=self.get_periodic_task_name(pk)).delete()

    def run_trigger(self, data: Any):
        from lla_push.tasks import prepare_due_notification

        logger.info('Starting push trigger check %s', self.id)

        if data is TRIGGER_DATA_SCHEDULE:
            data = self.trigger_instance.get_schedule_data()

        people = self.config.get_people()
        now = timezone.now()
        notifications = self.get_triggered_notifications(people, now, data)

        batch_size = 1000
        for batch in itertools.batched(notifications, batch_size):
            # bulk_create doesn't let us know which objects it actually created
            # To avoid redundant task scheduling for notifications which already exist,
            # we first check which notifications already exist.
            # This is of course a race condition, although a very unlikely one
            # Even if a race does happen, the worst result is that we schedule
            # prepare_due_notification to run again, which will bail out on a notification
            # which is already done.

            # Note: Although trigger_id is the same for all checks here,
            # we include it in the Tuple so that the database can use the index
            # on (person_id, trigger_id, trigger_data)

            batch_keys = [
                (notification.person_id, self.id, notification.trigger_data)
                for notification in batch
            ]
            existing_notifications_keys = (
                PushNotification.objects.filter(
                    TupleIn(
                        (F('person_id'), F('trigger_id'), F('trigger_data')),
                        batch_keys,
                    )
                )
                .values_list('person_id', 'trigger_data')
                # make sure to sort, so we can use group_by later
                .order_by('person_id')
            )

            # trigger_data is a dict, so we can't include it in a set.
            # assuming there won't be many notifications for the same person
            # for every trigger invocation, we can use a simple "x in tuple" check instead
            # to check for trigger data instead
            existing_notifications = {
                person_id: tuple(trigger_data for _, trigger_data in group)
                for person_id, group in itertools.groupby(
                    existing_notifications_keys, lambda row: row[0]
                )
            }

            filtered_batch = (
                notification
                for notification in batch
                if notification.trigger_data
                not in existing_notifications.get(notification.person_id, ())
            )
            created_notifications: list[PushNotification] = (
                PushNotification.objects.bulk_create(
                    filtered_batch,
                    ignore_conflicts=True,
                    batch_size=batch_size,
                )
            )
            for notification in created_notifications:
                if not notification.ready_to_send and notification.scheduled_at == now:
                    logger.info(
                        'Immediate push notification created %s',
                        model_to_dict(notification),
                    )
                    prepare_due_notification.delay(notification.pk)
                else:
                    logger.info(
                        'Delayed push notification created %s',
                        model_to_dict(notification),
                    )

    def get_triggered_notifications(
        self, people: QuerySet[Person], now: datetime.datetime, data: Any
    ) -> Iterable[PushNotification]:
        if self.delay is not None:
            scheduled_at = now + self.delay
        else:
            scheduled_at = now

        notifications = self.trigger_instance.get_notifications(
            GetPushNotificationArgs(
                trigger_config=self, people=people, now=now, data=data
            )
        )
        for notification in notifications:
            yield PushNotification(
                person_id=notification.person_id,
                trigger_id=self.id,
                trigger_data=notification.trigger_data,
                created_at=now,
                scheduled_at=scheduled_at,
            )

    class Meta:
        verbose_name = _('Auslöser')
        verbose_name_plural = pgettext_lazy('Plural', 'Auslöser')

        constraints = [
            *(PUSH_NOTIFICATION_TRIGGERS.create_field_constraints()),
            models.CheckConstraint(
                name='%(app_label)s_%(class)s_valid_type',
                condition=Q(trigger_type__in=PUSH_NOTIFICATION_TRIGGERS.keys()),
            ),
            *PUSH_NOTIFICATION_TRIGGERS.create_field_unique_constraints(),
        ]
