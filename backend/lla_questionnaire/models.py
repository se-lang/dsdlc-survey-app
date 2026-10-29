import uuid
from collections.abc import Sequence, Callable
from datetime import timedelta
from typing import Self, Literal, Iterable, Any

from django.contrib.auth import get_user_model
from django.db import models
from django.db.models import F, QuerySet, Model, Q
from django.db.models.expressions import BaseExpression, Combinable
from django.db.models.functions import Coalesce
from django.utils import timezone
from django.utils.translation import gettext_lazy as _, pgettext_lazy
from django_stubs_ext import StrOrPromise

from lebenslaeufe_app.orm_helpers import CustomChoiceQuerySetManager
from lebenslaeufe_app.subtype_queryset import SubtypeQuerySet


def _get_most_subclass_instance[T: Model](obj: T) -> T:
    model_type = type(obj)
    for subclass in model_type.__subclasses__():
        path = subclass._meta.get_path_from_parent(model_type)
        current = obj
        for p in path:
            if not p.join_field.is_cached(current) or not hasattr(
                current, p.join_field.name
            ):
                break
            current = getattr(current, p.join_field.name)
        else:
            return current
    return obj


type QuestionnaireDataSelection = Literal['export', 'admin']


class QuestionnaireQuerySet(QuerySet):
    def select_subclass_data(self, selection: QuestionnaireDataSelection) -> Self:
        """
        Update the queryset to be used for the specific purpose, as determined by subclasses.
        Calls ``get_data_queryset`` on all subclasses.
        :param selection:
        :return:
        """
        qs = Questionnaire.get_data_queryset(self, selection)
        for subclass in Questionnaire.__subclasses__():
            qs = subclass.get_data_queryset(qs, selection)
        return qs


class QuestionnaireManager(CustomChoiceQuerySetManager):
    def get_choice_queryset(self, qs: QuestionnaireQuerySet) -> QuerySet:
        return qs.select_subclass_data('admin')


