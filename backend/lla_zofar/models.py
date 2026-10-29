import dataclasses
import datetime
import json
import logging
import urllib.parse
from collections.abc import Iterable, Sequence
from urllib.parse import urljoin
import uuid
from contextlib import contextmanager, AbstractContextManager
from functools import cached_property
from json import JSONDecodeError
from typing import overload, Protocol, Any
from uuid import uuid4, UUID

import requests
from django.conf import settings
from django.contrib.postgres.constraints import ExclusionConstraint
from django.contrib.postgres.fields import HStoreField, RangeOperators
from django.core.exceptions import (
    ValidationError as DjangoValidationError,
    ObjectDoesNotExist,
)
from django.db import models, transaction, IntegrityError, connections, router
from django.db.models import Q, Exists, OuterRef, QuerySet, F
from django.db.models.expressions import BaseExpression, Combinable
from django.dispatch import Signal
from django.forms.models import model_to_dict
from django.http import HttpRequest
from django.utils.translation import gettext_lazy as _, get_language, pgettext_lazy
from django_pydantic_field.v2 import SchemaField
from django_stubs_ext import StrOrPromise
from pydantic import ValidationError as PydanticValidationError, TypeAdapter
from requests import Session, RequestException, PreparedRequest, Response, HTTPError
from requests.utils import dict_from_cookiejar

from lla_questionnaire.models import (
    Questionnaire,
    PersonQuestionnaire,
    Person,
    PersonQuerySet,
    PersonDataSelection,
    QuestionnaireQuerySet,
    QuestionnaireDataSelection,
)
from lla_zofar.api_schema.autofill import AutofillReference, AutofillData
from lla_zofar.api_schema.context import ZofarValidationContext
from lla_zofar.api_schema.episodes import (
    ZfEpisodes,
    ZfEpisodeValue,
    zf_episode_value_list_type_adapter,
    ZfEpisodeValueFlag,
    ZfEpisodeValueState,
    GAP_EPISODE_TYPE_ID,
)
from lla_zofar.api_schema.month_values import serialize_month_date
from lla_zofar.api_schema.questions_multiple_choice import (
    ZfEpisodesLoopCheckData,
    ZfMultipleChoiceQuestion,
)
from lla_zofar.api_schema.questions_open import ZfOpenQuestion
from lla_zofar.api_schema.response import ZfApiResponse
from lla_zofar.api_schema.status import ZfTokenStatusResponse
from lla_zofar.exceptions import ZofarApiException, NoZofarPageState
from lla_zofar.questionnaire_state import (
    QuestionnaireState,
    get_zofar_questionnaire_state,
)
from lla_zofar.zofar_form_field_ref import ZofarFormFieldRefType
from lla_zofar.zofar_urls import (
    zofar_url,
    ZOFAR_LOGIN_PATH,
    is_zofar_login_url,
    zofar_url_path,
)

logger = logging.getLogger(__name__)


class ZofarQuestionnaire(Questionnaire):
    external_id = models.CharField(verbose_name=_('Externe ID'), blank=True)
    zofar_url = models.URLField(verbose_name=_('Zofar URL'))
    zofar_fingerprint = models.CharField(verbose_name=_('Zofar Fingerprint'))
    order_index = models.IntegerField(default=0, verbose_name=_('Reihenfolge'))

    @classmethod
    def get_data_queryset(
        cls, qs: QuestionnaireQuerySet, selection: QuestionnaireDataSelection
    ) -> PersonQuerySet:
        match selection:
            case 'export':
                return qs.select_related('zofarquestionnaire')
            case 'admin':
                return qs.select_related('zofarquestionnaire')
            case _:
                return qs

    def render_for_export(self) -> str:
        return self.external_id

    @classmethod
    def get_search_fields(cls) -> Iterable[str]:
        return ('zofarquestionnaire__external_id',)

    def __str__(self):
        return f'{self.label} ({self.external_id})' if self.external_id else self.label

    class Meta:
        ordering = ('order_index',)
        verbose_name = _('Umfrage')
        verbose_name_plural = _('Umfragen')
        constraints = (
            models.UniqueConstraint(
                fields=('external_id',),
                condition=~Q(external_id=''),
                name='%(app_label)s_%(class)s_external_id_unique',
            ),
        )


class ZofarPersonManager(models.Manager):
    @transaction.atomic
    def bulk_upsert_external_ids(self, external_ids: Iterable[str]) -> dict[str, UUID]:
        """
        Get or create a list of ZofarPerson given some external IDs.
        :param external_ids:
        :return:
        """
        missing_ids = set(external_ids)
        existing = self.extra(
            where=['external_id = ANY(%s)'], params=[list(missing_ids)]
        ).values_list('id', 'external_id')
        result: dict[str, UUID] = {external_id: id_ for id_, external_id in existing}
        missing_ids.difference_update(result)
        if missing_ids:
            # we have some items that were not present
            # first we need to create the parents
            for external_id in missing_ids:
                result[external_id] = uuid4()
            sql = 'INSERT INTO lla_questionnaire_person (id, user_id) VALUES (%s, NULL)'
            param_list = [(result[external_id],) for external_id in missing_ids]
            db = router.db_for_read(Person)
            with connections[db].cursor() as cursor:
                cursor.executemany(sql, param_list)

            # now create the children
            db = router.db_for_write(self.model)
            sql = 'INSERT INTO lla_zofar_zofarperson (person_ptr_id, external_id, has_seen_tour) VALUES (%s, %s, FALSE)'
            param_list = [
                (result[external_id], external_id) for external_id in missing_ids
            ]
            with connections[db].cursor() as cursor:
                cursor.executemany(sql, param_list)

        return result

    @classmethod
    def get_filter(cls, request: HttpRequest, prefix: str = '') -> Q | None:
        """
        Get a Q object that filters ZofarPerson QuerySets down to only that person which
        is accessible to the current request. Optionally can be prefixed, to filter a different
        QuerySet, which can use a relation to get to the ZofarPerson.
        """
        user = request.user
        if user.is_authenticated:
            return Q((f'{prefix}user_id', user.pk))
        else:
            zofar_person_id = request.session.get(SESSION_KEY_ZOFAR_PERSON_ID)
            if zofar_person_id is None:
                return None
            else:
                return Q((f'{prefix}id', zofar_person_id))


