import urllib
import uuid
from collections.abc import Callable
from urllib.parse import urljoin

from django.conf import settings
from django.contrib.auth.models import AbstractUser, UserManager, Group
from django.contrib.auth.tokens import (
    PasswordResetTokenGenerator,
    default_token_generator,
)
from django.core.exceptions import ValidationError
from django.core.mail.message import EmailMultiAlternatives
from django.db import models
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.translation import gettext_lazy as _, gettext


class CustomizedTokenGenerator(PasswordResetTokenGenerator):
    def __init__(
        self,
        key_salt: str | None = None,
        timeout_seconds: int | Callable[[], int] | None = None,
    ):
        super().__init__()
        if key_salt:
            self.key_salt = key_salt
        self.timeout_seconds = timeout_seconds

    def get_timeout_seconds(self) -> float | None:
        if callable(self.timeout_seconds):
            return self.timeout_seconds()
        else:
            return self.timeout_seconds

    def check_token(self, user, token):
        if (timeout_seconds := self.get_timeout_seconds()) is not None:
            before = settings.PASSWORD_RESET_TIMEOUT
            try:
                settings.PASSWORD_RESET_TIMEOUT = timeout_seconds
                return super().check_token(user, token)
            finally:
                settings.PASSWORD_RESET_TIMEOUT = before
        else:
            return super().check_token(user, token)


email_verification_token_generator = CustomizedTokenGenerator(
    'lla_auth.EmailVerificationTokenGenerator',
    timeout_seconds=lambda: settings.LLA_CONFIG.auth.activate_user_email_lifetime.total_seconds(),
)


class EmailChangeTokenGenerator(CustomizedTokenGenerator):
    key_salt = 'lla_auth.EmailChangeTokenGenerator'

    def get_timeout_seconds(self) -> float | None:
        return settings.LLA_CONFIG.auth.change_email_token_lifetime.total_seconds()

    def _make_hash_value(self, user: 'User', timestamp):
        # We invalidate the email if the user changes their email or password
        return f'{user.pk}{user.password}{timestamp}{user.email}'


email_change_token_generator = EmailChangeTokenGenerator()


SESSION_KEY_HAS_GUEST_SESSION = 'lla_auth_guest_session'
SESSION_KEY_GUEST_HAS_ACCOUNT = 'lla_auth_guest_has_account'


class CustomUserManager(UserManager):
    @classmethod
    def decode_uidb64(cls, uidb64: str) -> uuid.UUID | None:
        try:
            return uuid.UUID(urlsafe_base64_decode(uidb64).decode())
        except (TypeError, ValueError, OverflowError):
            return None

    def find_for_reset_token(
        self, uidb64: str, only_active: bool = True
    ) -> 'User | None':
        qs = self.all()
        if only_active:
            qs = qs.filter(is_active=True)
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            return qs.get(pk=uid)
        except (
            TypeError,
            ValueError,
            OverflowError,
            self.model.DoesNotExist,
            ValidationError,
        ):
            return None

    def check_email_confirmation_token(
        self, uidb64: str, token: str
    ) -> 'tuple[User, bool]':
        user = self.find_for_reset_token(uidb64, only_active=False)
        if user is None or not email_verification_token_generator.check_token(
            user, token
        ):
            raise ValidationError(
                code='invalid_token', message=gettext('Bitte prüfen Sie den Link.')
            )
        if user.is_active:
            return user, False
        else:
            user.is_active = True
            user.save(update_fields=('is_active',))
            return user, True


class User(AbstractUser):
    id = models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True)
    email = models.EmailField(
        _('E-Mail-Adresse'),
        blank=False,
        unique=True,
        error_messages={
            'unique': _(
                'Die von Ihnen angegebene E-Mail-Adresse ist bereits mit '
                'einem Konto verknüpft.'
            )
        },
    )
    username = None

    street = models.CharField(verbose_name=_('Straße, Nr.'), max_length=255, blank=True)
    zip_code = models.CharField(
        verbose_name=_('Postleitzahl'), max_length=15, blank=True
    )
    city = models.CharField(verbose_name=_('Ort'), max_length=255, blank=True)
    country = models.CharField(verbose_name=_('Land'), max_length=255, blank=True)
    date_of_birth = models.DateField(
        verbose_name=_('Geburtsdatum'), null=True, blank=True
    )
    phone = models.CharField(
        verbose_name=_('Telefonnummer'), max_length=255, blank=True
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    @property
    def display_name(self) -> str:
        if self.first_name and self.last_name:
            return f'{self.first_name} {self.last_name}'
        elif self.first_name:
            return self.first_name
        elif self.last_name:
            return self.last_name
        else:
            return self.email

    def send_password_reset_email(self):
        """
        Send the "forgot your password" email to this user.
        """
        token = default_token_generator.make_token(self)
        uidb64 = urlsafe_base64_encode(force_bytes(self.pk))
        link = urljoin(
            str(settings.LLA_CONFIG.network.frontend_url),
            urllib.parse.quote(f'/reset-password/{uidb64}/{token}'),
        )
        context = {
            'link': link,
        }
        text = render_to_string('lla_auth/email/forgot_password.txt', context)
        html = render_to_string('lla_auth/email/forgot_password.html', context)
        subject = render_to_string(
            'lla_auth/email/forgot_password_subject.txt', context
        ).strip()
        msg = EmailMultiAlternatives(subject, text, to=(self.email,))
        msg.attach_alternative(html, 'text/html')
        msg.send()

    def send_account_activation(self):
        """
        Send the "active your account" email to this user.
        """
        token = email_verification_token_generator.make_token(self)
        uidb64 = urlsafe_base64_encode(force_bytes(self.pk))
        link = urljoin(
            str(settings.LLA_CONFIG.network.frontend_url),
            urllib.parse.quote(f'/account-aktivieren/{uidb64}/{token}'),
        )
        context = {'link': link, 'name': self.get_full_name() or self.email}
        text = render_to_string('lla_auth/email/activate_account.txt', context)
        html = render_to_string('lla_auth/email/activate_account.html', context)
        subject = render_to_string(
            'lla_auth/email/activate_account.subject.txt', context
        ).strip()
        msg = EmailMultiAlternatives(subject, text, to=(self.email,))
        msg.attach_alternative(html, 'text/html')
        msg.send()

    def trigger_email_change(self):
        """
        Trigger a change of user's email address, by sending them a confirmation email.
        """
        uidb64 = urlsafe_base64_encode(force_bytes(self.pk))
        token = email_change_token_generator.make_token(self)
        link = urljoin(
            str(settings.LLA_CONFIG.network.frontend_url),
            urllib.parse.quote(f'/email-ändern/{uidb64}/{token}'),
        )
        context = {
            'link': link,
            'name': self.get_full_name() or self.email,
        }
        text = render_to_string('lla_auth/email/new_email.txt', context)
        html = render_to_string('lla_auth/email/new_email.html', context)
        subject = render_to_string(
            'lla_auth/email/new_email.subject.txt', context
        ).strip()
        msg = EmailMultiAlternatives(subject, text, to=(self.email,))
        msg.attach_alternative(html, 'text/html')
        msg.send()

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')
        constraints = ()


class GroupProxy(Group):
    class Meta:
        proxy = True
        verbose_name = _('group')
        verbose_name_plural = _('groups')
