import datetime
import logging
import uuid
from collections.abc import Collection
from typing import Self, NamedTuple

from django.conf import settings
from django.db import models, transaction
from django.db.models import Q, TextChoices, Func, Value, F, Prefetch
from django.db.models.fields import TextField
from django.db.models.lookups import Exact
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from lla_push.models.notification_bodies import PushNotificationBodies
from lla_push.models.device import WebPushDeviceProxy
from lla_questionnaire.models import Person


logger = logging.getLogger(__name__)


class PushNotificationQuerySet(models.QuerySet):
    def select_body_creation_data(self) -> Self:
        return self.prefetch_related(
            Prefetch('person', Person.objects.select_subclass_data('push_notification'))
        ).select_related('trigger', 'trigger__config')


class PushNotificationManager(models.Manager):
    pass


class PushNotificationPrepareResult(NamedTuple):
    created_targets: Collection['PushNotificationTarget']
    bodies: PushNotificationBodies | None


class PushNotification(models.Model):
    """
    A push notification to be sent to a user. All devices linked to this user
    will receive this notification.
    """

    id = models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True)
    person = models.ForeignKey(
        Person,
        on_delete=models.CASCADE,
        related_name='push_notifications',
    )
    trigger = models.ForeignKey(
        'lla_push.PushNotificationTriggerConfig',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    trigger_data = models.JSONField(null=True)
    created_at = models.DateTimeField(default=timezone.now)
    scheduled_at = models.DateTimeField(null=True, blank=True)
    ready_to_send = models.BooleanField(default=False)
    body = models.JSONField(null=True)
    ttl = models.PositiveIntegerField(
        default=datetime.timedelta(hours=24).total_seconds()
    )

    @transaction.atomic()
    def prepare_due(
        self, save: bool = True, revalidate: bool = True
    ) -> PushNotificationPrepareResult:
        if self.ready_to_send:
            raise ValueError('PushNotification already ready to send')

        if (
            revalidate
            and self.trigger is not None
            and not self.trigger.trigger_instance.revalidate_delayed(self.trigger, self)
        ):
            logger.info(
                'Delayed PushNotification %s was dropped due to revalidation', self.pk
            )
            return PushNotificationPrepareResult(
                created_targets=(),
                bodies=None,
            )

        device_ids = WebPushDeviceProxy.objects.filter_for_person(
            self.person_id
        ).values_list('pk', flat=True)
        created_targets = PushNotificationTarget.objects.bulk_create(
            PushNotificationTarget(notification_id=self.pk, device_id=device_id)
            for device_id in device_ids
        )

        update_fields = ['ready_to_send']
        if self.body is None:
            if self.trigger_id is None:
                raise AssertionError(
                    'Notification without trigger must have its body set.'
                )
            bodies = self.trigger.config.create_notification_bodies(self)
            self.body = bodies.push
            update_fields.append('body')
        else:
            bodies = None

        self.ready_to_send = True
        if save:
            self.save(update_fields=update_fields)
        return PushNotificationPrepareResult(
            created_targets=created_targets,
            bodies=bodies,
        )

    objects = PushNotificationManager.from_queryset(PushNotificationQuerySet)()

    class Meta:
        verbose_name = _('Benachrichtigung')
        verbose_name_plural = _('Benachrichtigungen')
        constraints = (
            models.CheckConstraint(
                name='%(app_label)s_%(class)s_ready_to_send_or_scheduled',
                condition=Q(ready_to_send=True) | Q(scheduled_at__isnull=False),
            ),
            models.CheckConstraint(
                name='%(app_label)s_%(class)s_body_set_when_ready_to_send',
                condition=Q(ready_to_send=False) | Q(body__isnull=False),
            ),
            models.CheckConstraint(
                name='%(app_label)s_%(class)s_body_set_when_no_trigger',
                condition=Q(body__isnull=False) | Q(trigger_id__isnull=False),
            ),
            models.CheckConstraint(
                name='%(app_label)s_%(class)s_body_is_json_object',
                condition=Q(body__isnull=True)
                | Exact(
                    Func(F('body'), output_field=TextField(), function='jsonb_typeof'),
                    Value('object', output_field=TextField()),
                ),
            ),
            models.CheckConstraint(
                name='%(app_label)s_%(class)s_trigger_data_set_only_with_id',
                condition=Q(trigger_id__isnull=False) | Q(trigger_data__isnull=True),
            ),
            models.UniqueConstraint(
                fields=('person', 'trigger_id', 'trigger_data'),
                condition=Q(trigger_id__isnull=False),
                name='%(app_label)s_%(class)s_unique_trigger',
            ),
        )

    def get_web_push_topic(self) -> str:
        """
        The Topic to use for web push, this is used to make push messages idempotent in case
         of an error.
         See https://datatracker.ietf.org/doc/html/rfc8030#section-5.4
        :return:
        """
        # Topic must be max. 32 chars of Base64 alphabet
        return self.id.hex


class PushNotificationTarget(models.Model):
    """
    A device which should receive a given push notification.
    """

    id = models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True)
    notification = models.ForeignKey(
        PushNotification, on_delete=models.CASCADE, related_name='targets'
    )
    device = models.ForeignKey(WebPushDeviceProxy, on_delete=models.CASCADE)

    class Meta:
        constraints = (
            models.UniqueConstraint(
                fields=('notification', 'device'), name='device_unique_per_notification'
            ),
        )