class ZofarPerson(Person):
    external_id = models.CharField(
        max_length=512, unique=True, verbose_name=_('Externe ID')
    )
    has_seen_tour = models.BooleanField(default=False, verbose_name=_('Tour gesehen'))

    objects = ZofarPersonManager()

    @classmethod
    def get_search_fields(cls) -> Iterable[str]:
        return ('zofarperson__external_id',)

    @classmethod
    def get_search_order_expression(
        cls,
    ) -> BaseExpression | Combinable | Sequence[BaseExpression | Combinable]:
        return F('zofarperson__external_id')

    @classmethod
    def get_data_queryset(
        cls, qs: PersonQuerySet, selection: PersonDataSelection
    ) -> PersonQuerySet:
        match selection:
            case 'admin':
                return qs.select_related('zofarperson', 'user')
            case 'export':
                return qs.select_related('zofarperson')
            case 'push_notification':
                return qs.select_related('zofarperson', 'user')
            case _:
                return qs

    def render_for_export(self) -> str:
        return self.external_id

    @classmethod
    def get_push_notification_context_keys(cls) -> Iterable[tuple[str, StrOrPromise]]:
        yield from super().get_push_notification_context_keys()
        yield 'person_zofar_id', _('Zofar ID der Person')
        yield 'person_user', _('Der Person zugeordneter Benutzer')

    def get_push_notification_context(self, context: dict[str, Any]) -> None:
        super().get_push_notification_context(context)
        context['person_zofar_id'] = self.external_id
        context['person_user'] = self.user

    def __str__(self):
        if self.user_id:
            if Person.user.is_cached(self):
                user_display = self.user
            else:
                user_display = self.user_id
            suffix = f' ({user_display})'
        else:
            suffix = ''
        return f'{self.external_id}{suffix}'

    class Meta:
        verbose_name = _('Person')
        verbose_name_plural = _('Personen')


class ZofarPersonQuestionnaireManager(models.Manager):
    def make_bulk_lookup(
        self, ids: Iterable[tuple[UUID, UUID]]
    ) -> dict[tuple[UUID, UUID], UUID]:
        """
        Create a lookup dict for looking up (person_id, questionnaire_id)->ID where ID is the ID
        of the corresponding ZofarPersonQuestionnaire.
        :param ids:
        :return:
        """

        person_ids: list[UUID] = []
        questionnaire_ids: list[UUID] = []
        for person_id, questionnaire_id in ids:
            person_ids.append(person_id)
            questionnaire_ids.append(questionnaire_id)

        sql = """
              SELECT personquestionnaire_ptr_id, person_id, questionnaire_id
              FROM lla_zofar_zofarpersonquestionnaire
              WHERE (person_id, questionnaire_id) = ANY
                    (SELECT * from unnest(%s, %s) AS x(person_id, questionnaire_id)) \
              """
        params = [person_ids, questionnaire_ids]
        with connections[self.db].cursor() as cursor:
            cursor.execute(sql, params)
            return {
                (person_id, questionnaire_id): id_
                for id_, person_id, questionnaire_id in cursor.fetchall()
            }

    @transaction.atomic
    def bulk_upsert(self, objs: Iterable['ZofarPersonQuestionnaire']) -> None:
        obj_new: list['ZofarPersonQuestionnaire'] = []
        ids_upd: list[UUID] = []
        token_upd: list[str] = []
        for obj in objs:
            if obj._state.adding:
                obj_new.append(obj)
            else:
                ids_upd.append(obj.pk)
                token_upd.append(obj.token)

        db = router.db_for_write(self.model)

        if obj_new:
            # insert parents first
            sql = """
                  INSERT INTO lla_questionnaire_personquestionnaire (id)
                  VALUES (%s);
                  """
            new_pks = [(uuid4(),) for _ in obj_new]
            with connections[db].cursor() as cursor:
                cursor.executemany(sql, new_pks)

            sql = """
                  INSERT INTO lla_zofar_zofarpersonquestionnaire (personquestionnaire_ptr_id, token, person_id, questionnaire_id)
                  VALUES (%s, %s, %s, %s);
            """
            param_list = [
                (new_pk, obj.token, obj.person_id, obj.questionnaire_id)
                for obj, (new_pk,) in zip(obj_new, new_pks)
            ]
            with connections[db].cursor() as cursor:
                cursor.executemany(sql, param_list)

        if ids_upd:
            sql = """
                UPDATE lla_zofar_zofarpersonquestionnaire AS zpq SET
                    token = upd.token
                FROM unnest(%s, %s) as upd(id, token)
                where upd.id = zpq.personquestionnaire_ptr_id;
            """
            params = [ids_upd, token_upd]
            with connections[db].cursor() as cursor:
                cursor.execute(sql, params)

    @classmethod
    def get_filter(cls, request: HttpRequest) -> Q | None:
        """
        Get a Q object that filters ZofarPersonQuestionnaire QuerySets down to only those which are
        accessible by the current request (either authenticated user or from the session when using
        guest access). Returns None if no objects must be accessible.
        """
        return ZofarPerson.objects.get_filter(request=request, prefix='person__')


