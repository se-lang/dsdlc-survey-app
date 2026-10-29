from django.contrib.auth.forms import BaseUserCreationForm

from lla_auth.models import User


class LlaBaseUserCreationForm(BaseUserCreationForm):
    def save(self, commit=True):
        user = super().save(commit=False)
        user.is_active = False
        user.save()
        if commit and hasattr(self, 'save_m2m'):
            self.save_m2m()
        return user

    class Meta:
        model = User
        fields = (
            'email',
            'password1',
            'password2',
            'first_name',
            'last_name',
            'street',
            'zip_code',
            'city',
            'country',
            'date_of_birth',
            'phone',
        )
