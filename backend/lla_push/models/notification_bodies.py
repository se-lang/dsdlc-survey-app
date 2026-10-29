from typing import NamedTuple


class PushNotificationBodies(NamedTuple):
    push: dict
    email_subject: str
    email_text: str
    email_html: str
