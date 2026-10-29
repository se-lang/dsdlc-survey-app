import pytimeparse2
from dateutil.relativedelta import relativedelta
from django import forms
from django.core.exceptions import ValidationError
from django.utils.translation import gettext


class ImprovedRelativeDeltaField(forms.Field):
    def prepare_value(self, value):
        if value is None:
            return ''
        if isinstance(value, relativedelta):
            result = []
            for field in ['years', 'months', 'days', 'hours', 'minutes']:
                field_value = getattr(value, field)
                if field_value:
                    result.append(f'{field_value} {field}')
            return ', '.join(result)
        return value

    def to_python(self, value):
        if value in self.empty_values:
            return None
        try:
            return pytimeparse2.parse(
                value, granularity='minutes', as_timedelta=True, raise_exception=True
            )
        except ValueError:
            raise ValidationError(gettext('Bitte geben Sie eine gültige Dauer ein.'))

    def has_changed(self, initial, data):
        if self.disabled:
            return False
        try:
            data = self.to_python(data)
        except ValidationError:
            return True
        # relativedelta has a bug where it cannot be compared with anything else:
        # https://github.com/dateutil/dateutil/issues/1157

        if (isinstance(initial, relativedelta)) != (isinstance(data, relativedelta)):
            return True

        return initial != data
