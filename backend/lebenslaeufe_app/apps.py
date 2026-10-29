from pathlib import Path

from django.apps import AppConfig
from django.utils.autoreload import autoreload_started, BaseReloader


def watch_dev_config_file(sender: BaseReloader, **_kwargs):
    config_file_path = Path(__file__).resolve().parent.parent / 'lla.config.toml'
    sender.extra_files.add(config_file_path)


class LebenslaeufeAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'lebenslaeufe_app'

    def ready(self):
        from lebenslaeufe_app.signals import register_signals

        register_signals()
        autoreload_started.connect(watch_dev_config_file)
