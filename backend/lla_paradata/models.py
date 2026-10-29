import datetime
import uuid
from typing import Any

from django.db import models
from django.db.models import DateTimeField, F, Subquery, OuterRef
from django.db.models.functions import Trunc
from django.template.defaultfilters import date, time
from django.utils import timezone
from django.utils.timezone import get_default_timezone
from django.utils.translation import gettext_lazy as _
from django_cte import CTE, with_cte

from lla_paradata.registry import PARADATA_REGISTRY
from lla_questionnaire.models import Person, Questionnaire


class ParadataEventQuerySet(models.QuerySet):
    def datetimes(self, field_name, kind, order='ASC', tzinfo=None):
        if not (field_name == 'timestamp' and kind in ('year',)):
            return super().datetimes(field_name, kind, order, tzinfo)

        # The resulting CTE query is much more efficient if we have few results
        # and an index on the TRUNC expression, which we do for "year" and "month

        def make_cte(cte: CTE):
            base_qs = (
                self.annotate(
                    datetimefield=Trunc(
                        field_name,
                        kind,
                        output_field=DateTimeField(),
                        tzinfo=tzinfo,
                    ),
                    plain_field=F(field_name),
                )
                .values('datetimefield')
                .filter(plain_field__isnull=False)
                .order_by(('-' if order == 'DESC' else '') + 'datetimefield')
            )

            nest_cte = CTE(base_qs, name=cte.name).queryset().order_by()

            recursive_qs = (
                nest_cte.annotate(
                    datetimefield2=Subquery(
                        base_qs.filter(datetimefield__gt=OuterRef('datetimefield'))[:1]
                    )
                )
                .filter(datetimefield__isnull=False)
                .values('datetimefield2')
            )

            return base_qs[:1].union(recursive_qs, all=True)

        cte = CTE.recursive(make_cte)
        return (
            with_cte(cte, select=cte.queryset())
            .filter(datetimefield__isnull=False)
            .order_by()
            .values_list('datetimefield', flat=True)
        )


class ParadataEvent(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    person = models.ForeignKey(
        'lla_questionnaire.Person', on_delete=models.CASCADE, verbose_name=_('Person')
    )
    timestamp = models.DateTimeField(default=timezone.now, verbose_name=_('Zeitpunkt'))
    active_questionnaire = models.ForeignKey(
        'lla_questionnaire.Questionnaire',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        verbose_name=_('Aktive Umfrage'),
    )
    key = models.CharField(
        choices=[(d.key, d.name) for d in PARADATA_REGISTRY.get_registrations()],
        verbose_name=_('Schlüssel'),
    )
    value = models.JSONField(null=True, blank=True, verbose_name=_('Wert'))

    objects = ParadataEventQuerySet.as_manager()

    def __str__(self):
        local_time = timezone.localtime(self.timestamp)
        return f'{self.key} ({date(local_time)}, {time(local_time)})'

    class Meta:
        ordering = ('-timestamp',)
        verbose_name = _('Paradatum')
        verbose_name_plural = _('Paradaten')
        indexes = (
            models.Index(
                fields=('key', 'timestamp', '-id'),
                name='%(app_label)s_key_ts_id',
            ),
            models.Index(
                fields=('key', '-id'),
                name='%(app_label)s_key_id',
            ),
            models.Index(
                fields=('timestamp', '-id'),
                name='%(app_label)s_ts_id',
            ),
            models.Index(
                Trunc(
                    'timestamp',
                    'year',
                    output_field=DateTimeField(),
                    tzinfo=get_default_timezone(),
                ),
                name='%(app_label)s_timestamp_year',
            ),
        )


def paradata_event(
    *,
    person_id: uuid.UUID | Person | None,
    questionnaire_id: uuid.UUID | Questionnaire | None = None,
    key: str,
    value: Any = None,
    timestamp: datetime.datetime | None = None,
    save: bool = True,
) -> ParadataEvent | None:
    """
    Create a ParadataEvent for the given person. person_id may be null in which case no event will
    be generated.
    :param person_id:
    :param questionnaire_id
    :param key:
    :param value:
    :param timestamp:
    :param save:
    :return:
    """

    if isinstance(person_id, Person):
        person_id = person_id.pk

    if isinstance(questionnaire_id, Questionnaire):
        questionnaire_id = questionnaire_id.pk

    evt = (
        ParadataEvent(
            person_id=person_id,
            active_questionnaire_id=questionnaire_id,
            key=key,
            value=PARADATA_REGISTRY[key].value_adapter.dump_python(value, mode='json'),
            timestamp=timestamp if timestamp is not None else timezone.now(),
        )
        if person_id is not None
        else None
    )
    if evt is not None and save:
        evt.save()
    return evt