class ZofarPersonQuestionnaireQuerySet(models.QuerySet):
    def for_request(self, request: HttpRequest):
        filter_ = ZofarPersonQuestionnaireManager.get_filter(request)
        if filter_ is None:
            return self.none()
        else:
            qs = self.filter(filter_)
            if settings.LLA_CONFIG.zofar.hide_completed_questionnaires:
                qs = qs.exclude(
                    status__completion_state=ZofarQuestionnaireCompletionState.FINISHED
                )
            return qs


class ZofarPersonQuestionnaire(PersonQuestionnaire):
    person = models.ForeignKey(
        ZofarPerson,
        on_delete=models.CASCADE,
        verbose_name=_('Person'),
        related_name='questionnaires',
    )
    questionnaire = models.ForeignKey(
        ZofarQuestionnaire,
        on_delete=models.CASCADE,
        verbose_name=_('Umfrage'),
        related_name='people',
    )
    token = models.CharField(_('Zofar Token'), max_length=255)

    objects = ZofarPersonQuestionnaireManager.from_queryset(
        ZofarPersonQuestionnaireQuerySet
    )()

    @cached_property
    def _questionnaire_status(self) -> QuestionnaireState:
        return get_zofar_questionnaire_state(self)

    def get_questionnaire_status(self) -> QuestionnaireState:
        return self._questionnaire_status

    def __str__(self):
        if ZofarPersonQuestionnaire.person.is_cached(self):
            person = self.person
        else:
            person = self.person_id
        if ZofarPersonQuestionnaire.questionnaire.is_cached(self):
            questionnaire = self.questionnaire
        else:
            questionnaire = self.questionnaire_id
        return f'{person} in {questionnaire}'

    class Meta:
        verbose_name = _('Umfragenzuordnung')
        verbose_name_plural = _('Umfragenzuordnungen')
        constraints = (
            models.UniqueConstraint(
                fields=('person', 'questionnaire'),
                name='%(app_label)s_%(class)s_person_questionnaire_unique',
                violation_error_message=_(
                    'Diese Person ist dieser Umfrage bereits zugewiesen.'
                ),
            ),
            models.UniqueConstraint(
                fields=(
                    'questionnaire',
                    'token',
                ),
                name='%(app_label)s_%(class)s_token_unique_per_questionnaire',
                violation_error_message=_(
                    'Dieses Token ist für diese Umfrage bereits vergeben.'
                ),
            ),
            # This constraint validates the following:
            # 1. person_id_a == person_id_b => OK
            # 2. person_id_a != person_id_b && token_a != token_b => OK
            # 3. person_id_a != person_id_b && token_a == token_b => FAIL
            #
            # Exclusion Constraint passes, if not all comparisons return true
            # or in other words, it passes if any of them return false.
            # 1. If person_id_a == person_id_b then person_id_a != person_id_b is false
            #    and the constraint passes
            # Otherwise:
            # 2. If token_a != token_b then token_a == token_b is false
            #    and the constraint passes
            # 3. If token_a == token_b then token_a == token_b is true
            #    and the constraint fails
            ExclusionConstraint(
                expressions=(
                    (F('person'), RangeOperators.NOT_EQUAL),
                    (F('token'), RangeOperators.EQUAL),
                ),
                name='%(app_label)s_%(class)s_same_token_implies_same_person',
                violation_error_message=_(
                    'Dieses Token wird bereits für eine andere Person verwendet.'
                ),
            ),
        )


questionnaire_status_bulk_change = Signal()


class ZofarPersonQuestionnaireStatusManager(models.Manager):
    @classmethod
    def load_state(cls, pq: 'ZofarPersonQuestionnaire') -> dict[str, Any]:
        try:
            response = requests.get(
                urljoin(pq.questionnaire.zofar_url, 'special/status.html'),
                params={
                    'zofar_token': pq.token,
                    'zofar_fingerprint': pq.questionnaire.zofar_fingerprint,
                },
            )
            response.raise_for_status()
        except RequestException:
            logger.exception(
                'Failed to fetch ZofarPersonQuestionnaire %s status',
                pq.id,
            )
            return {}

        try:
            parsed_response = ZfTokenStatusResponse.model_validate_json(response.text)
        except PydanticValidationError as e:
            logger.error(
                'Failed to fetch ZofarPersonQuestionnaire %s status',
                pq.id,
                e,
            )
            return {}
        logger.info('Zofar status response %s', response.text)
        data = parsed_response.content_structure.response
        return {
            'completion_state': ZofarQuestionnaireCompletionState(data.state.value),
            'first_visit': data.first_visit,
            'last_visit': data.last_visit,
            'blocked': data.blocked,
        }

    def bulk_status_update(
        self, ids: list[UUID], *, request: HttpRequest | None = None
    ) -> list['ZofarPersonQuestionnaireStatus']:
        pqs = ZofarPersonQuestionnaire.objects.all().select_related('questionnaire')
        if request is not None:
            pqs = pqs.for_request(request)
        pqs = pqs.filter(pk__in=ids)

        instances: list[ZofarPersonQuestionnaireStatus] = []
        started_questionnaire_ids: list[UUID] = []
        update_fields = set[str]()
        for pq in pqs:
            state = self.load_state(pq)
            update_fields.update(state.keys())
            status = ZofarPersonQuestionnaireStatus(
                person_questionnaire_id=pq.pk, **state
            )
            instances.append(status)
            if status.completion_state == ZofarQuestionnaireCompletionState.STARTED:
                started_questionnaire_ids.append(pq.questionnaire_id)

        questionnaire_status_bulk_change.send(
            ZofarPersonQuestionnaireStatus,
            started_questionnaire_ids=started_questionnaire_ids,
        )

        return self.bulk_create(
            instances,
            update_conflicts=True,
            unique_fields=('person_questionnaire_id',),
            update_fields=update_fields,
        )