class PushNotificationAttemptStatus(TextChoices):
    IN_PROGRESS = 'IN_PROGRESS', _('In progress')
    SUCCESS = 'SUCCESS', _('Success')
    ERROR_RETRY = 'ERROR_RETRY', _('Retryable error')
    ERROR_FATAL = 'ERROR_FATAL', _('Fatal error')


class PushNotificationDeliveryAttemptQuerySet(models.QuerySet):
    def filter_is_final_attempt(self) -> Self:
        success = Q(status=PushNotificationAttemptStatus.SUCCESS)
        fatal_error = Q(status=PushNotificationAttemptStatus.ERROR_FATAL)
        attempts_exhausted = Q(
            attempt__gte=settings.LLA_CONFIG.push_notifications.max_attempts
        )
        return self.filter(success | fatal_error | attempts_exhausted)


class PushNotificationDeliveryAttempt(models.Model):
    """
    An attempt to deliver a push notification to a given device.
    """

    id = models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True)
    target = models.ForeignKey(
        PushNotificationTarget, on_delete=models.CASCADE, related_name='attempts'
    )
    attempt = models.PositiveIntegerField()
    created_at = models.DateTimeField(default=timezone.now)
    completed_at = models.DateTimeField(null=True, blank=True)
    error_message = models.TextField(blank=True)
    status = models.CharField(choices=PushNotificationAttemptStatus)

    objects = PushNotificationDeliveryAttemptQuerySet.as_manager()

    class Meta:
        ordering = (
            'target_id',
            'created_at',
        )
        indexes = (models.Index(fields=('target_id', 'created_at')),)
        constraints = (
            models.UniqueConstraint(
                fields=('target',),
                condition=Q(completed_at__isnull=False) & Q(error_message=''),
                name='%(app_label)s_%(class)s_one_successful_attempt_per_target',
            ),
            models.UniqueConstraint(
                fields=('target',),
                condition=Q(status=PushNotificationAttemptStatus.IN_PROGRESS),
                name='%(app_label)s_%(class)s_one_in_progress_attempt_per_target',
            ),
            models.UniqueConstraint(
                fields=('target', 'attempt'),
                name='%(app_label)s_%(class)s_attempt_unique_per_target',
            ),
            models.CheckConstraint(
                condition=(
                    ~Q(status=PushNotificationAttemptStatus.IN_PROGRESS)
                    | Q(completed_at__isnull=True, error_message='')
                ),
                name='%(app_label)s_%(class)s_fields_in_progress_correct',
            ),
            models.CheckConstraint(
                condition=(
                    ~Q(
                        status__in=(
                            PushNotificationAttemptStatus.SUCCESS,
                            PushNotificationAttemptStatus.ERROR_RETRY,
                            PushNotificationAttemptStatus.ERROR_FATAL,
                        )
                    )
                    | Q(
                        completed_at__isnull=False,
                    )
                ),
                name='%(app_label)s_%(class)s_fields_completed_correct',
            ),
            models.CheckConstraint(
                condition=Q(attempt__gt=0),
                name='%(app_label)s_%(class)s_attempt_positive',
            ),
        )
