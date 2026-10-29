from django.conf import settings


def backoff_delay_seconds(attempt: int) -> float | None:
    if attempt >= settings.LLA_CONFIG.push_notifications.max_attempts:
        return None
    interval = settings.LLA_CONFIG.push_notifications.backoff_interval.total_seconds()
    return interval * (settings.LLA_CONFIG.push_notifications.backoff_rate**attempt)
