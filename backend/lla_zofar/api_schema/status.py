import datetime
from enum import Enum
from typing import Any, Annotated

from django.utils.timezone import is_naive, make_aware
from pydantic import BaseModel, BeforeValidator, Field, AfterValidator


class ZfTokenCompletionStatus(Enum):
    NEW = 'NEW'
    STARTED = 'STARTED'
    FINISHED = 'FINISHED'


def _parse_status_date_time(value: Any):
    if value == 'UNKOWN':
        return None
    return value


def _post_parse_status_date_time(value: datetime.datetime | None):
    if value is None:
        return None
    return make_aware(value) if is_naive(value) else value


ZfTokenStatusDate = Annotated[
    Annotated[datetime.datetime | None, BeforeValidator(_parse_status_date_time)],
    AfterValidator(_post_parse_status_date_time),
]


class ZfTokenStatusContentStructureResponse(BaseModel):
    token: str
    state: ZfTokenCompletionStatus
    first_visit: ZfTokenStatusDate = Field(validation_alias='firstVisit')
    last_visit: ZfTokenStatusDate = Field(validation_alias='lastVisit')
    finished: bool
    blocked: bool = False


class ZfTokenStatusContentStructure(BaseModel):
    response: ZfTokenStatusContentStructureResponse


class ZfTokenStatusResponse(BaseModel):
    """
    The response for the special token status page.
    """

    content_structure: ZfTokenStatusContentStructure = Field(
        validation_alias='contentStructure'
    )
