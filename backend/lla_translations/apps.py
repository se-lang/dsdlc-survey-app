from django.apps import AppConfig
from django.db.models.signals import post_migrate, post_save, post_delete
from django.utils.translation import gettext_lazy as _


class LlaTranslationsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'lla_translations'
    verbose_name = _('Übersetzungen')

    def ready(self):
        from .import_json import import_lang_base_json
        from .models import Translation, clear_translation_cache

        post_migrate.connect(
            import_lang_base_json,
            sender=self,
            dispatch_uid='lla_translations.import_lang_base_json',
        )
        post_save.connect(
            clear_translation_cache,
            sender=Translation,
            dispatch_uid='lla_translations.clear_cache_on_save',
        )
        post_delete.connect(
            clear_translation_cache,
            sender=Translation,
            dispatch_uid='lla_translations.clear_cache_on_delete',
        )
