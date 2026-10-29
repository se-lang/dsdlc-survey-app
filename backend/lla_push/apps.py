from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class LlaPushConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'lla_push'
    verbose_name = _('Push-Benachrichtigungen')
