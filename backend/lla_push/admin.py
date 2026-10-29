from time import time_ns
from typing import Optional, cast

from django.contrib import admin, messages
from django.contrib.admin import AdminSite, StackedInline, ModelAdmin, TabularInline
from django.contrib.admin.templatetags.admin_urls import admin_urlname
from django.contrib.admin.widgets import AutocompleteSelectMultiple
from django.db.models import Field
from django.forms import ModelMultipleChoiceField
from django.forms.forms import Form
from django.http import HttpRequest
from django.shortcuts import redirect
from django.urls import reverse, path
from django.utils.safestring import mark_safe
from django.utils.translation import gettext_lazy as _, gettext
from django.views.generic.detail import (
    BaseDetailView,
    SingleObjectTemplateResponseMixin,
)
from django.views.generic.edit import BaseFormView
from modeltranslation.admin import TabbedTranslationAdmin
from push_notifications.admin import WebPushDeviceAdmin
from push_notifications.models import APNSDevice, GCMDevice, WNSDevice, WebPushDevice

from lebenslaeufe_app.admin_helpers import CustomChoiceQuerySetAdminMixin
from lebenslaeufe_app.easymde import EasyMDEWidget
from lebenslaeufe_app.form_helpers import FixedConstraintsModelForm
from lla_questionnaire.models import Person, Questionnaire
from .models import (
    WebPushDeviceSession,
    PushNotification,
    PushNotificationTarget,
    PushNotificationDeliveryAttempt,
    WebPushDeviceProxy,
    PushNotificationConfig,
)
from .models.config import PushNotificationTriggerConfig, PushNotificationReceiverConfig
from .push_notification_triggers import MANUAL_TRIGGER_ID, ManualTriggerData
from .tasks import run_push_notification_trigger_config

admin.site.unregister(APNSDevice)
admin.site.unregister(GCMDevice)
admin.site.unregister(WNSDevice)
admin.site.unregister(WebPushDevice)


class WebPushDeviceSessionInline(StackedInline):
    model = WebPushDeviceSession
    extra = 0

    def has_add_permission(self, request, obj):
        return False

    def has_change_permission(self, request, obj=None):
        return False


@admin.register(WebPushDeviceProxy)
class CustomWebPushDeviceAdmin(WebPushDeviceAdmin, ModelAdmin):
    inlines = (WebPushDeviceSessionInline,)


@admin.register(PushNotification)
class PushNotificationAdmin(ModelAdmin):
    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False


class PushNotificationAttemptInline(TabularInline):
    model = PushNotificationDeliveryAttempt
    extra = 0


@admin.register(PushNotificationTarget)
class PushNotificationTargetAdmin(ModelAdmin):
    inlines = (PushNotificationAttemptInline,)


class PushNotificationTriggerAdminInline(StackedInline):
    tab = True
    model = PushNotificationTriggerConfig
    extra = 0
    form = FixedConstraintsModelForm


class PushNotificationReceiverAdminInline(
    CustomChoiceQuerySetAdminMixin, StackedInline
):
    tab = True
    model = PushNotificationReceiverConfig
    extra = 0
    autocomplete_fields = ('single_person', 'questionnaires')


class PushNotificationSendNowForm(Form):
    people = ModelMultipleChoiceField(
        queryset=Person.objects.select_subclass_data('admin'),
        blank=True,
        required=False,
        label=_('Personen'),
        help_text=_(
            'Wählen Sie nichts aus, um an die Standardempfänger dieser Benachrichtigung '
            'zu senden.'
        ),
    )
    questionnaires = ModelMultipleChoiceField(
        queryset=Questionnaire.objects.all(),
        blank=True,
        required=False,
        label=_('Umfragen'),
        help_text=_(
            'Wählen Sie nichts aus, um an die Standardempfänger dieser Benachrichtigung '
            'zu senden.'
        ),
    )

    def __init__(self, admin_site: AdminSite, *args, **kwargs):
        super().__init__(*args, **kwargs)

        def init_autocomplete(name: str, model_field):
            form_field = cast(ModelMultipleChoiceField, self.fields[name])
            form_field.widget = AutocompleteSelectMultiple(
                model_field,
                admin_site,
            )
            # the setter of queryset has a side effect of updating the widget.
            # because we assign the widget late, we have to trigger the setter again so that the
            # Autocomplete widget works
            form_field.queryset = form_field.queryset

        init_autocomplete(
            'people', PushNotificationReceiverConfig._meta.get_field('single_person')
        )
        init_autocomplete(
            'questionnaires',
            PushNotificationReceiverConfig._meta.get_field('questionnaires'),
        )


