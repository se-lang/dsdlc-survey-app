import json

from django.conf import settings
from django.core.cache import cache
from django.db import models
from django.utils.text import compress_string
from django.utils.translation import gettext_lazy as _


CACHE_KEY_JSON = 'translations_'
CACHE_KEY_GZIP = 'translations_gzip_'
CACHE_VERSION = 4


def clear_translation_cache(*_args, **_kwargs):
    Translation.objects.clear_cache()


class TranslationManager(models.Manager):
    def get_all(self, lang: str) -> list[tuple[str, str]]:
        return list(self.all().values_list('key', f'value_{lang}'))

    def get_all_json(self, lang: str) -> str:
        """
        Get all translations, encoded as JSON.
        """
        return json.dumps(self.get_all(lang), separators=(',', ':'))

    def get_all_json_cached(self, lang: str) -> str:
        """
        Get all translations, encoded as JSON, using the Django cache.
        """
        return cache.get_or_set(
            CACHE_KEY_JSON + lang,
            lambda: self.get_all_json(lang),
            version=CACHE_VERSION,
        )

    def get_all_gzipped(self, lang: str) -> bytes:
        """
        Get all translations, encoded as JSON and compressed using gzip.
        """
        content = self.get_all_json_cached(lang)
        return compress_string(
            content.encode('utf-8'),
            max_random_bytes=100,
        )

    def get_all_gzipped_cached(self, lang: str) -> bytes:
        """
        Get all translations, encoded as JSON and compressed using gzip, using the Django cache.
        """
        return cache.get_or_set(
            CACHE_KEY_GZIP + lang,
            lambda: self.get_all_gzipped(lang),
            version=CACHE_VERSION,
        )

    @classmethod
    def clear_cache(cls, lang: str | None = None):
        """
        Clear the translation cache.
        :param lang: The language to clear or None to clear all languages.
        """
        langs = ((lang, ''),) if lang else settings.LANGUAGES
        for lang, _name in langs:
            cache.delete(CACHE_KEY_JSON + lang, version=CACHE_VERSION)
            cache.delete(CACHE_KEY_GZIP + lang, version=CACHE_VERSION)


class Translation(models.Model):
    """
    Represents the frontend translations so they can be edited in the Django Admin.
    ``import_lang_base_json`` is used to synchronize the database with the JSON files generated
    by the frontend tooling.
    """

    key = models.CharField(verbose_name=_('Schlüssel'), primary_key=True)
    value = models.TextField(verbose_name=_('Text'))
    edited = models.BooleanField(default=False, editable=False)

    objects = TranslationManager()

    def __str__(self):
        return self.key

    class Meta:
        ordering = ('key',)
        verbose_name = _('Übersetzung')
        verbose_name_plural = _('Übersetzungen')