class ZofarQuestionnaireCompletionState(models.TextChoices):
    NEW = 'NEW', _('Neu')
    STARTED = 'STARTED', _('Begonnen')
    FINISHED = 'FINISHED', _('Abgeschlossen')


class ZofarPersonQuestionnaireStatus(models.Model):
    person_questionnaire = models.OneToOneField(
        ZofarPersonQuestionnaire,
        primary_key=True,
        on_delete=models.CASCADE,
        related_name='status',
    )
    completion_state = models.CharField(
        choices=ZofarQuestionnaireCompletionState,
        verbose_name=_('Zustand'),
        default=ZofarQuestionnaireCompletionState.NEW,
    )
    first_visit = models.DateTimeField(
        verbose_name=_('Zuerst besucht'), null=True, blank=True
    )
    last_visit = models.DateTimeField(
        verbose_name=_('Zuletzt besucht'), null=True, blank=True
    )
    blocked = models.BooleanField(default=False)

    objects = ZofarPersonQuestionnaireStatusManager()

    class Meta:
        verbose_name = _('Status')
        verbose_name_plural = pgettext_lazy('Plural', 'Status')


SESSION_KEY_ZOFAR_PERSON_ID = 'zofar_person_id'
"""
The session key for the ZofarPerson ID when guest session is active
"""


class ZofarStateManager(models.Manager):
    @overload
    def activate(
        self,
        *,
        request: HttpRequest | None = None,
        person_questionnaire: ZofarPersonQuestionnaire,
    ) -> 'AbstractContextManager[ActiveZofarState]':
        """
        A context manager for using the Zofar state. The ZofarState is locked while
        ActiveZofarState is being used.
        The ZofarState is selected based on the PersonQuestionnaire. If request is
        also provided, the PersonQuestionnaire must belong to the active person in the request.
        :param request: the current request
        :param person_questionnaire: the PersonQuestionnaire to be used
        :return:
        """
        ...

    @overload
    def activate(
        self, *, request: HttpRequest | None = None, person_questionnaire_id: UUID
    ) -> 'AbstractContextManager[ActiveZofarState]':
        """
        A context manager for using the Zofar state. The ZofarState is locked while
        ActiveZofarState is being used.
        The ZofarState is selected based on the PersonQuestionnaire ID. If request is
        also provided, the PersonQuestionnaire must belong to the active person in the request.
        :param request: the current request
        :param person_questionnaire_id: the ID for the PersonQuestionnaire to be used
        :return:
        """
        ...

    @overload
    def activate(
        self, *, request: HttpRequest, questionnaire_id: UUID
    ) -> 'AbstractContextManager[ActiveZofarState]':
        """
        A context manager for using the Zofar state. The ZofarState is locked while
        ActiveZofarState is being used.
        The ZofarState is selected based on the active person in the request and the
        Questionnaire ID.
        :param request: the current request
        :param questionnaire_id: the ID for the Questionnaire to be used
        """
        ...

    @contextmanager
    def activate(
        self,
        *,
        questionnaire_id: UUID | None = None,
        person_questionnaire: ZofarPersonQuestionnaire | None = None,
        person_questionnaire_id: uuid.UUID | None = None,
        request: HttpRequest | None = None,
    ) -> 'Iterable[ActiveZofarState]':
        if request is not None:
            person_questionnaires = ZofarPersonQuestionnaire.objects.for_request(
                request
            )
            if questionnaire_id is not None:
                person_questionnaires = person_questionnaires.filter(
                    questionnaire_id=questionnaire_id
                )
            elif person_questionnaire_id is not None:
                person_questionnaires = person_questionnaires.filter(
                    pk=person_questionnaire_id
                )
            elif person_questionnaire is not None:
                person_questionnaires = person_questionnaires.filter(
                    pk=person_questionnaire.pk
                )
            state_filter = Exists(
                person_questionnaires.filter(id=OuterRef('person_questionnaire_id'))
            )

            def get_person_questionnaire_id() -> UUID:
                return person_questionnaires.values_list('id', flat=True).get()

        elif person_questionnaire is not None:
            state_filter = Q(person_questionnaire=person_questionnaire)

            def get_person_questionnaire_id():
                return person_questionnaire.id
        elif person_questionnaire_id is not None:
            state_filter = Q(person_questionnaire_id=person_questionnaire_id)

            def get_person_questionnaire_id():
                return person_questionnaire_id
        else:
            raise AssertionError()

        qs = ActiveZofarState.prepare_queryset(self.all())
        # We only lock on the Zofar State row, because the episode state might not exist
        # And you cannot lock using an outer join
        # Technically this is incorrect, because someone could create an episode state
        # while we have the state locked, but our code never does that.
        qs = qs.select_for_update(of=('self',))
        with transaction.atomic():
            try:
                with transaction.atomic():
                    state = qs.get(state_filter)
            except self.model.DoesNotExist:
                person_questionnaire_id = get_person_questionnaire_id()
                try:
                    with transaction.atomic():
                        logger.debug('Creating zofar state because it does not exist')
                        self.create(person_questionnaire_id=person_questionnaire_id)
                except IntegrityError:
                    logger.debug('Creating zofar state failed', exc_info=True)
                    pass
                logger.debug('Loading zofar state second try')
                state = qs.get(person_questionnaire_id=person_questionnaire_id)
                logger.debug('Loaded zofar state second try')

            with state.session() as session:
                logger.debug(
                    'Zofar session start: %s', state.person_questionnaire.token
                )
                yield ActiveZofarState(state, session)
                state.update_from_session(session)
            state.save()
            if hasattr(state, 'episode_state'):
                state.episode_state.save()
            logger.debug('Zofar session end: %s', state.person_questionnaire.token)


