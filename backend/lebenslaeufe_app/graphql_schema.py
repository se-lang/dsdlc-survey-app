import itertools
from collections import defaultdict, deque
from collections.abc import Iterable
from importlib import import_module
from typing import overload

import django.dispatch
import strawberry
from django.apps import apps
from strawberry.tools import merge_types
from strawberry.types import has_object_definition
from strawberry_django.optimizer import DjangoOptimizerExtension

from lebenslaeufe_app.ratelimit import GlobalRateLimit


register_graphql_types = django.dispatch.Signal()
"""
This Signal is sent at the end of the GraphQL module discovery process. It can be used to
add additional types to the GraphQL registry after all "graphql" modules have been evaluated.
"""


class GraphqlExtraTypeRegistry:
    def __init__(self, extra_types: set[type]):
        self.extra_types = extra_types

    @overload
    def register(self, *extra_types: type) -> None: ...

    @overload
    def register(self, extra_type: Iterable[type]) -> None: ...

    def register(self, extra_type: type | Iterable[type], *more_types: type) -> None:
        if isinstance(extra_type, Iterable):
            self.extra_types.update(extra_type)
        else:
            self.extra_types.add(extra_type)
        self.extra_types.update(more_types)


_top_level_types = ('Query', 'Mutation', 'Subscription')
_sentinel = object()


def create_schema() -> strawberry.Schema:
    """
    Create the GraphQL schema from all Django apps. Any Django app can contribute to the GraphQL
    schema by exposing a "graphql" module with members Query and/or Mutation.
    If additional types which don't get discovered automatically should be added to the schema,
    they can be exposed via a EXTRA_TYPES member of the graphql module. It must be an Iterable
    of GraphQL types.
    Additionally, register_graphql_types can be connected to in the graphql module and can be used
    to dynamically add more types to the schema after all graphql modules have been evaluated.
    """
    schema_types = defaultdict(set)
    extra_types = set()

    app_modules = itertools.chain(
        (app_config.module for app_config in apps.get_app_configs()),
    )
    modules_to_check = deque(f'{module.__name__}.graphql' for module in app_modules)

    while modules_to_check:
        module_name = modules_to_check.pop()
        try:
            gql_module = import_module(module_name)
        except ModuleNotFoundError:
            continue

        for type_name in _top_level_types:
            module_type_instance = getattr(gql_module, type_name, None)
            if module_type_instance is not None:
                type_set = schema_types[type_name]
                if module_type_instance in type_set:
                    raise ValueError(
                        f'Duplicate {type_name} type: '
                        f'{gql_module.__name__}.{module_type_instance.__qualname__}'
                    )
                if not has_object_definition(module_type_instance):
                    raise TypeError(
                        f'{gql_module.__name__}.{module_type_instance.__qualname__} is not a '
                        f'strawberry type.'
                    )
                type_set.add(module_type_instance)
            module_extra_types = getattr(gql_module, 'EXTRA_TYPES', _sentinel)
            if module_extra_types is not _sentinel:
                if not isinstance(module_extra_types, Iterable):
                    raise TypeError(
                        f'{gql_module.__name__}.EXTRA_TYPES is not iterable.'
                    )
                wrong_index = next(
                    (
                        idx
                        for idx, v in enumerate(module_extra_types)
                        if not has_object_definition(v)
                    ),
                    None,
                )
                if wrong_index is not None:
                    raise TypeError(
                        f'{gql_module.__name__}.EXTRA_TYPES[{wrong_index}] is not a '
                        f'strawberry type.'
                    )
                extra_types.update(module_extra_types)

    register_graphql_types.send(
        sender=GraphqlExtraTypeRegistry, registry=GraphqlExtraTypeRegistry(extra_types)
    )
    merged_types = {
        type_name.lower(): merge_types(type_name, tuple(types))
        for type_name, types in schema_types.items()
    }
    schema = strawberry.Schema(
        **merged_types,
        types=extra_types,
        extensions=(DjangoOptimizerExtension, GlobalRateLimit(rate='600/m')),
    )
    return schema
