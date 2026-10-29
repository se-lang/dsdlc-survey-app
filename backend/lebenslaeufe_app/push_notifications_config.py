from django.apps import AppConfig


class PushNotificationsAppConfig(AppConfig):
    # This exists to set default_auto_field, which push_notifications library does not set
    # https://github.com/jazzband/django-push-notifications/issues/662
    name = 'push_notifications'
    default_auto_field = 'django.db.models.AutoField'
