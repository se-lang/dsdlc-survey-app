import uuid
from typing import Self
from uuid import UUID

from django.contrib.sessions.models import Session
from django.db import models
from django.db.models import Exists, OuterRef
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from push_notifications.models import WebPushDevice

from lla_questionnaire.models import Person


class WebPushDeviceSessionQuerySet(models.QuerySet):
    def filter_valid_session(self) -> Self:
        return self.filter(
            session__expire_date__gt=timezone.now(),
        )


class WebPushDeviceProxyQuerySet(models.QuerySet):
    def filter_for_person(self, person_id: UUID) -> Self:
        return self.filter(
            active=True,
        ).filter(
            Exists(
                Person.objects.filter(
                    pk=person_id,
                    user_id=OuterRef('user_id'),
                )
            ),
        )

    def filter_valid(self) -> Self:
        return self.filter(
            session__isnull=False,
            session__session__expire_date__gt=timezone.now(),
            active=True,
        )


class WebPushDeviceProxy(WebPushDevice):
    objects = WebPushDeviceProxyQuerySet.as_manager()

    def is_valid(self) -> bool:
        return (
            self.active
            and hasattr(self, 'session')
            and self.session.session.expire_date > timezone.now()
        )

    class Meta:
        proxy = True
        verbose_name = _('Gerät')
        verbose_name_plural = _('Geräte')


class WebPushDeviceSession(models.Model):
    id = models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True)
    device = models.OneToOneField(
        WebPushDevice,
        on_delete=models.CASCADE,
        related_name='session',
    )
    session = models.OneToOneField(Session, on_delete=models.CASCADE)

    objects = WebPushDeviceSessionQuerySet.as_manager()