class PushNotificationSendNowView(
    SingleObjectTemplateResponseMixin, BaseDetailView, BaseFormView
):
    model_admin: ModelAdmin = None
    pk_url_kwarg = 'object_id'
    queryset = PushNotificationConfig.objects.all()
    context_object_name = 'push_config'
    template_name = 'lla_push/admin/send_now.html'
    form_class = PushNotificationSendNowForm

    def get_form_kwargs(self):
        return {
            **super().get_form_kwargs(),
            'admin_site': self.model_admin.admin_site,
        }

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context.update(self.model_admin.admin_site.each_context(self.request))
        context['has_view_permission'] = self.model_admin.has_view_permission(
            self.request, self.object
        )
        context['opts'] = self.object._meta
        return context

    def dispatch(self, request, *args, **kwargs):
        if request.method != 'GET':
            self.object = self.get_object()
        return super().dispatch(request, *args, **kwargs)

    def form_invalid(self, form):
        return super().form_invalid(form)

    def form_valid(self, form):
        manual_trigger, _created = PushNotificationTriggerConfig.objects.get_or_create(
            config_id=self.object.id,
            trigger_type=MANUAL_TRIGGER_ID,
        )
        people_ids = [p.pk for p in form.cleaned_data['people']]
        questionnaire_ids = [q.pk for q in form.cleaned_data['questionnaires']]
        run_push_notification_trigger_config.delay(
            manual_trigger.pk,
            ManualTriggerData(
                nonce=time_ns(),
                default_receivers=not people_ids and not questionnaire_ids,
                people_ids=people_ids,
                questionnaire_ids=questionnaire_ids,
            ),
        )
        messages.success(self.request, _('Nachrichten wurden erstellt.'))

        return redirect(
            reverse(
                'admin:lla_push_pushnotificationconfig_change', args=[self.object.id]
            )
        )


@admin.register(PushNotificationConfig)
class PushNotificationConfigAdmin(TabbedTranslationAdmin):
    inlines = (
        PushNotificationReceiverAdminInline,
        PushNotificationTriggerAdminInline,
    )
    list_display = ('subject',)
    # actions_detail = ('send_now_action',)

    def formfield_for_dbfield(
        self, db_field: Field, request: HttpRequest, **kwargs
    ) -> Optional[Field]:
        if db_field.name.startswith('email_html_') or db_field.name == 'email_html':
            kwargs['widget'] = EasyMDEWidget
        return super().formfield_for_dbfield(db_field, request, **kwargs)

    def changeform_view(self, request, object_id=None, form_url='', extra_context=None):
        if object_id is not None:
            extra_context = extra_context or {}
            extra_context['lla_extra_object_tools'] = [
                {
                    'label': gettext('Manuell versenden'),
                    'url': reverse(
                        admin_urlname(self.opts, mark_safe('lla_push')),
                        kwargs={'object_id': object_id},
                    ),
                }
            ]
        return super().changeform_view(request, object_id, form_url, extra_context)

    def get_urls(self):
        urls = list(super().get_urls())
        urls.insert(
            len(urls) - 1,
            path(
                '<path:object_id>/lla-push/',
                PushNotificationSendNowView.as_view(model_admin=self),
                name='%s_%s_lla_push' % (self.opts.app_label, self.opts.model_name),
            ),
        )
        return urls
