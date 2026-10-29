from typing import Optional, Any

import import_export.fields
from django.contrib import admin
from django.contrib.admin import StackedInline, ModelAdmin, TabularInline
from django.contrib.admin.templatetags.admin_urls import admin_urlname
from django.contrib.postgres.fields import HStoreField
from django.http import HttpRequest, HttpResponse
from django.urls import reverse
from django.utils.safestring import mark_safe
from django.utils.translation import gettext
from django_jsonform.widgets import JSONFormWidget
from django_pydantic_field.v2.fields import PydanticSchemaField
from import_export.admin import ImportExportMixin
from import_export.resources import ModelResource
from import_export.widgets import ForeignKeyWidget
from import_export_extensions.admin import CeleryImportExportMixin
from import_export_extensions.resources import CeleryModelResource
from pydantic import TypeAdapter
from django.utils.translation import gettext_lazy as _

from lebenslaeufe_app.form_helpers import FixedConstraintsModelForm
from lla_questionnaire.admin import (
    QuestionnaireFileInline,
    mark_news_unseen_for_some_action,
)
from . import models
from .models import (
    ZofarPerson,
    ZofarQuestionnaire,
    ZofarPersonQuestionnaire,
)


class DictWidget(JSONFormWidget):
    _str_dict_schema = {**TypeAdapter(dict[str, str]).json_schema(), 'keys': {}}

    def __init__(self):
        super().__init__(schema=self._str_dict_schema)


class ZofarEpisodeStateInline(StackedInline):
    model = models.ZofarEpisodeState
    extra = 0
    formfield_overrides = {
        PydanticSchemaField: {'widget': JSONFormWidget},
        HStoreField: {'widget': DictWidget},
    }


@admin.register(models.ZofarState)
class ZofarStateAdmin(ModelAdmin):
    inlines = (ZofarEpisodeStateInline,)
    formfield_overrides = {
        PydanticSchemaField: {'widget': JSONFormWidget},
        HStoreField: {'widget': DictWidget},
    }

    def get_queryset(self, request):
        return (
            super()
            .get_queryset(request)
            .select_related(
                'person_questionnaire',
                'person_questionnaire__person',
                'person_questionnaire__person__user',
                'person_questionnaire__questionnaire',
            )
        )


class ZofarQuestionnaireResource(ModelResource):
    external_id = import_export.fields.Field(attribute='external_id', column_name='id')

    def for_delete(self, row, instance):
        return not bool(row['label'])

    class Meta:
        model = models.ZofarQuestionnaire
        fields = ('external_id', 'label', 'zofar_url', 'zofar_fingerprint')
        import_id_fields = ('external_id',)


@admin.register(models.ZofarQuestionnaire)
class ZofarQuestionnaireAdmin(ImportExportMixin, ModelAdmin):
    resource_class = ZofarQuestionnaireResource
    search_fields = (
        'external_id',
        'label',
    )
    inlines = (QuestionnaireFileInline,)


class ZofarPersonQuestionnaireInline(TabularInline):
    model = models.ZofarPersonQuestionnaire
    extra = 0
    autocomplete_fields = ('questionnaire',)
    form = FixedConstraintsModelForm


@admin.action(description='Tour als ungesehen markieren')
def mark_tour_unseen_action(modeladmin, request, queryset):
    queryset.update(has_seen_tour=False)


@admin.register(models.ZofarPerson)
class ZofarPersonAdmin(ModelAdmin):
    inlines = (ZofarPersonQuestionnaireInline,)
    list_display = (
        'external_id',
        'user',
    )
    list_display_links = ('external_id', 'user')
    search_fields = ('external_id',)
    autocomplete_fields = ('user',)
    actions = [mark_tour_unseen_action, mark_news_unseen_for_some_action]

    def changelist_view(
        self, request: HttpRequest, extra_context: Optional[dict[str, Any]] = None
    ) -> HttpResponse:
        extra_context = extra_context or {}
        extra_context['lla_extra_object_tools'] = [
            {
                'label': gettext('Umfragezuordnungen importieren'),
                'url': reverse(
                    admin_urlname(ZofarPersonQuestionnaire._meta, mark_safe('import'))
                ),
            }
        ]
        return super().changelist_view(request, extra_context)


class CreatingForeignKeyWidget(ForeignKeyWidget):
    def clean(self, value, row=None, **kwargs):
        lookup_kwargs = self.get_lookup_kwargs(value, row, **kwargs)
        obj, _ = self.get_queryset(value, row, **kwargs).get_or_create(**lookup_kwargs)
        if self.key_is_id:
            return obj.pk
        return obj


@admin.display(description=_('Person'), ordering='person__external_id')
def _person_display(obj: ZofarPersonQuestionnaire):
    return str(obj.person)


class ZofarPersonQuestionnaireResource2(CeleryModelResource):
    person = import_export.fields.Field(
        attribute='person',
        widget=CreatingForeignKeyWidget(ZofarPerson, 'external_id'),
    )
    questionnaire = import_export.fields.Field(
        attribute='questionnaire',
        widget=CreatingForeignKeyWidget(ZofarQuestionnaire, 'external_id'),
    )
    token = import_export.fields.Field(attribute='token')

    class Meta:
        model = models.ZofarPersonQuestionnaire
        fields = (
            'person',
            'questionnaire',
            'token',
        )
        import_id_fields = ('person', 'questionnaire')


@admin.register(models.ZofarPersonQuestionnaire)
class ZofarPersonQuestionnaireAdmin(CeleryImportExportMixin, ModelAdmin):
    resource_class = ZofarPersonQuestionnaireResource2
    list_display = (_person_display, 'questionnaire', 'token')
    inlines = ()
    actions = ['update_zofar_status', 'remove_zofar_status']

    def get_queryset(self, request):
        return (
            super()
            .get_queryset(request)
            .select_related('person', 'questionnaire', 'person__user')
        )
