from collections.abc import Callable, Iterable

import post_office.models
from django.contrib import admin
from django.contrib.auth import login
from django.contrib.auth.forms import BaseUserCreationForm
from django.contrib.auth.models import Permission, Group
from django.contrib.auth.views import RedirectURLMixin, redirect_to_login
from django.contrib.contenttypes.models import ContentType
from django.core.cache import cache
from django.db import transaction
from django.db.models import Q
from django.db.models.base import Model
from django.http import HttpRequest, HttpResponse, HttpResponseRedirect
from django.urls import resolve, Resolver404
from django.views.generic import CreateView
from push_notifications.models import Device

from lla_auth.models import User, GroupProxy
from lla_paradata.models import ParadataEvent
from lla_push.models import PushNotificationConfig
from lla_questionnaire.models import Questionnaire, QuestionnaireNews, QuestionnaireFile
from lla_translations.models import Translation
from lla_zofar.models import (
    ZofarQuestionnaire,
    ZofarPerson,
    ZofarPersonQuestionnaire,
)

FIRST_INSTALL_URL_NAME = 'first_setup'
FIRST_INSTALL_CACHE_KEY = 'first_setup'


ADMIN_GROUP_PERMISSIONS: Iterable[tuple[Iterable[str], Iterable[type[Model]]]] = (
    (
        ('view', 'change', 'add', 'delete'),
        (
            User,
            GroupProxy,
            Device,
            PushNotificationConfig,
            ZofarQuestionnaire,
            ZofarPerson,
            ZofarPersonQuestionnaire,
            Questionnaire,
            QuestionnaireNews,
            QuestionnaireFile,
            Translation,
            post_office.models.Email,
            post_office.models.Log,
        ),
    ),
    (
        ('view',),
        (ParadataEvent,),
    ),
)


def clear_first_install_cache():
    transaction.on_commit(lambda: cache.delete(FIRST_INSTALL_CACHE_KEY))


def is_first_setup(_request: HttpRequest) -> bool:
    return cache.get_or_set(FIRST_INSTALL_CACHE_KEY, lambda: not User.objects.exists())


class LlaFirstSetupMiddleware:
    """
    This middleware shows the "first install" screen if there are no users set up yet.
    """

    def __init__(self, get_response: Callable[[HttpRequest], HttpResponse]):
        self.get_response = get_response

    def __call__(self, request: HttpRequest) -> HttpResponse:
        if is_first_setup(request):
            try:
                url_name = resolve(request.path).url_name
                if url_name != FIRST_INSTALL_URL_NAME:
                    return redirect_to_login(
                        request.build_absolute_uri(),
                        login_url=FIRST_INSTALL_URL_NAME,
                    )
            except Resolver404:
                pass
        return self.get_response(request)


class FirstSetupForm(BaseUserCreationForm):
    def save(self, commit=True):
        instance: User = super().save(commit=False)
        instance.is_superuser = True
        instance.is_active = True
        instance.is_staff = True
        if commit:
            instance.save()
            self.save_m2m()
        return instance

    class Meta:
        model = User
        fields = ('email',)


class FirstSetupView(RedirectURLMixin, CreateView):
    """
    This view shows a form to create the initial admin user if there are no users set up yet.
    """

    template_name = 'lebenslaeufe_app/first_setup/first_setup.html'
    form_class = FirstSetupForm
    next_page = 'admin:index'

    def dispatch(self, request, *args, **kwargs):
        if not is_first_setup(request):
            return HttpResponseRedirect(self.get_success_url())
        return super().dispatch(request, *args, **kwargs)

    def form_valid(self, form):
        with transaction.atomic():
            result = super().form_valid(form)
            group, group_created = Group.objects.get_or_create(
                name='Administrators',
            )
            if group_created:
                for permissions, models in ADMIN_GROUP_PERMISSIONS:
                    # First grab all the content types for this set of models
                    content_type_filters = [
                        Q(app_label=model._meta.app_label, model=model._meta.model_name)
                        for model in models
                    ]
                    content_type_filter = Q.create(content_type_filters, connector=Q.OR)
                    content_types = ContentType.objects.filter(content_type_filter)

                    # now find all the permission_ids for the permissions that should be granted
                    # for this set of models
                    permission_filters = [
                        Q(
                            content_type_id=content_type.pk,
                            codename=f'{perm}_{content_type.model}',
                        )
                        for content_type in content_types
                        for perm in permissions
                    ]
                    permission_filter = Q.create(permission_filters, connector=Q.OR)
                    permission_ids = Permission.objects.filter(
                        permission_filter
                    ).values_list('pk', flat=True)

                    # now assign the permissions to the Admin group we just created
                    Group.permissions.through.objects.bulk_create(
                        Group.permissions.through(
                            group_id=group.pk, permission_id=permission_id
                        )
                        for permission_id in permission_ids
                    )

        login(self.request, self.object)
        return result

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context.update(admin.site.each_context(self.request))
        return context
