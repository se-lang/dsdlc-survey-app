from collections.abc import Sequence
from typing import Any

from django.contrib import admin
from django.db.models import Model
from django.forms import Form
from django.http import HttpRequest
from modeltranslation.admin import TranslationAdmin

from lla_translations.models import Translation


@admin.register(Translation)
class TranslationModelAdmin(TranslationAdmin):
    list_display = ('key', 'value_de', 'value_en')
    fieldsets = ((None, {'fields': ('key', 'value_de', 'value_en')}),)

    def get_readonly_fields(self, request: HttpRequest, obj=None) -> Sequence[str]:
        return ('key',) if obj else ()

    def save_model(
        self, request: HttpRequest, obj: Model, form: Form, change: Any
    ) -> None:
        obj.edited = True
        super().save_model(request, obj, form, change)
