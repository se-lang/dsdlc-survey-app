from functools import cached_property
from typing import Sequence

from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _

from lla_questionnaire.qnr_system_apps import QnrSystemAppConfig, QnrTypeDefinition
from lla_zofar.api_schema import init_zofar_api_schema


class LlaZofarConfig(QnrSystemAppConfig, AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'lla_zofar'
    verbose_name = _('Zofar Integration')

    @cached_property
    def questionnaire_types(self) -> Sequence[QnrTypeDefinition]:
        from .qnr_type_definition import ZofarQuestionnaireType

        return (ZofarQuestionnaireType(),)

    def ready(self):
        init_zofar_api_schema()
