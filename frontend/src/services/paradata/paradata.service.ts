import { inject, Injectable } from '@angular/core';
import {
    bufferWhen,
    catchError,
    concatMap,
    EMPTY,
    filter,
    fromEvent,
    mergeWith,
    retry,
    Subject,
    timer,
} from 'rxjs';
import { ParadataInput, ParadataValue, StoreParadataGQL } from '../../generated/graphql';
import { BufferedParadataValue, ParadataSink, StoredParadata } from './barebones';
import { GRAPHQL_HTTP_REQUEST_KEEPALIVE_HEADER } from '../../util/graphql-options-interceptor';

const EVENT_BUFFER_TIME = 1000;

@Injectable({
    providedIn: 'root',
})
export class ParadataService {
    readonly #addData$ = new Subject<BufferedParadataValue>();
    readonly #storeParadata = inject(StoreParadataGQL);

    constructor() {
        this.#addData$
            .pipe(
                bufferWhen(() =>
                    timer(EVENT_BUFFER_TIME).pipe(
                        mergeWith(
                            fromEvent(document, 'visibilitychange').pipe(
                                filter(() => document.visibilityState === 'hidden'),
                            ),
                        ),
                    ),
                ),
                filter((buffer) => buffer.length !== 0),
                concatMap((buffer) => {
                    // we sent how many ms ago the event was so that we're independent of the user's clock being
                    // correct. Instead, we say "this happened X milliseconds ago" and let the server figure out when
                    // that was.
                    const now = performance.now();
                    const data = buffer.map((buffered) => {
                        return {
                            timeAgo: Math.floor(now - buffered.when),
                            questionnaireId: buffered.questionnaireId,
                            value: buffered.value,
                        } satisfies ParadataInput;
                    });
                    return this.#storeParadata
                        .mutate(
                            { data: data },
                            {
                                context: {
                                    headers: {
                                        [GRAPHQL_HTTP_REQUEST_KEEPALIVE_HEADER]: '',
                                    },
                                },
                            },
                        )
                        .pipe(
                            retry(3),
                            catchError((err: unknown) => {
                                console.error('Failed to send paradata', err);
                                return EMPTY;
                            }),
                        );
                }),
            )
            .subscribe();
    }

    replaceParadataSink(stored: StoredParadata): [ParadataSink, null] {
        if (stored != null) {
            for (const data of stored) {
                this.#addData$.next(data);
            }
        }
        return [({ value, questionnaireId }) => this.addParadata(value, questionnaireId), null];
    }

    addParadata(value: ParadataValue, questionnaireId?: string | null) {
        console.log('paradata', value, questionnaireId);
        this.#addData$.next({
            when: performance.now(),
            value,
            questionnaireId,
        });
    }
}