class Questionnaire(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    label = models.CharField(verbose_name=_('Name'))
    created_at = models.DateTimeField(default=timezone.now, editable=False)

    objects = QuestionnaireManager.from_queryset(QuestionnaireQuerySet)()

    @classmethod
    def get_data_queryset(
        cls, qs: QuestionnaireQuerySet, selection: QuestionnaireDataSelection
    ) -> QuestionnaireQuerySet:
        """
        Update the queryset to load all data for the given purpose.
        Note that this is a Questionnaire QuerySet, not a QuestionnaireSubclass QuerySet, so
        queries like ``qs.select_related("myquestionnairesubclass__myfield")`` must be used.
        """
        return qs

    def get_subclass_instance(self) -> 'Questionnaire':
        return _get_most_subclass_instance(self)

    def render_for_export(self) -> str:
        return str(self.id)

    @staticmethod
    def collect_from_subclasses[T](
        func: Callable[[type['Questionnaire']], Iterable[T]],
    ) -> Iterable[T]:
        yield from func(Questionnaire)
        for subclass in Questionnaire.__subclasses__():
            yield from func(subclass)

    @staticmethod
    def get_all_search_fields() -> Iterable[str]:
        return Questionnaire.collect_from_subclasses(lambda p: p.get_search_fields())

    @classmethod
    def get_search_fields(cls) -> Iterable[str]:
        return ('label',)

    def __str__(self):
        sub_instance = self.get_subclass_instance()
        if sub_instance is not self:
            return str(sub_instance)
        else:
            return self.label


type PersonDataSelection = Literal['admin', 'export', 'push_notification']


class PersonQuerySet(QuerySet):
    def select_subclass_data(self, selection: PersonDataSelection) -> Self:
        """
        Update the queryset to be used for the specific purpose, as determined by subclasses.
        Calls ``get_admin_queryset`` on all subclasses.
        :param selection:
        :return:
        """
        qs = Person.get_data_queryset(self, selection)
        for subclass in Person.__subclasses__():
            qs = subclass.get_data_queryset(qs, selection)
        return qs

    def order_for_search(self) -> Self:
        expressions = [Person.get_search_order_expression()]
        for subclass in Person.__subclasses__():
            expr = subclass.get_search_order_expression()
            if isinstance(expr, Iterable):
                expressions.extend(expr)
            else:
                expressions.append(expr)
        return self.order_by(*expressions, 'id')


class PersonManager(CustomChoiceQuerySetManager):
    def get_choice_queryset(self, qs: PersonQuerySet) -> QuerySet:
        return qs.select_subclass_data('admin')


class Person(models.Model):
    """
    A Person in the questionnaire system. This represents one human that participates in
    surveys. If the same human participates in multiple surveys, they are still only represented
    by one Person instance.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(
        get_user_model(),
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name=_('Benutzer'),
        related_name='person',
    )

    objects = PersonManager.from_queryset(PersonQuerySet)()

    @staticmethod
    def collect_from_subclasses[T](
        func: Callable[[type['Person']], Iterable[T]],
    ) -> Iterable[T]:
        yield from func(Person)
        for subclass in Person.__subclasses__():
            yield from func(subclass)

    @staticmethod
    def get_all_search_fields() -> Iterable[str]:
        return Person.collect_from_subclasses(lambda p: p.get_search_fields())

    @staticmethod
    def get_all_push_notification_context_keys() -> Iterable[tuple[str, StrOrPromise]]:
        return Person.collect_from_subclasses(
            lambda p: p.get_push_notification_context_keys()
        )

    @classmethod
    def get_search_fields(cls) -> Iterable[str]:
        return (
            'user__email',
            'user__first_name',
            'user__last_name',
        )

    @classmethod
    def get_search_order_expression(
        cls,
    ) -> BaseExpression | Combinable | Sequence[BaseExpression | Combinable]:
        return F('user__email')

    @classmethod
    def get_data_queryset(
        cls, qs: PersonQuerySet, selection: PersonDataSelection
    ) -> PersonQuerySet:
        """
        Update the queryset to load all data for the given purpose.
        Note that this is a Person QuerySet, not a PersonSubclass QuerySet, so
        queries like ``qs.select_related("mypersonsubclass__myfield")`` must be used.
        """
        return qs

    def get_subclass_instance(self) -> 'Person':
        for subclass in Person.__subclasses__():
            path = subclass._meta.get_path_from_parent(Person)
            current = self
            for p in path:
                if not p.join_field.is_cached(current) or not hasattr(
                    current, p.join_field.name
                ):
                    break
                current = getattr(current, p.join_field.name)
            else:
                return current
        return self

    def render_for_export(self) -> str:
        return str(self.id)

    def get_push_notification_context(self, context: dict[str, Any]) -> None:
        context['person_id'] = self.id

    @classmethod
    def get_push_notification_context_keys(cls) -> Iterable[tuple[str, StrOrPromise]]:
        yield 'person_id', _('Interne ID der Person')

    def __str__(self):
        sub_instance = self.get_subclass_instance()
        if sub_instance is not self:
            return str(sub_instance)
        else:
            return str(self.id)


class PersonQuestionnaire(models.Model):
    """
    A PersonQuestionnaire is a Questionnaire assigned to a Person.

    Subclasses must have a ForeignKey "questionnaire" which points to a Questionnaire subclass.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    objects = SubtypeQuerySet.as_manager()

    class Meta:
        pass


class QuestionnaireFileType(models.TextChoices):
    FILE = 'FILE', 'Studienunterlage'
    PRIVACY = 'PRIVACY', 'Datenschutz'


class QuestionnaireFile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    questionnaire = models.ForeignKey(Questionnaire, on_delete=models.CASCADE)
    title = models.CharField(verbose_name=_('Titel'))
    description = models.TextField(verbose_name=_('Kurzbeschreibung'))
    file = models.FileField(verbose_name=_('Datei'), upload_to='questionnaire_files')
    type = models.TextField(
        choices=QuestionnaireFileType.choices, default=QuestionnaireFileType.FILE
    )

    class Meta:
        verbose_name = _('Studienunterlage')
        verbose_name_plural = _('Studienunterlagen')
        constraints = (
            models.CheckConstraint(
                name='%(app_label)s_%(class)s_corrent_file_type',
                condition=Q(type__in=[str(t) for t in QuestionnaireFileType]),
            ),
        )


class QuestionnaireNews(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    questionnaire = models.ManyToManyField(
        Questionnaire,
        verbose_name=_('Umfrage'),
        blank=True,
        help_text=_('Leer: Für alle Umfragen'),
    )
    title = models.CharField(verbose_name=_('Titel'))
    description = models.TextField(verbose_name=_('Kurzbeschreibung'))
    content = models.TextField(verbose_name=_('Text'))
    start_date = models.DateField(verbose_name=_('Erscheinungsdatum'))
    end_date = models.DateField(
        verbose_name=_('Ablaufdatum'),
        null=True,
        blank=True,
        help_text=_('Leer: in 4 Wochen'),
    )
    resolved_end_date = models.GeneratedField(
        expression=Coalesce(F('end_date'), F('start_date') + timedelta(weeks=4)),
        output_field=models.DateField(),
        db_persist=True,
    )

    def __str__(self):
        return self.title

    class Meta:
        ordering = ('-end_date',)
        verbose_name = _('News')
        verbose_name_plural = pgettext_lazy('Plural', 'News')


class QuestionnaireNewsSeen(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    person = models.ForeignKey(Person, on_delete=models.CASCADE)
    questionnaire_news = models.ForeignKey(QuestionnaireNews, on_delete=models.CASCADE)
    when = models.DateTimeField(default=timezone.now)

    class Meta:
        constraints = (
            models.UniqueConstraint(
                fields=(
                    'person',
                    'questionnaire_news',
                ),
                name='%(app_label)s_%(class)s_person_news_unique',
            ),
        )
