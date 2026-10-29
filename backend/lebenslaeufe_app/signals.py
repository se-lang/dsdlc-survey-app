from django.db.models.signals import post_delete, post_save

from lebenslaeufe_app.first_install import clear_first_install_cache
from lla_auth.models import User


def register_signals():
    post_delete.connect(user_deleted, sender=User)
    post_save.connect(user_post_save, sender=User)


def user_deleted(**_kwargs):
    # Make sure to clear the "is this the first install?" cache when a user is deleted
    clear_first_install_cache()


def user_post_save(created: bool, **_kwargs):
    # Make sure to clear the "is this the first install?" cache when a new user is created
    if created:
        clear_first_install_cache()
