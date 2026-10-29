import { ParadataValue } from '../../generated/graphql';
import { inject, InjectionToken } from '@angular/core';

export interface BufferedParadataValue {
    /**
     * The value of performance.now at the time this event occurred.
     * We use performance.now instead of Date to be independent of user clock changes.
     */
    readonly when: number;
    readonly value: ParadataValue;
    readonly questionnaireId: string | undefined | null;
}

export type ParadataSink = (value: Omit<BufferedParadataValue, 'when'>) => void;

export type StoredParadata = BufferedParadataValue[] | null;

const STORED_PARADATA = new InjectionToken<[ParadataSink, StoredParadata]>('STORED_PARADATA', {
    providedIn: 'root',
    factory: () => {
        const stored: StoredParadata = [];
        const func: ParadataSink = (value) => stored.push({ when: performance.now(), ...value });
        return [func, stored];
    },
});

const PARADATA_SINK_WRAPPER = new InjectionToken<ParadataSink>('PARADATA_SINK_WRAPPER', {
    providedIn: 'root',
    factory: () => {
        const holder = inject(STORED_PARADATA);
        return (value: Omit<BufferedParadataValue, 'when'>) => {
            holder[0](value);
        };
    },
});

export function replaceParadataSink(
    func: (stored: StoredParadata) => [ParadataSink, StoredParadata],
) {
    const stored = inject(STORED_PARADATA);
    [stored[0], stored[1]] = func(stored[1]);
}

export function paradataSink(): ParadataSink {
    return inject(PARADATA_SINK_WRAPPER);
}
