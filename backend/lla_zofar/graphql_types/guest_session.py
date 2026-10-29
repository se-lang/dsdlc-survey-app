import strawberry
import strawberry_django
from django.contrib.auth import logout
from django.contrib.auth.models import AnonymousUser
from django.core.exceptions import ValidationError
from django.utils.translation import gettext

from lebenslaeufe_app.graphql_helpers import DjangoInfo
from lebenslaeufe_app.ratelimit import RateLimit
from lla_auth.graphql import AnonymousUserType
from lla_auth.models import SESSION_KEY_HAS_GUEST_SESSION, SESSION_KEY_GUEST_HAS_ACCOUNT
from lla_paradata.models import paradata_event
from lla_paradata.registry import PARADATA_EVENT_LOGIN, LoginType
from lla_zofar.models import ZofarPersonQuestionnaire, SESSION_KEY_ZOFAR_PERSON_ID


@strawberry.input
class ZfGuestSessionInput:
    token: str


@strawberry.type
class GuestSessionMutations:
    @strawberry_django.mutation(
        extensions=[RateLimit('10/m')],
    )
    @staticmethod
    def activate_zofar_guest_session(
        info: DjangoInfo, data: ZfGuestSessionInput
    ) -> AnonymousUserType:
        logout(info.context.request)

        pq = (
            ZofarPersonQuestionnaire.objects.filter(token=data.token)
            .only('person_id', 'person__user_id')
            .first()
        )
        if pq is None:
            raise ValidationError({'token': gettext('Bitte prüfen Sie Ihr Token.')})
        info.context.request.session[SESSION_KEY_HAS_GUEST_SESSION] = True
        info.context.request.session[SESSION_KEY_GUEST_HAS_ACCOUNT] = (
            pq.person.user_id is not None
        )
        info.context.request.session[SESSION_KEY_ZOFAR_PERSON_ID] = str(pq.person_id)
        paradata_event(
            person_id=pq.person_id,
            key=PARADATA_EVENT_LOGIN,
            value=LoginType.GUEST,
        )
        return AnonymousUser()
