from django.forms import ModelChoiceField

from lla_auth.forms import LlaBaseUserCreationForm
from lla_auth.models import User
from lla_zofar.models import ZofarPersonQuestionnaire


class ZofarUserCreationForm(LlaBaseUserCreationForm):
    token = ModelChoiceField(
        queryset=ZofarPersonQuestionnaire.objects.exclude(
            person__user_id__isnull=False
        ),
        to_field_name='token',
    )

    def save(self, commit=True):
        return super().save(commit)

    class Meta:
        model = User
        fields = (*LlaBaseUserCreationForm.Meta.fields, 'token')
