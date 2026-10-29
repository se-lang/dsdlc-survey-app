import { computed, inject, Injectable, Injector } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { toSignal } from '@angular/core/rxjs-interop';
import {
    catchError,
    map,
    mergeWith,
    Observable,
    of,
    shareReplay,
    Subject,
    switchMap,
    take,
    tap,
} from 'rxjs';
import { withGlobalLoading } from '../global-loading.service';

export const languageStorageName = 'dzhw_lla_lang';

@Injectable()
export class I18nService {
    readonly #injector = inject(Injector);
    readonly #transloco = inject(TranslocoService);
    readonly #initialLanguageLoaded$ = new Subject<void>();
    readonly #setLanguage = new Subject<string>();
    readonly currentLanguageId = toSignal(this.#transloco.langChanges$, {
        initialValue: this.#transloco.getActiveLang(),
    });

    readonly currentLoadedLanguageId$ = this.#setLanguage.pipe(
        switchMap((language) => {
            this.#transloco.setActiveLang(language);
            localStorage.setItem(languageStorageName, language);
            return this.#transloco.load(language).pipe(
                map(() => language),
                catchError((err: unknown) => {
                    console.error('Failed to load language', err);
                    return of(language);
                }),
                withGlobalLoading({ injector: this.#injector }),
            );
        }),
        mergeWith(this.#initialLanguageLoaded$.pipe(map(() => this.#transloco.getActiveLang()))),
        shareReplay(1),
    );

    readonly currentLoadedLanguageIdOrNull = toSignal(this.currentLoadedLanguageId$);

    readonly currentLoadedLanguageId = computed(() => {
        return this.currentLoadedLanguageIdOrNull() ?? this.#transloco.getActiveLang();
    });

    loadInitialLanguage(): Observable<unknown> {
        return this.#transloco.load(this.#transloco.getActiveLang()).pipe(
            take(1),
            tap(() => {
                this.#initialLanguageLoaded$.next();
                this.#initialLanguageLoaded$.complete();
            }),
        );
    }

    setLanguage(language: string) {
        this.#setLanguage.next(language);
    }
}
