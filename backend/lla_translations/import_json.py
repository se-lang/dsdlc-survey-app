import importlib.resources
import logging

from django.conf import settings
from django.db import transaction
from django.db.models import Q
from pydantic import TypeAdapter

from lla_translations.models import Translation

logger = logging.getLogger(__name__)

type TranslationDict = dict[str, str | TranslationDict]


translation_dict_adapter = TypeAdapter(TranslationDict)


def _build_translations(
    lang: str,
    translations: dict[str, Translation],
    d: TranslationDict,
    prefix: str = '',
):
    for key, value in d.items():
        if isinstance(value, dict):
            _build_translations(lang, translations, value, prefix + key + '.')
        else:
            full_key = prefix + key
            t = translations.get(full_key)
            if t is None:
                t = translations[full_key] = Translation(key=full_key)
            setattr(t, f'value_{lang}', value)


@transaction.atomic
def import_lang_base_json(*args, **kwargs):
    """
    This synchronizes the database with the frontend's i18n JSON files.
    """
    translations = dict[str, Translation]()
    for lang, _ in settings.LANGUAGES:
        logger.info('Importing language base json for %s', lang)
        with importlib.resources.open_text(
            'lla_translations', f'base_json/{lang}.json'
        ) as f:
            json_t = translation_dict_adapter.validate_json(f.read())
            _build_translations(lang, translations, json_t)

    # Delete any translations which are no longer present in the JSON file
    Translation.objects.filter(~Q(key__in=translations.keys())).delete()

    # Find any keys which were edited by the user, don't overwrite these
    edited_keys = set(
        Translation.objects.filter(edited=True).values_list('key', flat=True)
    )
    to_update = (t for key, t in translations.items() if key not in edited_keys)
    # Insert any keys which don't exist yet and update any keys which were not edited by the user.
    Translation.objects.bulk_create(
        to_update,
        update_conflicts=True,
        update_fields=('value_de', 'value_en'),
        unique_fields=('key',),
    )
    Translation.objects.clear_cache()
