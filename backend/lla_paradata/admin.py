from collections.abc import Callable, Collection, Iterator

from django.contrib import admin
from django.contrib.admin import ModelAdmin
from django.db import models
from django.db.models import BooleanField, F, Func, Prefetch, QuerySet, Value
from import_export.admin import ExportMixin
from import_export.fields import Field
from import_export.resources import ModelResource
from import_export_extensions.admin import CeleryImportExportMixin
from import_export_extensions.resources import CeleryModelResource

from lebenslaeufe_app.admin_helpers import (
    CustomChoiceQuerySetAdminMixin,
    CustomChoiceQuerySetRelatedOnlyFieldListFilter,
)
from lla_paradata.models import ParadataEvent
from lla_paradata.registry import (
    PARADATA_REGISTRY,
    ParadataDefinition,
    ParadataFieldDefinition,
)
from lla_questionnaire.models import Person, Questionnaire


def get_paradata_subfield_exporter(
    paradata_def: ParadataDefinition, sub_field: ParadataFieldDefinition
) -> Callable[[ParadataEvent], str | None]:
    def dehydrate(evt: ParadataEvent) -> str | None:
        if evt.key == paradata_def.key:
            parsed_value = paradata_def.value_adapter.validate_python(evt.value)
            return sub_field.dehydrate(parsed_value)
        else:
            return None

    return dehydrate


class ParadataResource(CeleryModelResource):
    person_id = Field(column_name='person')
    questionnaire_id = Field(column_name='questionnaire')

    def __init__(self, present_paradata_keys: Collection[str] | None = None, **kwargs):
        super().__init__(**kwargs)
        for paradata_def in PARADATA_REGISTRY.get_registrations():
            if (
                present_paradata_keys is not None
                and paradata_def.key not in present_paradata_keys
            ):
                continue
            for sub_field in paradata_def.export_fields:
                full_field = f'{paradata_def.key}{sub_field.name}'
                self.fields[full_field] = Field(
                    column_name=full_field,
                    dehydrate_method=get_paradata_subfield_exporter(
                        paradata_def, sub_field
                    ),
                )

    def get_queryset(self) -> QuerySet:
        return super().get_queryset().prefetch_related(
            Prefetch('person', Person.objects.select_subclass_data('export')),
            Prefetch(
                'active_questionnaire',
                Questionnaire.objects.select_subclass_data('export'),
            ),
        )

    def iter_queryset(self, queryset: QuerySet) -> Iterator[ParadataEvent]:
        # The default implementation paginates with OFFSET when prefetch_related is used,
        # which rescans all previous rows for every page. queryset.iterator() would need a
        # server-side cursor, which doesn't survive a connection pooler. Instead, page by
        # (timestamp, id) so every page is a range scan on the ParadataEvent indexes.
        queryset = queryset.order_by('-timestamp', '-id')
        chunk_size = self.get_chunk_size()
        page_queryset = queryset
        while True:
            page = list(page_queryset[:chunk_size])
            yield from page
            if len(page) < chunk_size:
                return
            last = page[-1]
            page_queryset = queryset.filter(
                Func(
                    Func(
                        F('timestamp'),
                        F('id'),
                        function='ROW',
                        output_field=models.Field(),
                    ),
                    Func(
                        Value(last.timestamp),
                        Value(last.id),
                        function='ROW',
                        output_field=models.Field(),
                    ),
                    template='%(expressions)s',
                    arg_joiner=' < ',
                    output_field=BooleanField(),
                )
            )

    @staticmethod
    def dehydrate_person_id(event: ParadataEvent) -> str:
        return event.person.get_subclass_instance().render_for_export()

    @staticmethod
    def dehydrate_questionnaire_id(event: ParadataEvent) -> str:
        active_questionnaire = event.active_questionnaire
        return (
            active_questionnaire.get_subclass_instance().render_for_export()
            if active_questionnaire
            else ''
        )

    @staticmethod
    def dehydrate_timestamp(event: ParadataEvent) -> str:
        return event.timestamp.isoformat()

    class Meta:
        model = ParadataEvent
        fields = (
            'person_id',
            'questionnaire_id',
            'timestamp',
            'key',
        )


@admin.register(ParadataEvent)
class ParadataAdmin(CustomChoiceQuerySetAdminMixin, CeleryImportExportMixin, ModelAdmin):
    resource_class = ParadataResource

    sortable_by = (
        'timestamp',
        'key',
    )
    list_display = ('timestamp', 'key', 'value')
    list_display_links = ('timestamp', 'key')
    list_filter_submit = True
    list_filter_sheet = False
    date_hierarchy = 'timestamp'
    list_filter = (
        'key',
        ('person', CustomChoiceQuerySetRelatedOnlyFieldListFilter),
        ('active_questionnaire', CustomChoiceQuerySetRelatedOnlyFieldListFilter),
        'timestamp',
    )
    #
    # def get_resource_kwargs(self, request, *args, **kwargs):
    #     export_qs: QuerySet[ParadataEvent] = self.get_export_queryset(request)
    #     key_qs = export_qs.order_by().values_list('key', flat=True).distinct()
    #     keys = list(key_qs)
    #     return {
    #         **kwargs,
    #         'present_paradata_keys': keys,
    #     }
