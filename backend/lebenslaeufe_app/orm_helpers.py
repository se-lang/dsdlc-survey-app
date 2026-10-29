from abc import abstractmethod, ABC
from contextlib import contextmanager, AbstractContextManager
from contextvars import ContextVar
from typing import overload

from django.db.models import Manager, QuerySet

IS_CHOICE_QUERYSET: ContextVar[bool] = ContextVar('IS_CHOICE_QUERYSET', default=False)


@overload
def use_choice_queryset() -> AbstractContextManager: ...


@contextmanager
def use_choice_queryset():
    """
    While this context manager is active, ``CustomChoiceQuerySetManagerMixin`` will
    return its choice queryset.
    :return:
    """
    t = IS_CHOICE_QUERYSET.set(True)
    try:
        yield None
    finally:
        IS_CHOICE_QUERYSET.reset(t)


class CustomChoiceQuerySetManagerMixin(ABC):
    """
    A manager for a model which provides a custom QuerySet when used for choices (e.g. in an Admin
    filter).
    """

    def get_queryset(self):
        qs = super().get_queryset()
        if IS_CHOICE_QUERYSET.get():
            qs = self.get_choice_queryset(qs)
        return qs

    @abstractmethod
    def get_choice_queryset(self, qs: QuerySet) -> QuerySet: ...


class CustomChoiceQuerySetManager(CustomChoiceQuerySetManagerMixin, Manager, ABC):
    pass
