import dataclasses
import datetime
from typing import Iterable, cast, Any
from uuid import UUID

import strawberry
import strawberry_django.mutations.resolvers
from django.conf import settings
from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from django.contrib.auth.forms import SetPasswordForm
from django.contrib.auth.models import AnonymousUser
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import default_token_generator
from django.core.exceptions import ValidationError
from django.db import transaction
from django.db.models import QuerySet
from django.utils.translation import gettext
from django.utils.translation import gettext_lazy as _
from strawberry import Info
from strawberry.relay import Node, NodeID, GlobalID
from strawberry_django.fields.types import OperationInfo
from strawberry_django.permissions import IsAuthenticated

import lla_auth.tasks
from lebenslaeufe_app.graphql_helpers import DjangoInfo, ConditionalFieldExtension
from lebenslaeufe_app.ratelimit import RateLimit
from lla_paradata.models import paradata_event
from lla_paradata.registry import (
    PARADATA_EVENT_LOGIN,
    LoginType,
    PARADATA_EVENT_HAS_ACCOUNT,
    UserDataChange,
    PARADATA_EVENT_CHANGE_USER_DATA,
)
from lla_questionnaire.qnr_system_apps import get_active_person_id
from .models import (
    User,
    SESSION_KEY_HAS_GUEST_SESSION,
    email_change_token_generator,
    SESSION_KEY_GUEST_HAS_ACCOUNT,
)


@strawberry.interface
class BaseUser(Node):
    is_authenticated: bool


@strawberry_django.type(User, name='User')
class UserType(BaseUser):
    id: NodeID[UUID]
    email: str
    first_name: str
    last_name: str
    street: str
    zip_code: str
    city: str
    country: str
    date_of_birth: datetime.date | None
    phone: str

    @classmethod
    def get_queryset(cls, qs: QuerySet, info: Info) -> QuerySet:
        if info.path.typename == 'Query':
            if info.context.request.user.is_authenticated:
                qs = qs.filter(pk=info.context.request.user.pk)
            else:
                qs = qs.none()
        return qs


@strawberry.type(name='AnonymousUser')
class AnonymousUserType(BaseUser):
    _anonymous_id = GlobalID('AnonymousUser', '0')

    @strawberry.field()
    @staticmethod
    def has_guest_session(info: DjangoInfo) -> bool:
        return bool(info.context.request.session.get(SESSION_KEY_HAS_GUEST_SESSION))

    @strawberry.field()
    @staticmethod
    def guest_has_account(info: DjangoInfo) -> bool:
        return bool(info.context.request.session.get(SESSION_KEY_GUEST_HAS_ACCOUNT))

    @classmethod
    def resolve_id(cls, *args, **kwargs) -> str:
        return cls._anonymous_id.node_id

    @classmethod
    def resolve_nodes(
        cls, *, info: Info, node_ids: Iterable[str], required: bool = False
    ):
        result = []
        for node_id in node_ids:
            if node_id != cls._anonymous_id.node_id:
                if not required:
                    result.append(None)
                else:
                    raise ValueError('Unknown ID')
            else:
                result.append(AnonymousUser())
        return result

    @staticmethod
    def is_type_of(obj, _):
        return isinstance(obj, (AnonymousUserType, AnonymousUser))


@strawberry.type
class Query:
    @strawberry_django.field()
    @staticmethod
    def user(info: Info) -> BaseUser:
        return info.context.request.user


@strawberry_django.partial(User)
class UpdateUser:
    password: str | None = strawberry.UNSET
    first_name: str | None = strawberry.UNSET
    last_name: str | None = strawberry.UNSET
    street: str | None = strawberry.UNSET
    zip_code: str | None = strawberry.UNSET
    city: str | None = strawberry.UNSET
    country: str | None = strawberry.UNSET
    date_of_birth: datetime.date | None = strawberry.UNSET
    phone: str | None = strawberry.UNSET


@strawberry.type
class ConfirmEmailSuccessResult:
    activated: bool


@strawberry.input(one_of=True)
class ResendAccountActivationInput:
    email: str | None = strawberry.UNSET
    token_uid: str | None = strawberry.UNSET


