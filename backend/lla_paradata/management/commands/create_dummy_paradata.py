from uuid import UUID

from django.core.management.base import BaseCommand
from django.utils import timezone
from faker import Faker
from tqdm import tqdm

from lla_paradata.models import ParadataEvent
from lla_paradata.registry import PARADATA_REGISTRY
from lla_questionnaire.models import Person, Questionnaire


class Command(BaseCommand):
    help = 'Generate dummy paradata'

    def add_arguments(self, parser):
        parser.add_argument('--person_id', type=UUID)
        parser.add_argument('--amount', type=int, default=1000)
        parser.add_argument('--batch_size', type=int, default=1000)

    def handle(self, *args, **options):
        person_id = options['person_id']
        if person_id:

            def get_person_id(_):
                return person_id
        else:
            person_ids = Person.objects.values_list('id', flat=True)

            def get_person_id(fake_: Faker):
                return fake_.random_element(person_ids)

        questionnaire_ids = [
            *Questionnaire.objects.values_list('id', flat=True),
            None,
        ]

        def get_questionnaire_id(fake_: Faker):
            return fake_.random_element(questionnaire_ids)

        left = options['amount']
        batch_size = options['batch_size']
        fake = Faker()
        data_types = list(PARADATA_REGISTRY.get_registrations())
        with tqdm(total=left) as pbar:
            while left:
                this_batch = min(left, batch_size)
                batch_items = []
                for i in range(this_batch):
                    data_type = fake.random_element(data_types)
                    data_value = data_type.fake_value(fake)
                    timestamp = fake.date_time_this_decade(
                        tzinfo=timezone.get_current_timezone()
                    )
                    batch_items.append(
                        ParadataEvent(
                            person_id=get_person_id(fake),
                            timestamp=timestamp,
                            key=data_type.key,
                            value=data_type.value_to_db(data_value),
                            active_questionnaire_id=get_questionnaire_id(fake),
                        )
                    )
                ParadataEvent.objects.bulk_create(batch_items)
                left -= this_batch
                pbar.update(this_batch)

        self.stdout.write(
            self.style.SUCCESS(f'Successfully created {options["amount"]} items')
        )
