import datetime
from typing import NewType, Any

import strawberry
import strawberry_django
import timedelta_isoformat
from django.core.files import File
from strawberry.relay import Node


def _serialize_timedelta(v: datetime.timedelta) -> str:
    return timedelta_isoformat.timedelta.isoformat(v)


def _parse_timedelta(v: Any) -> datetime.timedelta:
    match v:
        case str():
            return timedelta_isoformat.timedelta.fromisoformat(v)
        case int():
            return datetime.timedelta(milliseconds=v)
        case _:
            raise TypeError('Invalid duration value')


DurationScalar = strawberry.scalar(
    NewType('Duration', datetime.timedelta),
    serialize=_serialize_timedelta,
    parse_value=_parse_timedelta,
)


@strawberry.type(name='File')
class FileGql:
    @strawberry.field()
    @staticmethod
    def name(parent: strawberry.Parent[File]) -> str:
        return parent.name or ''

    @strawberry.field()
    @staticmethod
    def url(parent: strawberry.Parent[File]) -> str:
        return parent.url


@strawberry.type
class Query:
    node: Node | None = strawberry_django.node()
    nodes: list[Node | None] = strawberry_django.node()
