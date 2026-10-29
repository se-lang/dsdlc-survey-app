import json
import logging
from datetime import timedelta
from typing import Any
from uuid import UUID

from celery import shared_task, Celery, signals
from celery.schedules import crontab, schedule
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.db import IntegrityError, transaction
from django.db.models import Exists, OuterRef, F, Value
from django.db.models.fields import FloatField, DateTimeField, DurationField
from django.db.models.functions import Cast
from django.utils import timezone
from django_celery_beat.models import PeriodicTask
from push_notifications.exceptions import WebPushError
from push_notifications.models import WebPushDevice

from lebenslaeufe_app.celery import celery_app
from lla_push.models import (
    PushNotification,
    PushNotificationTarget,
    PushNotificationDeliveryAttempt,
)
from lla_push.models.config import PushNotificationTriggerConfig, TRIGGER_DATA_SCHEDULE
from lla_push.models.delivery import (
    PushNotificationAttemptStatus,
    PushNotificationDeliveryAttemptQuerySet,
)

logger = logging.getLogger(__name__)


@shared_task
def push_notification_cleanup():
    logger.info('Start cleanup of old WebPushDevices')
    num_deleted, _ = WebPushDevice.objects.filter(session__isnull=True).delete()
    logger.info('Deleted %d old WebPushDevices', num_deleted)

    logger.info('Start cleanup of old push notifications')
    time_limit = timezone.now() - settings.LLA_CONFIG.push_notifications.keep_interval
    num_deleted, _ = (
        PushNotification.objects.filter(
            Exists(
                PushNotificationTarget.objects.filter(
                    notification_id=OuterRef('pk')
                ).filter(
                    Exists(
                        PushNotificationDeliveryAttempt.objects.filter(
                            target_id=OuterRef('pk'),
                        ).filter_is_final_attempt()
                    )
                )
            )
        )
        .filter(created_at__lt=time_limit, ready_to_send=True)
        .delete()
    )
    logger.info('Deleted %s old Push Notifications', num_deleted)


def _get_current_attempt(
    target: PushNotificationTarget,
) -> PushNotificationDeliveryAttempt | None:
    attempts = PushNotificationDeliveryAttempt.objects.filter(
        target=target,
        status__in=(
            PushNotificationAttemptStatus.IN_PROGRESS,
            PushNotificationAttemptStatus.SUCCESS,
            PushNotificationAttemptStatus.ERROR_FATAL,
        ),
    )
    if attempts.exists():
        return None

    try:
        next_attempt = (
            PushNotificationDeliveryAttempt.objects.filter(target=target).count() + 1
        )
        if next_attempt > settings.LLA_CONFIG.push_notifications.max_attempts:
            return None
        return PushNotificationDeliveryAttempt.objects.create(
            target=target,
            status=PushNotificationAttemptStatus.IN_PROGRESS,
            attempt=next_attempt,
        )
    except IntegrityError as e:
        logger.info(
            'IntegrityError during creation of delivery attempt, likely concurrent attempt',
            e,
        )
        return None


def _maybe_retry(
    target: PushNotificationTarget, attempt: PushNotificationDeliveryAttempt
):
    if attempt.status != PushNotificationAttemptStatus.ERROR_RETRY:
        return
    if attempt.attempt >= settings.LLA_CONFIG.push_notifications.max_attempts:
        return
    push_settings = settings.LLA_CONFIG.push_notifications
    interval_seconds = push_settings.backoff_interval.total_seconds()
    delay_seconds = interval_seconds * (push_settings.backoff_rate**attempt.attempt)
    attempt_delivery.apply_async(
        args=(target.id,),
        countdown=delay_seconds,
    )


def _attempt_target_delivery(
    notification: PushNotification, target: PushNotificationTarget
):
    if not target.device.is_valid():
        logger.info(
            'Push notification to device which is no longer valid, %s', target.device.id
        )
        target.delete()
    else:
        attempt = _get_current_attempt(target)
        if attempt is None:
            return
        try:
            results = target.device.send_message(
                json.dumps(notification.body),
                ttl=notification.ttl,
                headers={'Topic': notification.get_web_push_topic()},
            )
            attempt.completed_at = timezone.now()
            if results.get('success'):
                attempt.status = PushNotificationAttemptStatus.SUCCESS
                logger.info('Successfully sent notification %s', results)
            elif not target.device.active:
                attempt.status = PushNotificationAttemptStatus.ERROR_FATAL
                attempt.error_message = 'Device gone/invalid'
            else:
                attempt.status = PushNotificationAttemptStatus.ERROR_RETRY
                attempt.error_message = f'Unknown error message:\n{results}'
        except Exception as e:
            if isinstance(e, WebPushError):
                logger.warning('Failed to deliver WebPush notification', e)
            else:
                logger.error('Fatal error during WebPush delivery', e)

            attempt.completed_at = timezone.now()
            attempt.status = PushNotificationAttemptStatus.ERROR_RETRY
            attempt.error_message = str(e)
        finally:
            attempt.save()
            _maybe_retry(target, attempt)


@shared_task
def attempt_delivery(target_id: UUID):
    try:
        target = PushNotificationTarget.objects.select_related(
            'notification', 'device', 'device__session', 'device__session__session'
        ).get(id=target_id)
    except PushNotificationTarget.DoesNotExist:
        logger.warning('Push notification target %s gone in delivery task', target_id)
    else:
        _attempt_target_delivery(target.notification, target)


