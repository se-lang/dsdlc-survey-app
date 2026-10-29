from django.core.management import BaseCommand

from lla_translations.import_json import import_lang_base_json


class Command(BaseCommand):
    def handle(self, *args, **options):
        import_lang_base_json()
