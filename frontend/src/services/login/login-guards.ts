import { LoginStateService } from './login-state.service';
import {
    ActivatedRouteSnapshot,
    CanActivateFn,
    createUrlTreeFromSnapshot,
    GuardResult,
    MaybeAsync,
    RedirectCommand,
    Router,
    RouterStateSnapshot,
    UrlSerializer,
} from '@angular/router';
import { inject } from '@angular/core';
import { map, take } from 'rxjs';

export const LOGIN_NEXT_PARAM = 'next';
// Note: When adjusting this, also change the input name in LoginWelcomePage
export const LOGIN_TOKEN_PARAM = 'token';

export function isLoggedInGuard(allowGuestSession = true): CanActivateFn {
    return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> => {
        const router = inject(Router);
        const urlSerializer = inject(UrlSerializer);
        const service = inject(LoginStateService);
        return service.currentUser().pipe(
            take(1),
            map((user) => {
                if (user.__typename === 'User' || (allowGuestSession && user.hasGuestSession)) {
                    return true;
                } else if (user.hasGuestSession) {
                    // Guest session is not allowed, but user has a guest session
                    // We cannot redirect them to the Login screen, because that would assume
                    // "oh they are logged in already", causing an infinite loop
                    return new RedirectCommand(router.createUrlTree(['/404']), {
                        browserUrl: state.url,
                    });
                } else {
                    const { [LOGIN_TOKEN_PARAM]: extractedToken = null, ...newParams } =
                        route.queryParams;
                    const nextTree = createUrlTreeFromSnapshot(
                        route,
                        [],
                        newParams,
                        route.fragment,
                    );
                    return router.createUrlTree(['/login-welcome'], {
                        queryParams: {
                            [LOGIN_NEXT_PARAM]: urlSerializer.serialize(nextTree),
                            [LOGIN_TOKEN_PARAM]: extractedToken as unknown,
                        },
                    });
                }
            }),
        );
    };
}

export function loginPageGuard(route: ActivatedRouteSnapshot): MaybeAsync<GuardResult> {
    const router = inject(Router);
    const service = inject(LoginStateService);
    const urlSerializer = inject(UrlSerializer);
    return service.isLoggedIn().pipe(
        take(1),
        map((loggedIn) => {
            if (!loggedIn) {
                return true;
            } else {
                const next = route.queryParamMap.get(LOGIN_NEXT_PARAM);
                if (next != null) {
                    return urlSerializer.parse(next);
                } else {
                    return router.createUrlTree(['/']);
                }
            }
        }),
    );
}
