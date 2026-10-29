from dataclasses import dataclass
from enum import StrEnum


class ZfPageButtonType(StrEnum):
    NEXT = 'form:btPanel:forward:forwardBt'
    BACK = 'form:btPanel:backward:backwardBt'
    FINISH = 'form:btPanel:final:finalBt'


@dataclass(slots=True, frozen=True)
class ZfPageButton:
    type: ZfPageButtonType
    label: str
