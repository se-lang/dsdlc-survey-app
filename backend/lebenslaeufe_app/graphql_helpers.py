from collections.abc import Iterable
from typing import Any, Callable
from uuid import UUID

from django.db.models import Model
from strawberry import Info
from strawberry.django.context import StrawberryDjangoContext
from strawberry.extensions import FieldExtension
from strawberry.relay import GlobalID
from strawberry.types import get_object_definition
from strawberry.types.field import StrawberryField
from strawberry_django import optimizer

DjangoInfo = Info[StrawberryDjangoContext, Any]


def is_root_field(info: Info) -> bool:
    """
    Check if the current field is a field on a root type (Query, Mutation, Subscription).
    This is useful for filtering, because usually permission-based filters are only applied
    at the root level.
    """
    return info.path.typename in ('Query', 'Mutation', 'Subscription')


def get_gql_uuid(global_id: GlobalID, expected_type: type | str | None = None) -> UUID:
    """
    Convert the given GlobalID into a UUID, optionally validating that it is for the correct type.
    """
    if isinstance(expected_type, str):
        type_name = expected_type
    elif isinstance(expected_type, type):
        type_name = get_object_definition(expected_type, strict=True).name
    else:
        type_name = None
    if type_name is not None and global_id.type_name != type_name:
        raise ValueError('Invalid ID provided')
    try:
        return UUID(global_id.node_id)
    except ValueError:
        raise ValueError('Invalid ID provided')


def get_gql_uuids(
    global_ids: Iterable[GlobalID], expected_type: type | str | None = None
) -> list[UUID]:
    """
    List version of get_gql_uuid, converting all items in the list.
    """
    return [get_gql_uuid(global_id, expected_type) for global_id in global_ids]


class ConditionalFieldExtension(FieldExtension):
    def __init__(self, condition: Callable[[], bool]):
        super().__init__()
        self.condition = condition

    def _check(self):
        if not self.condition():
            raise ValueError('This operation is not available.')

    def resolve(self, next_, source: Any, info: Info, **kwargs: Any) -> Any:
        self._check()
        return next_(source, info, **kwargs)

    async def resolve_async(self, next_, source: Any, info: Info, **kwargs: Any) -> Any:
        self._check()
        return await next_(source, info, **kwargs)

    def apply(self, field: StrawberryField) -> None:
        super().apply(field)


def refetch_optimized[T: Model](obj: T, info: Info) -> T:
    ext = optimizer.optimizer.get()
    if ext is None or not ext.enabled.get():
        return obj
    config = optimizer.OptimizerConfig(
        enable_only=ext.enable_only,
        enable_select_related=ext.enable_select_related,
        enable_prefetch_related=ext.enable_prefetch_related,
        enable_annotate=ext.enable_annotate_optimization,
        prefetch_custom_queryset=ext.prefetch_custom_queryset,
    )
    return optimizer.optimize(type(obj).objects.all(), info, config=config).get(
        pk=obj.pk
    )


class OptimizerRefetch(FieldExtension):
    def resolve(
        self, next_: Callable[..., Any], source: Any, info: Info, **kwargs: Any
    ) -> Any:
        result = next_(source, info, **kwargs)
        if isinstance(result, Model):
            return refetch_optimized(result, info)
        else:
            return result
