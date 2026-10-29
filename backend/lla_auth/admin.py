from django.contrib import admin
from django.contrib.admin import ModelAdmin
from django.contrib.auth.admin import UserAdmin, GroupAdmin
from django.contrib.auth.models import Group
from django.db.models import QuerySet
from django.http import HttpRequest
from import_export.fields import Field
from import_export_extensions.admin import CeleryExportAdminMixin
from import_export_extensions.resources import CeleryModelResource

from .models import User, GroupProxy
from django.utils.translation import gettext_lazy as _
import lla_auth.tasks


class UserResource(CeleryModelResource):
    external_id = Field(
        attribute='person__zofarperson__external_id', column_name='Externe ID'
    )
    first_name = Field(attribute='first_name', column_name='Vorname')
    last_name = Field(attribute='last_name', column_name='Nachname')
    street = Field(attribute='street', column_name='Straße, Nr.')
    zip_code = Field(attribute='zip_code', column_name='PLZ')
    city = Field(attribute='city', column_name='Ort')
    country = Field(attribute='country', column_name='Land')
    phone = Field(attribute='phone', column_name='Telefonnummer')
    date_of_birth = Field(attribute='date_of_birth', column_name='Geburtsdatum')
    is_staff = Field(column_name='Mitarbeiter-Status')

    def get_queryset(self) -> QuerySet:
        return super().get_queryset().select_related('person__zofarperson')

    @staticmethod
    def dehydrate_is_staff(user: User) -> str:
        return 'Ja' if user.is_staff else 'Nein'

    class Meta:
        model = User
        fields = (
            'external_id',
            'first_name',
            'last_name',
            'street',
            'zip_code',
            'city',
            'country',
            'phone',
            'date_of_birth',
            'is_staff',
        )


@admin.register(User)
class CustomUserAdmin(CeleryExportAdminMixin, UserAdmin):
    resource_class = UserResource
    list_display = ('email', 'first_name', 'last_name', 'is_staff')

    ordering = ('email',)
    search_fields = ('email', 'first_name', 'last_name')
    actions = (
        'send_push_notification',
        'resend_welcome_email',
    )
    compressed_fields = True

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (
            _('Personal info'),
            {
                'fields': (
                    'first_name',
                    'last_name',
                    'street',
                    'zip_code',
                    'city',
                    'country',
                    'phone',
                    'date_of_birth',
                )
            },
        ),
        (
            _('Permissions'),
            {
                'fields': (
                    'is_active',
                    'is_staff',
                    'is_superuser',
                    'groups',
                    'user_permissions',
                ),
            },
        ),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (
            None,
            {
                'classes': ('wide',),
                'fields': ('email', 'password1', 'password2'),
            },
        ),
    )

    @admin.action(
        description=_('Willkommens E-Mail erneut senden'),
    )
    def resend_welcome_email(self, request: HttpRequest, queryset: QuerySet):
        for pk in queryset.values_list('pk', flat=True):
            lla_auth.tasks.trigger_resend_account_activation.delay(pk=pk)


admin.site.unregister(Group)


@admin.register(GroupProxy)
class GroupProxyAdmin(GroupAdmin, ModelAdmin):
    pass
