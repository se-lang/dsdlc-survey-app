import dataclasses
import datetime
from uuid import UUID

import strawberry
import strawberry_django
from django.conf import settings
from django.contrib.auth import logout
from django.core.exceptions import ValidationError
from django.db import transaction
from strawberry_django.fields.types import OperationInfo

from lebenslaeufe_app.graphql_helpers import ConditionalFieldExtension, DjangoInfo
from lebenslaeufe_app.ratelimit import RateLimit
from lebenslaeufe_app.validation_errors import create_form_validation_error
from lla_auth.forms import LlaBaseUserCreationForm
from lla_auth.models import User
from lla_zofar.forms import ZofarUserCreationForm
from lla_zofar.models import SESSION_KEY_ZOFAR_PERSON_ID, ZofarPerson


@strawberry.input
class ZofarCreateUser:
    email: str
    password: str
    token: str
    first_name: str | None = None
    last_name: str | None = None
    street: str | None = None
    zip_code: str | None = None
    city: str | None = None
    country: str | None = None
    date_of_birth: datetime.date | None = None
    phone: str | None = None


@strawberry.type
class RegisterUserMutations:
    @strawberry_django.mutation(
        handle_django_errors=True,
        extensions=[
            RateLimit('10/m'),
            ConditionalFieldExtension(
                lambda: settings.LLA_CONFIG.auth.registration_enabled
            ),
        ],
    )
    @staticmethod
    def zofar_register(info: DjangoInfo, data: ZofarCreateUser) -> OperationInfo | None:
        values = dataclasses.asdict(data)
        values['password1'] = data.password
        values['password2'] = data.password
        del values['password']
        with transaction.atomic():
            person_id = info.context.request.session.get(SESSION_KEY_ZOFAR_PERSON_ID)
            if person_id:
                try:
                    person_id = UUID(person_id)
                except ValueError:
                    person_id = None
                    logout(info.context.request)
            else:
                person_id = None
                logout(info.context.request)

            form = (LlaBaseUserCreationForm if person_id else ZofarUserCreationForm)(
                data=values
            )
            if form.errors:
                errors = form.errors.copy()
                if 'password1' in errors:
                    del errors['password1']
                if 'password2' in errors:
                    errors['password'] = errors['password2']
                    del errors['password2']
                raise create_form_validation_error(errors)
            user: User = form.save()
            if person_id:
                updated_rows = ZofarPerson.objects.filter(
                    id=person_id, user__isnull=True
                ).update(user=user)
                if updated_rows != 1:
                    raise ValidationError(
                        message='Could not associate with that person.'
                    )
            transaction.on_commit(user.send_account_activation)
            transaction.on_commit(lambda: logout(info.context.request))
        return None