class ZfSaveEpisodeData(Protocol):
    existing_id: str | None
    version: int
    name: str
    type: str
    start: datetime.date | None
    end: datetime.date | None
    event: bool
    badge: str | None


class ZfRemoveEpisodeData(Protocol):
    version: int
    id: str


class ZfHideEpisodeGapData(Protocol):
    version: int
    id: str


class ZofarState(models.Model):
    """
    ZofarState stores the current data for a Zofar-based questionnaire being used by a person.
    """

    person_questionnaire = models.OneToOneField(
        ZofarPersonQuestionnaire, primary_key=True, on_delete=models.CASCADE
    )

    headers = HStoreField(blank=True, default=dict)
    """
    Any headers (except Cookie) that Zofar told us to sent.
    """

    cookies = HStoreField(blank=True, default=dict)
    """
    The serialized cookie jar for the Zofar session.
    """

    constant_form_values = HStoreField(blank=True, default=dict)
    """
    Any form values which are constant and must be sent with any request.
    """

    last_url = models.CharField(blank=True, editable=True)
    """
    The current URL.
    """

    app_account_id_question_id = models.CharField(blank=True, max_length=255)
    """
    The ID of the question which we have identified as the "app account id" field.
    This field is hidden from the user and instead filled automatically.
    """

    version = models.SmallIntegerField(default=0, editable=True)
    """
    The version, this is used to detect if the user did something non-linear, like opening the
    app in multiple tabs and trying to use the same questionnaire in both tabs.
    On every request it is incremented and the frontend keeps track of the version it wants
    to submit against.
    """

    objects = ZofarStateManager()

    def __str__(self):
        return str(self.person_questionnaire)

    def session(self) -> Session:
        """
        Create a ``requests.Session`` to make requests for this ZofarState.
        The session will be configured to set necessary default headers and query parameters.
        The session will have the necessary cookies set in it.
        :return:
        """
        session = Session()
        session.headers.update(
            {
                'user-agent': 'lebenslaeufe-app/0.0.1',
                'accept': 'application/json',
            }
        )
        session.headers.update(self.headers)
        session.cookies.update(self.cookies)

        current_lang = get_language()
        if current_lang:
            session.params['zofar_lang'] = current_lang

        return session

    def require_episode_state(self) -> 'ZofarEpisodeState':
        """
        Get the associated ``ZofarEpisodeState``, throwing if it does not exist.
        :return:
        """
        try:
            state = self.episode_state
            return state
        except ObjectDoesNotExist:
            logger.warning('Episode state does not exist when required')
            raise DjangoValidationError(
                'This operation requires an episode state for the current page'
            )

    def update_version(self):
        self.version = (self.version + 1) % 32768

    def update_from_session(self, session: Session):
        """
        Update the state from the given requests Session, after making a request.
        """
        self.cookies = dict_from_cookiejar(session.cookies)

    def update_from_response(self, response: ZfApiResponse):
        """
        Update the state from the given Zofar response. This also increments the current version.
        """
        self.update_version()
        self.last_url = response.post_data.target
        self.headers = {
            # cookies are stored separately, so that requests.Session handles them properly
            # As such, don't include the Cookie header here.
            k: v
            for k, v in response.post_data.headers.items()
            if k.lower() != 'cookie'
        }
        self.constant_form_values = {
            key: value
            for key, value in response.post_data.body.items()
            if isinstance(value, str)
        }

        if hasattr(self, 'episode_state'):
            episode_state = self.episode_state
            had_episode_state = True
        else:
            episode_state = ZofarEpisodeState()
            had_episode_state = False

        has_episode_state = False
        found_loop_check = False
        found_episode_details_id = False
        for content_item in response.content_structure.children:
            loop_check: ZfEpisodesLoopCheckData
            match content_item:
                case ZfEpisodes():
                    has_episode_state = True
                    episode_state.calendar_id = content_item.id
                    episode_state.type_colors = {
                        episode_type.id: episode_type.color
                        for episode_type in content_item.config.type.values
                    }
                    episode_state.values = content_item.value
                    episode_state.min_date = content_item.min_date
                    episode_state.max_date = content_item.max_date
                case ZfMultipleChoiceQuestion(
                    episodes_loop_check=ZfEpisodesLoopCheckData() as loop_check
                ):
                    found_loop_check = True
                    episode_state.loop_check_id = loop_check.id
                    episode_state.loop_check_value = loop_check.value
                case ZfOpenQuestion(
                    episode_details_option_id=str() as episode_details_option_id
                ):
                    found_episode_details_id = True
                    episode_state.episode_details_option_id = episode_details_option_id
                case ZfOpenQuestion(
                    app_account_id_question_id=str() as app_account_id_question_id
                ):
                    self.app_account_id_question_id = app_account_id_question_id

        if has_episode_state and (not found_loop_check or not found_episode_details_id):
            raise ZofarApiException(
                'Zofar page has episode calendar without loop check or episode details option'
            )
        if has_episode_state:
            self.episode_state = episode_state
        elif had_episode_state:
            episode_state.delete()
            self.episode_state = None

        form_field_references = list(
            response.content_structure.form_field_references_recursive()
        )
        ZofarFormFieldRef.objects.bulk_create(
            objs=(
                ZofarFormFieldRef(**dataclasses.asdict(ffr), state_id=self.pk)
                for ffr in form_field_references
            ),
            update_conflicts=True,
            update_fields=('type', 'multiple_choice_value'),
            unique_fields=('state_id', 'element_id'),
        )
        # PKs returned from bulk_create are not reliable, because Django only requests
        # PK-returns for auto fields
        # Therefor we filter by element ID instead
        ZofarFormFieldRef.objects.filter(
            state_id=self.pk,
        ).exclude(
            element_id__in=(ffr.element_id for ffr in form_field_references)
        ).delete()

    class Meta:
        constraints = ()


