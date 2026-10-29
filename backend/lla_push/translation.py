from modeltranslation.translator import TranslationOptions, register

from lla_push.models.config import PushNotificationConfig


@register(PushNotificationConfig)
class PushNotificationConfigTranslationOptions(TranslationOptions):
    fields = (
        'subject',
        'push_notification_text',
        'email_html',
    )