@strawberry.type
class Mutation:
    @strawberry_django.mutation(
        extensions=[
            RateLimit('10/m'),
            ConditionalFieldExtension(lambda: settings.LLA_CONFIG.auth.login_enabled),
        ],
    )
    @staticmethod
    def login(info: DjangoInfo, username: str, password: str) -> UserType:
        if not (
            user := authenticate(
                info.context.request, username=username, password=password
            )
        ):
            raise ValidationError(
                code='invalid_credentials',
                message=_('E-Mail Adresse oder Passwort sind ungültig.'),
            )
        assert isinstance(user, User)

        if not user.is_active:
            raise ValidationError(
                code='not_active', message=_('Ihr Account wurde noch nicht aktiviert.')
            )

        login(info.context.request, user)

        paradata_event(
            person_id=get_active_person_id(info.context.request),
            key=PARADATA_EVENT_LOGIN,
            value=LoginType.LOGIN,
        )

        return cast(UserType, user)

    @strawberry_django.mutation(handle_django_errors=False)
    @staticmethod
    def logout(info: Info) -> AnonymousUserType:
        logout(info.context.request)
        return cast(AnonymousUserType, AnonymousUser())

    @strawberry_django.mutation(
        handle_django_errors=False,
        extensions=[
            RateLimit('10/m'),
        ],
    )
    @staticmethod
    def resend_account_activation(data: ResendAccountActivationInput) -> None:
        lookups: dict[str, Any] = {}
        if data.email:
            lookups['email'] = data.email
        elif data.token_uid:
            lookups['uidb64'] = data.token_uid
        else:
            raise AssertionError()
        # Always trigger the task, this prevents time-based attacks to sniff if the email exists
        lla_auth.tasks.trigger_resend_account_activation.apply_async(kwargs=lookups)
        return None

    @strawberry_django.mutation(
        handle_django_errors=False,
        extensions=[
            RateLimit('10/m'),
        ],
    )
    @staticmethod
    def forgot_password(email: str) -> None:
        # Always trigger the task, this prevents time-based attacks to sniff if the email exists
        lla_auth.tasks.trigger_forgot_password.delay(email)
        return None

    @strawberry_django.input_mutation(
        extensions=[
            RateLimit('10/m'),
        ]
    )
    @staticmethod
    def reset_password(uid: str, token: str, new_password: str) -> OperationInfo | None:
        with transaction.atomic():
            user = User.objects.find_for_reset_token(uid)
            if user is None or not default_token_generator.check_token(user, token):
                raise ValidationError(
                    {
                        'token': ValidationError(
                            code='invalid',
                            message=gettext('Bitte prüfen Sie den Link.'),
                        )
                    }
                )
            data = {'new_password1': new_password, 'new_password2': new_password}
            form = SetPasswordForm(user=user, data=data)
            if form.errors:
                errors = form.errors.copy()
                if 'new_password1' in errors:
                    del errors['new_password1']
                if 'new_password2' in errors:
                    errors['new_password'] = errors['new_password2']
                    del errors['new_password2']
                raise ValidationError(errors)
            form.save()
        return None

    @strawberry_django.mutation(
        extensions=[
            RateLimit('10/m'),
        ]
    )
    @staticmethod
    def confirm_email(
        uid: str, token: str
    ) -> OperationInfo | ConfirmEmailSuccessResult:
        user, activated = User.objects.check_email_confirmation_token(uid, token)
        if activated:
            paradata_event(
                person_id=getattr(user, 'person', None),
                key=PARADATA_EVENT_HAS_ACCOUNT,
                value=True,
            )
        return ConfirmEmailSuccessResult(activated=activated)

    @strawberry_django.mutation(extensions=[IsAuthenticated(), RateLimit('10/m')])
    @staticmethod
    def trigger_user_email_change(info: Info) -> OperationInfo | None:
        info.context.request.user.trigger_email_change()
        return None

    @strawberry_django.mutation(extensions=[IsAuthenticated()])
    @staticmethod
    def update_user(info: DjangoInfo, data: UpdateUser) -> UserType:
        raw_data = dataclasses.asdict(data)
        raw_password: str | None = raw_data.pop('password', None)

        user = info.context.request.user
        if raw_password:
            try:
                validate_password(raw_password, user)
            except ValidationError as e:
                raise ValidationError({'password': e})

        with transaction.atomic():

            def pre_save(_):
                if raw_password:
                    user.set_password(raw_password)
                    transaction.on_commit(
                        lambda: update_session_auth_hash(info.context.request, user)
                    )

            strawberry_django.mutations.resolvers.update(
                info, user, raw_data, pre_save_hook=pre_save
            )

        return cast(UserType, user)

    @strawberry_django.mutation(extensions=[RateLimit('10/m')])
    @staticmethod
    def update_user_email(
        info: DjangoInfo, uid: str, token: str, new_email: str
    ) -> OperationInfo | None:
        with transaction.atomic():
            user = User.objects.find_for_reset_token(uid)
            if user is None or not email_change_token_generator.check_token(
                user, token
            ):
                raise ValidationError(
                    {
                        'token': ValidationError(
                            code='invalid',
                            message=gettext('Bitte prüfen Sie den Link.'),
                        )
                    }
                )
            user.email = User.objects.normalize_email(new_email)
            user.full_clean()
            user.save()

            transaction.on_commit(
                lambda: paradata_event(
                    person_id=getattr(user, 'person', None),
                    key=PARADATA_EVENT_CHANGE_USER_DATA,
                    value=UserDataChange(email=True),
                )
            )
        logout(info.context.request)
        return None


EXTRA_TYPES = (
    UserType,
    AnonymousUserType,
)
