import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

export const GRAPHQL_HTTP_REQUEST_KEEPALIVE_HEADER = 'x-lla-gql-keepalive';

/**
 * Apollo Angular has no options to directly control the request options except for headers.
 * We use headers as a signal to this interceptor to set any desired options.
 * @param req
 * @param next
 */
export function httpHeaderOptionsInterceptor(
    req: HttpRequest<unknown>,
    next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
    if (req.headers.has(GRAPHQL_HTTP_REQUEST_KEEPALIVE_HEADER)) {
        req = req.clone({
            keepalive: true,
            headers: req.headers.delete(GRAPHQL_HTTP_REQUEST_KEEPALIVE_HEADER),
        });
    }
    return next(req);
}
