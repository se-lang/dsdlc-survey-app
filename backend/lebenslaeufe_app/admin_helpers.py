from django.contrib.admin import RelatedFieldListFilter, RelatedOnlyFieldListFilter

from lebenslaeufe_app.orm_helpers import use_choice_queryset


class CustomChoiceQuerySetRelatedFieldListFilterMixin:
    """
    To be applied to a RelatedFieldListFilter for the admin and will make
    that admin filter use ``use_choice_queryset``.
    """

    def field_choices(self, field, request, model_admin):
        with use_choice_queryset():
            return super().field_choices(field, request, model_admin)


class CustomChoiceQuerySetRelatedFieldListFilter(
    CustomChoiceQuerySetRelatedFieldListFilterMixin, RelatedFieldListFilter
): ...


class CustomChoiceQuerySetRelatedOnlyFieldListFilter(
    CustomChoiceQuerySetRelatedFieldListFilterMixin, RelatedOnlyFieldListFilter
): ...


class CustomChoiceQuerySetAdminMixin:
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        with use_choice_queryset():
            return super().formfield_for_foreignkey(db_field, request, **kwargs)

    def formfield_for_manytomany(self, db_field, request, **kwargs):
        with use_choice_queryset():
            return super().formfield_for_manytomany(db_field, request, **kwargs)
