import itertools
from collections.abc import Iterable
from datetime import timedelta
from functools import cached_property

from django.db.models import Q, UniqueConstraint, F, Value
from django.db.models.constraints import CheckConstraint
from django.db.models.functions import Coalesce, Cast
from django.utils.html import format_html_join
from django.utils.safestring import mark_safe
from django.utils.translation import gettext
from django_stubs_ext import StrOrPromise
from relativedeltafield import RelativeDeltaField

from lebenslaeufe_app.app_based_registry import AppBasedRegistry
from lla_push.triggers.base import (
    PushNotificationTrigger,
    PushNotificationTriggerConfigFields,
)
from lla_questionnaire.models import Person


class PushTriggerChoices:
    def __init__(self, registry: 'PushTriggerRegistry'):
        self._registry = registry

    def __iter__(self):
        for key, (name, _) in self._registry.items():
            yield key, name


class PushTriggerRegistry(
    AppBasedRegistry[tuple[StrOrPromise, PushNotificationTrigger]]
):
    app_module_name = 'push_notification_triggers'

    def register(self, key: str, name: StrOrPromise, trigger: PushNotificationTrigger):
        self._register_internal(key, (name, trigger))

    @cached_property
    def choices(self) -> Iterable[tuple[str, str]]:
        return PushTriggerChoices(self)

    def create_template_help_text(self) -> str:
        trigger_keys = (
            ck
            for key, (_, trigger) in self.items()
            for ck in trigger.get_template_context_keys()
        )
        person_keys = Person.get_all_push_notification_context_keys()
        all_keys = itertools.chain(trigger_keys, person_keys)

        return format_html_join(
            mark_safe('<br>'),
            '<code>{{{{ {} }}}}</code>: {}',
            {
                context_key: (context_key, label) for context_key, label in all_keys
            }.values(),
        )

    def create_trigger_field_help_text(
        self, field: PushNotificationTriggerConfigFields
    ) -> str:
        names = [
            f'"{str(name)}"'
            for key, (name, trigger) in self.items()
            if field in trigger.config_fields
        ]
        if names:
            return f'Für Typ{"en" if len(names) != 1 else ""} {", ".join(names)}'
        else:
            return ''

    def create_field_constraints(self) -> Iterable[CheckConstraint]:
        """
        Generate the CheckConstraints that validate the correct config fields
        are set.
        :return:
        """
        for key, (_label, trigger) in self.items():
            if trigger.config_fields:
                field_names = []
                conditions = []
                for field in trigger.config_fields:
                    db_field_name = field.db_field_name
                    field_is_correct = Q((f'{db_field_name}__isnull', False))
                    conditions.append(field_is_correct)
                    field_names.append(field.translation())

                if not conditions:
                    continue

                error_message = gettext(
                    'Folgende Felder sind für diesen Trigger erforderlich: %(fields)s'
                    % {'fields': ', '.join(field_names)},
                )
                field_condition = Q.create(conditions, connector=Q.OR)
                yield CheckConstraint(
                    name=f'%(app_label)s_%(class)s_fields_set_for_{key}',
                    condition=~Q(trigger_type=key) | field_condition,
                    violation_error_message=error_message,
                )

    def create_field_unique_constraints(self) -> Iterable[UniqueConstraint]:
        def key(itm: tuple[str, tuple[StrOrPromise, PushNotificationTrigger]]) -> int:
            return itm[1][1].config_fields.value

        sorted_triggers = sorted(self.items(), key=key)

        for fields_val, group in itertools.groupby(sorted_triggers, key=key):
            fields = PushNotificationTriggerConfigFields(fields_val)
            trigger_types = [key for key, (_, trigger) in group]

            base_fields = [
                F('config'),
                Coalesce(
                    F('delay'),
                    Cast(Value(timedelta()), output_field=RelativeDeltaField()),
                ),
            ]
            if len(trigger_types) > 1:
                base_fields.append(F('trigger_type'))

            yield UniqueConstraint(
                *base_fields,
                *(F(config_field.db_field_name) for config_field in fields),
                condition=Q(trigger_type__in=trigger_types),
                name=f'%(app_label)s_%(class)s_unique_trigger_{"_".join(trigger_types)}',
                violation_error_message=gettext('Dieser Auslöser existiert bereits.'),
            )


PUSH_NOTIFICATION_TRIGGERS = PushTriggerRegistry()
