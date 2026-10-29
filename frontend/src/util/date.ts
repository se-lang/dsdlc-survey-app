import { DateTime } from './luxon';
import type { LocaleOptions } from 'luxon/src/datetime';

export function parseDate(input: unknown, opts?: LocaleOptions): DateTime {
    if (typeof input === 'string') {
        return DateTime.fromISO(input, opts);
    } else if (typeof input === 'number') {
        return DateTime.fromMillis(input, opts);
    } else if (input instanceof Date || String(input) === '[object Date]') {
        return DateTime.fromJSDate(input as Date);
    } else if (DateTime.isDateTime(input)) {
        return opts != null ? input.reconfigure(opts) : input;
    } else {
        console.warn('Invalid DateTime input', input);
        throw new Error('Invalid DateTime input');
    }
}
