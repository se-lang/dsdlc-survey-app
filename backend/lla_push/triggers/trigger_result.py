from dataclasses import dataclass
from uuid import UUID


@dataclass
class TriggeredPushNotification:
    """
    The result of PushNotificationTrigger.get_notifications.
    The body of the notification will be determined later, when the notification is actually sent.
    See PushNotificationConfig.create_notification_body.
    """

    person_id: UUID
    trigger_data: dict
