from dataclasses import dataclass
from typing import Self, TYPE_CHECKING

from pydantic_core.core_schema import ValidationInfo

if TYPE_CHECKING:
    from lla_zofar.models import ActiveZofarState


@dataclass(frozen=True, slots=True, kw_only=True)
class ZofarValidationContext:
    zofar_state: 'ActiveZofarState'

    @classmethod
    def get(cls, info: ValidationInfo) -> Self:
        assert isinstance(info.context, cls)
        return info.context
