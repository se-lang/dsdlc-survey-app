import logging

from celery import shared_task, Celery
from celery.schedules import crontab
from django.conf import settings
from django.utils import timezone

from lebenslaeufe_app.celery import celery_app
from lla_auth.models import User


logger = logging.getLogger(__name__)


@shared_task
def trigger_forgot_password(email: str) -> None:
    try:
        email = User.objects.normalize_email(email)
        user = User.objects.get(email=email, is_active=True)
        user.send_password_reset_email()
    except User.DoesNotExist:
        pass


@shared_task
def trigger_resend_account_activation(
    *, email: str | None = None, uidb64: str | None = None, **lookups
) -> None:
    try:
        if email is not None:
            lookups['email'] = User.objects.normalize_email(email)
        if (
            uidb64 is not None
            and (pk := User.objects.decode_uidb64(uidb64)) is not None
        ):
            lookups['pk'] = pk
        user = User.objects.get(**lookups)
        user.send_account_activation()
    except User.DoesNotExist:
        pass


@shared_task
def cleanup_user_table() -> None:
    num_deleted, _ = User.objects.filter(
        is_active=False,
        date_joined__lte=timezone.now()
        - settings.LLA_CONFIG.auth.inactive_user_lifetime,
    ).delete()
    if num_deleted:
        logger.info('Deleted %s expired inactive users.', num_deleted)


@celery_app.on_after_finalize.connect
def setup_periodic_tasks(sender: Celery, **kwargs):
    sender.add_periodic_task(
        crontab(minute='14', hour='2'),
        cleanup_user_table.s(),
        name='Delete expired inactive users',
    )
