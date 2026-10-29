import { inject, Injectable } from '@angular/core';
import { Translation, TranslocoLoader } from '@jsverse/transloco';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable()
export class TranslocoHttpLoader implements TranslocoLoader {
    readonly #http = inject(HttpClient);

    getTranslation(lang: string): Observable<Translation> {
        return this.#http
            .get<ReadonlyArray<readonly [string, string]>>(`/api/translations/`, {
                headers: {
                    'Accept-Language': lang,
                },
            })
            .pipe(map((r) => Object.fromEntries(r)));
    }
}
