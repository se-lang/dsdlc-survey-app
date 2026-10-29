import { computed, inject, Injectable } from '@angular/core';
import { ParadataService } from './paradata.service';
import { fromEvent, map, Observable, startWith } from 'rxjs';
import { ParadataValue } from '../../generated/graphql';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { injectFromCurrentQnr } from '../qnr/global-qnr-access';
import { QUESTIONNAIRE_SERVICE } from '../qnr/questionnaire-service-interface';
import { combineLatest } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class BrowserParadataService {
    readonly #paradataService = inject(ParadataService);
    readonly #currentQnr: Observable<string | undefined>;

    constructor() {
        const qnrService = injectFromCurrentQnr(QUESTIONNAIRE_SERVICE);
        this.#currentQnr = toObservable(computed(() => qnrService()?.context()?.questionnaireId));
    }

    start() {
        this.#addGlobal(
            fromEvent(document, 'visibilitychange').pipe(
                startWith(0),
                map(() => {
                    return {
                        focus: document.visibilityState === 'visible',
                    } satisfies ParadataValue;
                }),
            ),
        );
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (window.screen.orientation) {
            this.#addGlobal(
                fromEvent(window.screen.orientation, 'change').pipe(
                    startWith(0),
                    map(() => {
                        return {
                            orientation: window.screen.orientation.type.startsWith('landscape')
                                ? 'LANDSCAPE'
                                : 'PORTRAIT',
                        } satisfies ParadataValue;
                    }),
                ),
            );
        } else {
            console.log('screen.orientation is not supported');
        }

        this.#addGlobal(
            fromEvent(window, 'resize').pipe(
                startWith(0),
                map((e) => {
                    return {
                        windowSize: {
                            width: window.innerWidth,
                            height: window.innerHeight,
                        },
                    };
                }),
            ),
        );

        this.#paradataService.addParadata({
            userAgent: navigator.userAgent,
        });
    }

    #addGlobal(data: Observable<ParadataValue>) {
        combineLatest([data, this.#currentQnr])
            .pipe(takeUntilDestroyed())
            .subscribe({
                next: ([value, questionnaireId]) =>
                    this.#paradataService.addParadata(value, questionnaireId),
                error: (err: unknown) => console.error('Error during paradata collection', err),
            });
    }
}
