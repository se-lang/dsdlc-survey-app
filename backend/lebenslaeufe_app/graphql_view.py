from typing import Optional

from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from strawberry.django.views import GraphQLView
from strawberry.http.exceptions import HTTPException
from strawberry.http.typevars import Request, Context, RootValue
from strawberry.types import ExecutionResult


@method_decorator(csrf_exempt, name='dispatch')
class CustomGraphQLView(GraphQLView):
    def execute_operation(
        self, request: Request, context: Context, root_value: Optional[RootValue]
    ) -> ExecutionResult:
        # Guard against CSRF by only allowing POST requests.
        # See https://www.apollographql.com/docs/graphos/routing/security/csrf
        # for how Apollo GraphOS handles it. The rationale here is the same, the base GraphQLView
        # already verifies that only application/json requests are allowed. We add the additional
        # guard to only allow POST. As a result we do not need Django's token based CSRF
        # protection, which would be cumbersome to implement in Angular and the GraphQL Playground.
        if request.method != 'POST':
            raise HTTPException(405, 'Only POST requests are supported')
        return super().execute_operation(request, context, root_value)
