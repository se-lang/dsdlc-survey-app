import csv
from pathlib import Path

from django.conf import settings
from django.core.management import BaseCommand


class Command(BaseCommand):
    help = 'Create dummy questionnaire assignment CSV'

    def add_arguments(self, parser):
        parser.add_argument('--count', type=int, default=500_000)

    def handle(self, *args, **options):
        with open(
            Path(settings.BASE_DIR) / 'questionnaire_assignments.csv', 'w', newline=''
        ) as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow(['person', 'questionnaire', 'token'])
            for i in range(0, options['count']):
                writer.writerow([f'person_{i}', 'test', f'token_{i}'])