class ZofarFormFieldRef(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    state = models.ForeignKey(
        ZofarState, on_delete=models.CASCADE, related_name='form_fields'
    )
    element_id = models.CharField()
    type = models.CharField(choices=ZofarFormFieldRefType.choices)
    multiple_choice_value = models.CharField(blank=True)

    class Meta:
        constraints = (
            models.UniqueConstraint(
                fields=(
                    'state',
                    'element_id',
                ),
                name='%(app_label)s_%(class)s_element_id_unique_per_state',
            ),
            models.CheckConstraint(
                condition=Q(type=ZofarFormFieldRefType.MULTIPLE_CHOICE)
                ^ Q(multiple_choice_value=''),
                name='%(app_label)s_%(class)s_multiple_choice_value_set_for_multiple_choice',
            ),
        )


class ZofarEpisodeState(models.Model):
    state = models.OneToOneField(
        ZofarState,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='episode_state',
    )
    calendar_id = models.CharField(max_length=255)
    loop_check_id = models.CharField(max_length=255)
    loop_check_value = models.CharField(max_length=255)
    episode_details_option_id = models.CharField(max_length=255)
    type_colors = HStoreField()
    values = SchemaField(schema=list[ZfEpisodeValue], default=list)
    min_date = models.DateField()
    max_date = models.DateField()


class ZofarAutofillListQuerySet(models.QuerySet):
    def get_from_reference(
        self, reference: AutofillReference
    ) -> 'ZofarAutofillList | None':
        qs = self.filter(
            external_id=reference.list_id,
            language=reference.language,
            version=reference.version,
        )
        try:
            return qs.get()
        except ObjectDoesNotExist:
            pass

        logger.info(
            'Loading autofill list %s, language=%s, version=%s',
            reference.list_id,
            reference.language,
            reference.version,
        )

        try:
            response = requests.get(reference.url)
            response.raise_for_status()
            parsed = AutofillData.model_validate_json(response.text)
        except (RequestException, PydanticValidationError) as e:
            logger.error('Failed to load autofill data from URL %s', reference.url, e)
            return None
        else:
            with transaction.atomic():
                obj, created = self.get_or_create(
                    external_id=reference.list_id,
                    language=reference.language,
                    version=reference.version,
                )
                if created:
                    ZofarAutofillListItem.objects.bulk_create(
                        objs=(
                            ZofarAutofillListItem(
                                list=obj,
                                value=item.value,
                                label=item.label,
                                index=index,
                            )
                            for index, item in enumerate(parsed.options)
                        )
                    )

        return qs.get()


class ZofarAutofillList(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    external_id = models.CharField()
    language = models.CharField(max_length=10)
    version = models.CharField()

    objects = ZofarAutofillListQuerySet.as_manager()

    class Meta:
        constraints = (
            models.UniqueConstraint(
                fields=('external_id', 'language', 'version'),
                name='%(app_label)s_%(class)s_external_id_unique_per_language',
            ),
        )


class ZofarAutofillListItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    list = models.ForeignKey(
        ZofarAutofillList, on_delete=models.CASCADE, related_name='items'
    )
    index = models.PositiveBigIntegerField(db_index=True)
    label = models.CharField(unique=True)
    value = models.CharField()

    class Meta:
        ordering = ('index',)


DATE_TYPE_ADAPTER = TypeAdapter(datetime.date)


class ActiveZofarState:
    """
    ActiveZofarState represents active communication with Zofar. Obtained via
    ``ZofarState.objects.activate``, which must be used as a context mananger.
    The ZofarState is locked while it is in use.
    """

    TIMEOUT = 5

    __slots__ = ('state', 'session')

    @classmethod
    def prepare_queryset(
        cls, qs: QuerySet[ZofarState, ZofarState]
    ) -> QuerySet[ZofarState, ZofarState]:
        """
        The QuerySet that should be used to load the ZofarState before using it with
        ActiveZofarState.
        """
        return qs.select_related(
            'episode_state',
            'person_questionnaire',
            'person_questionnaire__questionnaire',
            'person_questionnaire__person',
        ).prefetch_related('form_fields')

    def __init__(self, state: ZofarState, session: Session):
        super().__init__()
        self.state = state
        self.session = session

    @property
    def base_url(self):
        return self.state.person_questionnaire.questionnaire.zofar_url

    def _parse_response(self, response: Response) -> ZfApiResponse:
        try:
            parsed_response = ZfApiResponse.model_validate_json(
                response.text,
                context=ZofarValidationContext(zofar_state=self),
            )
        except PydanticValidationError:
            if settings.DEBUG:
                with open(settings.BASE_DIR / 'zofar_api_parsed.json', 'w') as f:
                    f.write('===INVALID===')
            raise
        else:
            if settings.DEBUG:
                with open(settings.BASE_DIR / 'zofar_api_parsed.json', 'w') as f:
                    f.write(parsed_response.model_dump_json(indent=2))
        return parsed_response

    def _do_login(self) -> PreparedRequest:
        """
        Attempt to log in, return PreparedRequest of where Zofar wants us to go next
        """
        response = self.session.get(
            zofar_url(self.base_url, ZOFAR_LOGIN_PATH),
            params=(('zofar_token', self.state.person_questionnaire.token),),
            allow_redirects=False,
            timeout=self.TIMEOUT,
        )
        response.raise_for_status()
        if not response.is_redirect:
            raise ZofarApiException('Login failed: Redirect expected')
        try:
            zofar_path = zofar_url_path(self.base_url, response.next.url)
        except ValueError:
            raise ZofarApiException('Login failed: Redirect to URL outside Zofar')
        if zofar_path == ZOFAR_LOGIN_PATH:
            raise ZofarApiException('Login failed: Redirected back to login')
        return response.next

    @classmethod
    def _write_debug_data(cls, response: Response) -> None:
        if settings.DEBUG:
            with open(settings.BASE_DIR / 'zofar_api.json', 'w') as f:
                try:
                    f.write(json.dumps(json.loads(response.text), indent=2))
                except JSONDecodeError:
                    f.write(response.text)

    def get_current_page(self) -> ZfApiResponse:
        """
        Load the current page from Zofar, logging in if necessary.
        """
        if not self.state.last_url:
            logger.debug('No URL in Zofar state, logging in.')
            target = self._do_login().url
            logger.debug('Initial login for Zofar got target URL %s', target)
            fresh_session = True
        else:
            target = self.state.last_url
            fresh_session = False
            logger.debug('Last Zofar URL is %s', target)

        try:
            done = False
            response = None
            next_request = None
            while not done:
                logger.debug('Zofar request: %s', target)
                if next_request is not None:
                    response = self.session.send(
                        next_request,
                        allow_redirects=False,
                        timeout=self.TIMEOUT,
                    )
                else:
                    response = self.session.get(
                        target,
                        allow_redirects=False,
                        timeout=self.TIMEOUT,
                    )
                response.raise_for_status()
                if response.is_redirect:
                    if is_zofar_login_url(self.base_url, response.next.url):
                        logger.debug(
                            'Zofar request got redirect to login url: %s',
                            response.next.url,
                        )
                        if fresh_session:
                            raise ZofarApiException(
                                'Got redirect to login url even though session is fresh'
                            )
                        else:
                            target = self._do_login().url
                            next_request = None
                            fresh_session = True
                            logger.debug('Target URL after login: %s', target)
                    else:
                        logger.debug(
                            'Zofar get_current_page redirect: %s', response.next.url
                        )
                        next_request = response.next
                else:
                    done = True

            assert response
            self._write_debug_data(response)
            parsed_response = self._parse_response(response)
            self.state.update_from_response(parsed_response)
            return parsed_response
        except HTTPError as e:
            raise ZofarApiException('Server error') from e
        except RequestException as e:
            raise ZofarApiException('Connection error') from e
        except PydanticValidationError as e:
            raise ZofarApiException('Validation error') from e

    def submit(
        self,
        data: dict[str, Any] | None = None,
        *,
        zofar_format_data: dict[str, Any] | None = None,
        include_next_button: bool = True,
        expected_version: int | None = None,
    ) -> ZfApiResponse:
        """
        Submit the Zofar form.
        data is form data as returned by GraphQL form, it will be transformed into Zofar format
        according to known form controls (e.g. transform booleans from multiple choice)

        zofar_format_data is passed along as-is.
        """
        if expected_version is not None and self.state.version != expected_version:
            raise DjangoValidationError('Unexpected version')
        form_data = dict(self.state.constant_form_values)
        if zofar_format_data is not None:
            form_data.update(zofar_format_data)

        if data is not None:
            if hasattr(self.state, 'episode_state'):
                loop_check_id = self.state.episode_state.loop_check_id
            else:
                loop_check_id = None
            for form_control_id, value in data.items():
                if form_control_id == loop_check_id:
                    # Do not allow the frontend to set the loop check
                    continue
                if value in (None, ''):
                    # Do not include empty values in the submission as Zofar cannot handle them
                    continue

                # find the FormFieldRef for this value, if any
                form_ref = next(
                    iter(
                        ff
                        for ff in self.state.form_fields.all()
                        if ff.element_id == form_control_id
                    ),
                    None,
                )
                logger.debug(
                    'Control %s has form ref %s',
                    form_control_id,
                    model_to_dict(form_ref) if form_ref else None,
                )
                if form_ref is not None:
                    match form_ref.type:
                        case ZofarFormFieldRefType.MULTIPLE_CHOICE:
                            if value is True:
                                value = form_ref.multiple_choice_value
                            else:
                                continue
                        case ZofarFormFieldRefType.OPEN_MONTH_YEAR:
                            try:
                                parsed = DATE_TYPE_ADAPTER.validate_python(value)
                            except PydanticValidationError:
                                continue
                            else:
                                value = serialize_month_date(parsed)
                form_data[form_control_id] = value

        if include_next_button:
            form_data['form:btPanel:forward:forwardBt'] = 'Weiter'

        if self.state.app_account_id_question_id:
            # Add the user account ID if it was requested
            form_data[self.state.app_account_id_question_id] = (
                str(self.state.person_questionnaire.person.user_id)
                if self.state.person_questionnaire.person.user_id is not None
                else ''
            )

        if not self.state.last_url:
            raise NoZofarPageState()

        logger.debug(
            'Zofar POST request: %s\n%s',
            self.state.last_url,
            json.dumps(form_data, indent=2),
        )
        try:
            done = False
            response = None
            while not done:
                response = self.session.post(
                    self.state.last_url,
                    data=form_data,
                    allow_redirects=False,
                    timeout=self.TIMEOUT,
                )
                response.raise_for_status()
                if response.is_redirect:
                    if is_zofar_login_url(self.base_url, response.next.url):
                        logger.debug('Session expired in Zofar form submit.')
                        new_target = self._do_login().url
                        if new_target != self.state.last_url:
                            logger.warning(
                                'Session was expired when submitting Zofar form, '
                                'after login Zofar URL has changed. '
                                'Form submit is lost.'
                            )
                            self.state.last_url = new_target
                            return self.get_current_page()
                    else:
                        logger.debug('Got non-login redirect on Zofar submit')
                        response = self.session.send(
                            response.next,
                            allow_redirects=True,
                            timeout=self.TIMEOUT,
                        )
                        logger.debug(
                            'Redirect history: %s',
                            [r.url for r in response.history] + [response.url],
                        )
                        response.raise_for_status()
                        done = True
                else:
                    done = True

            assert response
            self._write_debug_data(response)
            parsed_response = self._parse_response(response)
            self.state.update_from_response(parsed_response)
            return parsed_response
        except RequestException as e:
            if e.response is not None:
                self._write_debug_data(e.response)
            raise ZofarApiException('Connection error') from e
        except PydanticValidationError as e:
            logger.warning('Got invalid Response from Zofar', e)
            raise

    def set_episodes(
        self, episodes: list[ZfEpisodeValue], expected_version: int
    ) -> ZfApiResponse:
        """
        Set the list of episodes.
        """
        episode_state = self.state.require_episode_state()
        encoded_episodes = urllib.parse.quote(
            zf_episode_value_list_type_adapter.dump_json(episodes)
        )
        zofar_data = {
            episode_state.loop_check_id: episode_state.loop_check_value,
            episode_state.calendar_id: encoded_episodes,
        }
        return self.submit(
            zofar_format_data=zofar_data,
            expected_version=expected_version,
        )

    def save_episode(self, data: ZfSaveEpisodeData) -> tuple[ZfApiResponse, str]:
        """
        Save an episode (update or create), return next page and ID of the episode
        """
        episode_state = self.state.require_episode_state()
        if data.existing_id:
            existing_episode = next(
                (e for e in episode_state.values if e.id == data.existing_id), None
            )
        else:
            existing_episode = None

        flags: set[ZfEpisodeValueFlag]
        state: ZfEpisodeValueState
        if existing_episode:
            new_id = existing_episode.id
            flags = set(existing_episode.flags)
            state = existing_episode.state
        else:
            new_id = str(uuid4())
            flags = set()
            state = ZfEpisodeValueState.new

        event: bool
        if data.event:
            start = data.start
            end = episode_state.max_date
            event = True
            flags.discard(ZfEpisodeValueFlag.start_hangover)
            flags.discard(ZfEpisodeValueFlag.end_hangover)
        else:
            event = False
            if data.start is not None:
                start = data.start
                flags.discard(ZfEpisodeValueFlag.start_hangover)
            else:
                start = episode_state.min_date
                flags.add(ZfEpisodeValueFlag.start_hangover)

            if data.end is not None:
                end = data.end
                flags.discard(ZfEpisodeValueFlag.end_hangover)
            else:
                end = episode_state.max_date
                flags.add(ZfEpisodeValueFlag.end_hangover)

        new_episode = ZfEpisodeValue(
            id=new_id,
            type=data.type,
            typeColor=episode_state.type_colors.get(data.type, '#000'),
            name=data.name,
            startDate=start,
            endDate=end,
            state=state,
            flags=flags,
            event=event,
            badge=data.badge,
        )
        logger.debug('Adding new episode %s', new_episode)
        episodes = [
            episode
            for episode in episode_state.values
            if not existing_episode or episode.id != existing_episode.id
        ]
        episodes.append(new_episode)
        return self.set_episodes(episodes, expected_version=data.version), new_id

    def remove_episode(self, data: ZfRemoveEpisodeData) -> ZfApiResponse:
        """
        Remove a Zofar episode.
        """
        episode_state = self.state.require_episode_state()
        logger.debug('Removing episode %s', data.id)

        episodes = [e for e in episode_state.values if e.id != data.id]
        return self.set_episodes(episodes, expected_version=data.version)

    def hide_gap(self, data: ZfHideEpisodeGapData) -> ZfApiResponse:
        """
        Mark a Zofar gap "episode" as hidden.
        """
        episode_state = self.state.require_episode_state()
        logger.debug('Hiding episode gap %s', data.id)

        episodes = [
            e
            if e.id != data.id or not e.type == GAP_EPISODE_TYPE_ID
            else e.model_copy(update={'hidden': True})
            for e in episode_state.values
        ]
        return self.set_episodes(episodes, expected_version=data.version)

    def navigate_episode_details(
        self, episode_id: str, *, expected_version: int | None = None
    ) -> ZfApiResponse:
        """
        Navigate to the detail questions of a Zofar episode.
        """
        episode_state = self.state.require_episode_state()
        return self.submit(
            zofar_format_data={episode_state.episode_details_option_id: episode_id},
            expected_version=expected_version,
        )

    def navigate_back(self, *, expected_version: int | None = None) -> ZfApiResponse:
        return self.submit(
            zofar_format_data={'form:btPanel:backward:backwardBt': 'Zurück'},
            expected_version=expected_version,
            include_next_button=False,
        )
