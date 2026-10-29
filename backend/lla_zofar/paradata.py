import enum

from django.dispatch import receiver
from django.utils.translation import gettext_lazy as _
from pydantic import BaseModel

from lla_paradata.registry import ParadataRegistry, PARADATA_REGISTRY

ZOFAR_EPISODE_PARADATA = 'zofar_episode'


class ZofarEpisodeEventType(enum.Enum):
    CREATE = 'create'
    EDIT = 'edit'


class ZofarEpisodeEvent(BaseModel):
    episode_id: str
    type: ZofarEpisodeEventType
    calendar_zoom: int | None


@receiver(PARADATA_REGISTRY.register_signal, dispatch_uid='zofar_paradata')
def zofar_paradata(registry: ParadataRegistry, **_kwargs):
    registry.register(
        ZOFAR_EPISODE_PARADATA, _('Zofar Episode'), False, ZofarEpisodeEvent
    )