@shared_task
def push_delivery_failsafe(at_startup: bool = False):
    if at_startup:
        updated = PushNotificationDeliveryAttempt.objects.filter(
            status=PushNotificationAttemptStatus.IN_PROGRESS
        ).update(
            status=PushNotificationAttemptStatus.ERROR_RETRY,
            error_message='Interrupted by system restart',
        )
        logger.info(
            'Delivery failsafe at startup has stopped %s in progress deliveries',
            updated,
        )

    attempt_qs: PushNotificationDeliveryAttemptQuerySet = (
        PushNotificationDeliveryAttempt.objects.filter(target_id=OuterRef('id'))
    )

    # If there exists a final attempt for a target, we don't care about that target
    # as it has had its final attempt already
    targets = PushNotificationTarget.objects.filter(
        ~Exists(attempt_qs.filter_is_final_attempt())
    )

    if not at_startup:
        # If we're not at startup, account for exponential backoff
        last_attempt = attempt_qs.filter(
            ~Exists(
                PushNotificationDeliveryAttempt.objects.filter(
                    target=OuterRef('target'),
                    attempt__gt=OuterRef('attempt'),
                )
            )
        )
        bo_interval = Value(
            settings.LLA_CONFIG.push_notifications.backoff_interval.total_seconds(),
            output_field=FloatField(),
        )
        bo_rate = Value(
            settings.LLA_CONFIG.push_notifications.backoff_rate,
            output_field=FloatField(),
        )
        retry_number = Cast(F('attempt'), output_field=FloatField())
        retry_delay = bo_interval * (bo_rate**retry_number)
        one_second = Value(timedelta(seconds=1), output_field=DurationField())
        delay = (retry_delay + Value(30.0, output_field=FloatField())) * one_second
        now = Value(timezone.now(), output_field=DateTimeField())
        targets = targets.filter(
            Exists(
                last_attempt.filter(
                    created_at__lte=now - delay,
                )
            )
        )
    ids = targets.values_list('id', flat=True)
    for id_ in ids:
        attempt_delivery.delay(id_)
    logger.info('Delivery failsafe has restarted delivery of %s targets', len(ids))


@shared_task()
def prepare_due_notification(notification_id: UUID):
    try:
        with transaction.atomic():
            notification = (
                PushNotification.objects.select_body_creation_data()
                .select_for_update(of=('self',))
                .get(pk=notification_id, ready_to_send=False)
            )
            prepare_result = notification.prepare_due()

            def on_commit():
                for target in prepare_result.created_targets:
                    attempt_delivery.delay(target.id)
                if prepare_result.bodies is not None:
                    user = notification.person.user
                    if user is not None:
                        mail = EmailMultiAlternatives(
                            to=(user.email,),
                            subject=prepare_result.bodies.email_subject,
                            body=prepare_result.bodies.email_text,
                        )
                        mail.attach_alternative(
                            prepare_result.bodies.email_html, 'text/html'
                        )
                        mail.send()

            transaction.on_commit(on_commit)
    except PushNotification.DoesNotExist:
        logger.info(
            'Notification %s already processed or deleted in prepare_due',
            notification_id,
        )


@shared_task()
def check_scheduled_notifications():
    """
    Check for any push notifications which are scheduled to be sent now.
    :return:
    """
    now = timezone.now()
    due_notifications = PushNotification.objects.filter(
        ready_to_send=False,
        scheduled_at__lte=now,
    ).values_list('id', flat=True)

    # if for some reason there are more than 100 notifications due in the same minute,
    # we only send 100 at a time, next time around they will be marked ready again
    for notification_id in due_notifications[:100]:
        prepare_due_notification.delay(notification_id)


@shared_task()
def run_push_notification_trigger_config(
    trigger_config_id: UUID, data: Any = TRIGGER_DATA_SCHEDULE
):
    try:
        trigger_config = (
            PushNotificationTriggerConfig.objects.select_related('config')
            .prefetch_related('config__receivers')
            .get(id=trigger_config_id)
        )
        trigger_config.run_trigger(data)
    except PushNotificationTriggerConfig.DoesNotExist:
        logger.warning(
            'Tried to run push notification trigger config %s which does not exist',
            trigger_config_id,
        )
        PeriodicTask.objects.filter(
            name=PushNotificationTriggerConfig.get_periodic_task_name(trigger_config_id)
        ).delete()


@celery_app.on_after_finalize.connect(dispatch_uid='lla_push:periodic_tasks')
def setup_periodic_tasks(sender: Celery, **_kwargs):
    sender.add_periodic_task(
        crontab(minute='0', hour='2'),
        push_notification_cleanup.s(),
        name='Regular push delivery cleanup',
    )
    sender.add_periodic_task(
        schedule(run_every=timedelta(minutes=5)),
        push_delivery_failsafe.s(),
        name='Regular push delivery failsafe',
    )
    sender.add_periodic_task(
        schedule(run_every=timedelta(minutes=1)),
        check_scheduled_notifications.s(),
        name='Check for due scheduled notifications',
    )


@signals.worker_ready.connect(dispatch_uid='lla_push:startup_tasks')
def run_startup_tasks(**_kwargs):
    push_delivery_failsafe.delay(at_startup=True)
