import strawberry
import strawberry_django
from django.db import transaction
from django.db.models import QuerySet
from django.http import HttpRequest
from push_notifications.models import WebPushDevice
from strawberry import Info
from strawberry.relay import Node, NodeID
from strawberry_django.auth.utils import get_current_user
from strawberry_django.permissions import IsAuthenticated
from strawberry_django.utils.requests import get_request

from lebenslaeufe_app.graphql_helpers import is_root_field
from lla_push.models import WebPushDeviceSession


@strawberry_django.type(WebPushDevice, name='WebPushDevice')
class WebPushDeviceType(Node):
    registration_id: NodeID[str]

    @classmethod
    def get_queryset(cls, qs: QuerySet, info: Info) -> QuerySet:
        if is_root_field(info):
            user = get_current_user(info)
            if not user.is_authenticated:
                qs = qs.none()
            else:
                qs = qs.filter(user=user)
        return qs


@strawberry.type
class Mutation:
    @strawberry_django.input_mutation(
        extensions=[IsAuthenticated()], handle_django_errors=False
    )
    @staticmethod
    def register_web_push(
        info: Info, p256dh: str, auth: str, endpoint: str
    ) -> WebPushDeviceType:
        request: HttpRequest = get_request(info)
        user = request.user
        if not request.session.session_key:
            request.session.create()
        with transaction.atomic():
            device, created = WebPushDevice.objects.update_or_create(
                registration_id=endpoint,
                defaults={
                    'p256dh': p256dh,
                    'auth': auth,
                    'user': user,
                },
            )
            WebPushDeviceSession.objects.update_or_create(
                session_id=request.session.session_key,
                defaults={
                    'device': device,
                },
            )

        return device

    @strawberry_django.input_mutation(handle_django_errors=False)
    @staticmethod
    def unregister_web_push(info: Info, endpoint: str | None = None) -> None:
        request: HttpRequest = get_request(info)
        if request.session.session_key:
            qs = WebPushDevice.objects.filter(
                session__session_id=request.session.session_key,
            )
            if endpoint is not None:
                qs = qs.filter(registration_id=endpoint)
            qs.delete()
