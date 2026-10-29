import functools

from django.contrib.admin import AdminSite
from django.contrib.admin.apps import AdminConfig
from django.utils.translation import gettext_lazy


class CustomAdminAppConfig(AdminConfig):
    default_site = 'lebenslaeufe_app.admin_config.CustomAdminSite'


class CustomAdminSite(AdminSite):
    """
    This custom admin site makes sure apps and models have the desired order in the admin sitebar
    and any undesired models are hidden.
    """

    index_title = gettext_lazy('Administration')
    # this creates a dict from app/model label to their order index
    _app_order = dict(
        map(
            reversed,
            enumerate(
                (
                    'lla_auth',
                    'lla_auth.User',
                    'lla_auth.GroupProxy',
                    'lla_push',
                    'lla_questionnaire',
                    'lla_paradata',
                    'lla_zofar',
                    'lla_zofar.ZofarQuestionnaire',
                    'lla_zofar.ZofarPerson',
                )
            ),
        )
    )

    _hidden_models = frozenset(
        (
            # This model has an admin only to facilitate autocomplete fields
            'lla_questionnaire.Questionnaire',
        )
    )

    @classmethod
    def _app_sort_key(cls, app: dict):
        return cls._app_order.get(app['app_label'], len(cls._app_order)), app['name']

    @classmethod
    def _model_sort_key(cls, app: dict, model: dict):
        qualname = f'{app["app_label"]}.{model["object_name"]}'
        return cls._app_order.get(qualname, len(cls._app_order)), app['name']

    @classmethod
    def _model_filter(cls, app: dict, model: dict):
        qualname = f'{app["app_label"]}.{model["object_name"]}'
        return qualname not in cls._hidden_models

    def get_app_list(self, request, app_label=None):
        app_list = super().get_app_list(request, app_label)
        app_list.sort(key=self._app_sort_key)
        for app in app_list:
            app['models'] = list(
                filter(
                    functools.partial(self._model_filter, app),
                    app['models'],
                )
            )
            app['models'].sort(key=functools.partial(self._model_sort_key, app))
        return app_list
