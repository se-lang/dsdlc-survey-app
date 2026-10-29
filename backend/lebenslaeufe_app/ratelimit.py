from collections.abc import Callable, Iterable
from typing import Any, cast

from django.conf import settings
from django.http import HttpRequest
from django_ratelimit.core import is_ratelimited
from django_ratelimit.exceptions import Ratelimited
from graphql import GraphQLError
from ipware import get_client_ip
from strawberry.django.context import StrawberryDjangoContext
from strawberry.extensions import FieldExtension, SchemaExtension
from strawberry.extensions.field_extension import SyncExtensionResolver
from graphql.pyutils import Path as GqlPath
from graphql.execution import ExecutionResult as GraphQLExecutionResult

from lebenslaeufe_app.graphql_helpers import DjangoInfo


def rl_client_ip(_group: str, request: HttpRequest) -> str:
    ip, is_routable = get_client_ip(
        request,
        proxy_count=settings.LLA_CONFIG.network.proxy_count,
    )
    if not ip or (not settings.DEBUG and not is_routable):
        # If we're in production, do not allow requests if we can't determine the IP properly.
        # If we did that, those requests would bypass the rate-limit.
        # In development however, requests from unroutable IPs must be allowed, to allow developing
        # on the local machine.
        raise ValueError('Unable to determine client IP.')
    return ip


def _iter_path(path: GqlPath) -> Iterable[str]:
    curr = path
    while curr:
        yield str(curr.key)
        if not curr.prev:
            yield curr.typename
        curr = curr.prev


class RateLimit(FieldExtension):
    """
    A FieldExtension which applies a rate limit on a per-field basis. An optional group can
    be specified to allow rate limiting across multiple fields in the same "bucket".
    """

    def __init__(
        self,
        rate: str
        | tuple[int, int]
        | Callable[[str, HttpRequest], str | tuple[int, int]]
        | None = None,
        group: str | None = None,
        *,
        key: str | Callable[[str, HttpRequest], str] | None = None,
    ):
        self.group = group
        self.key = key
        self.rate = rate

    def resolve(
        self, next_: SyncExtensionResolver, source: Any, info: DjangoInfo, **kwargs: Any
    ) -> Any:
        group = self.group or '.'.join(_iter_path(info.path))
        key = self.key or rl_client_ip
        if is_ratelimited(
            info.context.request, group=group, key=key, rate=self.rate, increment=True
        ):
            raise Ratelimited('Rate limited')
        return next_(source, info, **kwargs)


class GlobalRateLimit(SchemaExtension):
    """
    A GraphQL SchemaExtension which applies a rate limit across all GraphQL operations.
    """

    def __init__(self, rate: str) -> None:
        super().__init__()
        self.rate = rate

    def on_operation(self):
        context = cast(StrawberryDjangoContext, self.execution_context.context)
        if is_ratelimited(
            context.request,
            group='gql.global',
            key=rl_client_ip,
            rate=self.rate,
            increment=True,
        ):
            self.execution_context.result = GraphQLExecutionResult(
                data=None, errors=[GraphQLError('Rate limited')]
            )
        yield
