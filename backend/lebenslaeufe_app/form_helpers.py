from django.core.exceptions import ValidationError
from django.forms.models import (
    InlineForeignKeyField,
    construct_instance,
    BaseModelForm,
    ModelFormMetaclass,
)


# Backport of https://github.com/django/django/commit/0ebea6e5c07485a36862e9b6e2be18d1694ad2c5
# to fix https://code.djangoproject.com/ticket/35676
class FixedConstraintsBaseModelForm(BaseModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._validate_constraints = False

    def clean(self):
        self._validate_constraints = True
        return super().clean()

    def validate_constraints(self):
        """
        Call the instance's validate_constraints() method and update the form's
        validation errors if any were raised.
        """
        exclude = self._get_validation_exclusions()
        try:
            self.instance.validate_constraints(exclude=exclude)
        except ValidationError as e:
            self._update_errors(e)

    def _post_clean(self):
        opts = self._meta

        exclude = self._get_validation_exclusions()

        # Foreign Keys being used to represent inline relationships
        # are excluded from basic field value validation. This is for two
        # reasons: firstly, the value may not be supplied (#12507; the
        # case of providing new values to the admin); secondly the
        # object being referred to may not yet fully exist (#12749).
        # However, these fields *must* be included in uniqueness checks,
        # so this can't be part of _get_validation_exclusions().
        for name, field in self.fields.items():
            if isinstance(field, InlineForeignKeyField):
                exclude.add(name)

        try:
            self.instance = construct_instance(
                self, self.instance, opts.fields, opts.exclude
            )
        except ValidationError as e:
            self._update_errors(e)

        try:
            self.instance.full_clean(
                exclude=exclude, validate_unique=False, validate_constraints=False
            )
        except ValidationError as e:
            self._update_errors(e)

        # Validate uniqueness if needed.
        if self._validate_unique:
            self.validate_unique()

        if self._validate_constraints:
            self.validate_constraints()


class FixedConstraintsModelForm(
    FixedConstraintsBaseModelForm, metaclass=ModelFormMetaclass
):
    pass
