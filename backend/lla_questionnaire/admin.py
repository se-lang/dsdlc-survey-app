from typing import cast

from django.contrib import admin
from django.contrib.admin import ModelAdmin, StackedInline
from django.http import HttpRequest
from django.utils import timezone
from modeltranslation.admin import TranslationInlineModelAdmin

from lla_questionnaire.models import (
    QuestionnaireFile,
    QuestionnaireNews,
    Questionnaire,
    Person,
    PersonQuerySet,
    QuestionnaireNewsSeen,
    QuestionnaireQuerySet,
)


class QuestionnaireFileInline(TranslationInlineModelAdmin, StackedInline):
    model = QuestionnaireFile
    extra = 0


# These admins only exists to allow Person and Questionnaire to be used in autocomplete fields
@admin.register(Questionnaire)
class DummyQuestionnaireAdmin(ModelAdmin):
    search_fields = tuple(Questionnaire.get_all_search_fields())

    def get_queryset(self, request):
        return (
            cast(QuestionnaireQuerySet, super().get_queryset(request))
            .select_subclass_data('admin')
            .order_by('label')
        )

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=...):
        return False

    def has_delete_permission(self, request, obj=...):
        return True


@admin.register(Person)
class DummyPersonAdmin(ModelAdmin):
    search_fields = tuple(Person.get_all_search_fields())

    def get_queryset(self, request):
        return (
            cast(PersonQuerySet, super().get_queryset(request))
            .select_subclass_data('admin')
            .order_for_search()
        )

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=...):
        return False

    def has_delete_permission(self, request, obj=...):
        return True


@admin.action(description='Alle News als ungelesen markieren')
def mark_news_unseen_for_some_action(modeladmin, request, queryset):
    QuestionnaireNewsSeen.objects.filter(person_id__in=queryset.values('id')).delete()


@admin.action(description='Für alle als ungelesen markieren')
def mark_news_unseen_for_all_action(modeladmin, request, queryset):
    QuestionnaireNewsSeen.objects.filter(
        questionnaire_news_id__in=queryset.values('id')
    ).delete()


@admin.register(QuestionnaireNews)
class QuestionnaireNewsAdmin(ModelAdmin):
    autocomplete_fields = ('questionnaire',)
    list_display = (
        'title',
        'start_date',
        'end_date',
    )
    fields = (
        'title',
        'start_date',
        'end_date',
        'questionnaire',
        'description',
        'content',
    )
    actions = [mark_news_unseen_for_some_action]

    def get_changeform_initial_data(self, request: HttpRequest) -> dict:
        initial: dict = super().get_changeform_initial_data(request)
        initial['start_date'] = timezone.localdate()
        return initial
