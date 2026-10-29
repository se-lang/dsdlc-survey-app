import { inject, Injectable, Injector } from '@angular/core';
import {
    delay,
    distinctUntilChanged,
    map,
    MonoTypeOperatorFunction,
    Observable,
    of,
    OperatorFunction,
    startWith,
    Subject,
    switchMap,
} from 'rxjs';
import type { ApolloQueryResult } from '@apollo/client/core';

const loadingDebounceMs = 150;

@Injectable({
    providedIn: 'root',
})
export class GlobalLoadingService {
    readonly #loaders = new Set<unknown>();
    readonly #loadersChanged$ = new Subject<void>();
    readonly isLoading$ = this.#loadersChanged$.pipe(
        startWith(null),
        map(() => this.#loaders.size !== 0),
        distinctUntilChanged(),
    );
    readonly showLoadingSpinner$ = this.isLoading$.pipe(
        switchMap((loading) => {
            if (loading) {
                return of(true).pipe(delay(loadingDebounceMs));
            } else {
                return of(false);
            }
        }),
    );

    createRef(): unknown {
        return Object.create(null);
    }

    addLoader(ref: unknown) {
        const loading = this.#loaders.size !== 0;
        this.#loaders.add(ref);
        if (!loading) {
            this.#loadersChanged$.next();
        }
    }

    removeLoader(ref: unknown) {
        const loading = this.#loaders.size !== 0;
        this.#loaders.delete(ref);
        if (loading && this.#loaders.size === 0) {
            this.#loadersChanged$.next();
        }
    }

    startLoading(): () => void {
        const ref = this.createRef();
        this.addLoader(ref);
        return () => {
            this.removeLoader(ref);
        };
    }
}

export interface WithGlobalLoadingOptions {
    injector?: Injector;
}

export function withGlobalLoading<R>({
    injector,
}: WithGlobalLoadingOptions = {}): MonoTypeOperatorFunction<R> {
    const service = injector?.get(GlobalLoadingService) ?? inject(GlobalLoadingService);
    return (source) => {
        return new Observable((subscriber) => {
            const stopLoading = service.startLoading();
            const sub = source.subscribe(subscriber);
            sub.add(stopLoading);
            return sub;
        });
    };
}

export function withGraphqlGlobalLoading<R>({
    injector,
}: WithGlobalLoadingOptions = {}): OperatorFunction<ApolloQueryResult<R>, R> {
    const service = injector?.get(GlobalLoadingService) ?? inject(GlobalLoadingService);
    return (source) => {
        return new Observable((subscriber) => {
            const ref = service.createRef();
            const sub = source.subscribe({
                next: (v) => {
                    if (v.loading) {
                        service.addLoader(ref);
                    } else {
                        service.removeLoader(ref);
                        subscriber.next(v.data);
                    }
                },
                error: (err: unknown) => subscriber.error(err),
                complete: () => subscriber.complete(),
            });
            sub.add(() => service.removeLoader(ref));
            return sub;
        });
    };
}
