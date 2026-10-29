import { inject, Injectable } from '@angular/core';
import { defer, map, Observable, switchMap } from 'rxjs';
import { LoginGQL, LogoutGQL, OperationInfoFragment, UserDocument } from '../../generated/graphql';
import { Apollo } from 'apollo-angular';

@Injectable({
    providedIn: 'root',
})
export class LoginService {
    readonly #apollo = inject(Apollo);
    readonly #loginGql = inject(LoginGQL);
    readonly #logoutGql = inject(LogoutGQL);

    login(username: string, password: string): Observable<OperationInfoFragment | null> {
        return this.#loginGql
            .mutate(
                { username, password },
                {
                    update: (cache, result) => {
                        if (result.data?.login.__typename === 'User') {
                            cache.writeQuery({
                                query: UserDocument,
                                data: {
                                    user: result.data.login,
                                },
                            });
                        }
                    },
                },
            )
            .pipe(
                map((response) => {
                    return response.data?.login.__typename === 'OperationInfo'
                        ? response.data.login
                        : null;
                }),
            );
    }

    logout(): Observable<void> {
        return defer(() =>
            this.#apollo.client.cache.reset({
                discardWatches: true,
            }),
        ).pipe(
            switchMap(() => {
                return this.#logoutGql.mutate(undefined, {
                    update: (cache, result) => {
                        if (result.data?.logout != null) {
                            cache.writeQuery({
                                query: UserDocument,
                                data: {
                                    user: result.data.logout,
                                },
                            });
                        }
                    },
                });
            }),
            map(() => undefined),
        );
    }
}
