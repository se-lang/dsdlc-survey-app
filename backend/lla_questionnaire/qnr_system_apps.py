import abc
import functools
from collections.abc import Sequence
from typing import Protocol, TYPE_CHECKING, Any
from uuid import UUID

from django.apps import apps
from django.core.exceptions import ImproperlyConfigured
from django.db.models import QuerySet, Q, OrderBy, F
from django.http import HttpRequest
from strawberry_django.utils.typing import WithStrawberryDjangoObjectDefinition

if TYPE_CHECKING:
    pass


class QnrTypeDefinition(Protocol):
    """
    A type of questionnaire, provided by a questionnaire system app, see
    ``QnrSystemAppConfig``.
    .
    """

    person_questionnaire_gql: WithStrawberryDjangoObjectDefinition
    """
    The GraphQL type for this questionnaire type's ``PersonQuestionnaire`` subtype.
    The GraphQL type should be an object type and it should be a subtype of the
    ``QuestionnaireGql`` interface.
    """

    def get_person_questionnaire_queryset(self, request: HttpRequest) -> QuerySet:
        """
        Get the QuerySet of all PersonQuestionnaires that should be visible to the user who issued
        the given request. This method should return a QuerySet for a concrete subtype of
        PersonQuestionnaire.
        :param request:
        :return:
        """
        ...

    def get_person_questionnaire_order(self, prefix: str) -> OrderBy:
        """
        Get the user-visible order for person questionnaires.
        :param prefix: The prefix for how to get to the PersonQuestionnaire
        :return:
        """
        return F(f'{prefix}pk').asc()

    def get_active_person_id(self, request: HttpRequest) -> UUID | None:
        """
        Get the Person ID for the person which is currently active (logged in) according to the
        given request. Return None if no person is active.
        This method might need to do database requests to find the ID.
        This method might return an ID even if that person was since deleted.
         Prefer
        ``get_active_person_filter`` if possible.
        :param request: the current request
        :return:
        """
        ...

    def filter_person_by_questionnaire(self, questionnaire_filter: dict[str, Any]) -> Q:
        """
        Create a filter for Person based on the given questionnaire filter.
        The questionnaire filter is a dict, as with the kwargs of QuerySet.filter.
        For example `{'id': 1}` would produce all Person instances, who are assigned to
        Questionnaire with ID 1. `{'id__in', [1, 2, 3]}` would produce all Person instances, who
        are assigned to Questionnaire with ID 1, 2 or 3.
        :param questionnaire_filter:
        :return:
        """
        ...

    def get_active_person_filter(
        self, request: HttpRequest, prefix: str = ''
    ) -> Q | None:
        """
        Get a Q object that filters Person QuerySets down to only the person that is active
        (logged in) according to the given request. Return None if no person is active.
        :param request: the current request
        :param prefix: a prefix to apply to any model fields in the filter
        :return:
        """
        ...


class QnrSystemAppConfig(abc.ABC):
    """
    A Django app should implement this interface to provide a questionnaire system.
    """

    @property
    @abc.abstractmethod
    def name(self) -> str: ...

    @property
    @abc.abstractmethod
    def questionnaire_types(self) -> Sequence[QnrTypeDefinition]:
        """
        All questionnaire types provided by this system. The result must not change dynamically.
        """
        ...


@functools.cache
def qnr_systems() -> Sequence[QnrSystemAppConfig]:
    """
    Get all questionnaire systems that are installed.
    """
    result = tuple(
        c for c in apps.get_app_configs() if isinstance(c, QnrSystemAppConfig)
    )
    if not result:
        raise ImproperlyConfigured('No Questionnaire system apps found')
    return result


@functools.cache
def questionnaire_types() -> Sequence[QnrTypeDefinition]:
    """
    Get all questionnaire types known to the system.
    """
    result = []
    for system in qnr_systems():
        types = system.questionnaire_types
        if len(types) == 0:
            raise ValueError(
                f'Questionnaire system app {system.name} did not provide '
                f'any questionnaire types'
            )
        result.extend(types)
    return tuple(result)


def get_active_person_id(request: HttpRequest) -> UUID | None:
    for type_ in questionnaire_types():
        id_ = type_.get_active_person_id(request)
        if id_ is not None:
            return id_
    return None


def filter_person_by_questionnaire(**questionnaire_filter: Any) -> Q:
    qs = []
    for type_ in questionnaire_types():
        qs.append(type_.filter_person_by_questionnaire(questionnaire_filter))
    return Q.create(qs, connector=Q.OR)
