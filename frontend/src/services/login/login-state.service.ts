import { inject, Injectable } from '@angular/core';
import { CurrentUserFragment, UserGQL } from '../../generated/graphql';
import { catchError, map, Observable, of } from 'rxjs';

export const ANONYMOUS_USER: CurrentUserFragment = {
    __typename: 'AnonymousUser',
    id: '0',
    isAuthenticated: false,
    hasGuestSession: false,
    guestHasAccount: false,
};

@Injectable({
    providedIn: 'root',
})
export class LoginStateService {
    readonly #currentUserGql = inject(UserGQL);

    startup(): Observable<unknown> {
        return this.#currentUserGql.fetch();
    }

    isLoggedIn(): Observable<boolean | null> {
        return this.#currentUserGql.fetch().pipe(
            map((result) => {
                const user = result.data.user;
                return (
                    user.isAuthenticated ||
                    (user.__typename === 'AnonymousUser' && user.hasGuestSession)
                );
            }),
            catchError(() => of(null)),
        );
    }

    currentUser(): Observable<CurrentUserFragment> {
        return this.#currentUserGql.watch().valueChanges.pipe(
            map((result) => result.data.user),
            catchError(() => {
                return of(ANONYMOUS_USER);
            }),
        );
    }
}
