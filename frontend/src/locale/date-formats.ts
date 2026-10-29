import type { DateTime } from '../util/luxon';
import { Signal } from '@angular/core';
import { i18nCompute } from '../services/i18n/i18n.utils';
import { TranslocoService } from '@jsverse/transloco';
import { marker } from '@jsverse/transloco-keys-manager/marker';

interface ExtendedFormat {
    format: Intl.DateTimeFormatOptions;
    suffix?: Partial<Record<Intl.DateTimeFormatPartTypes, string>>;
}

type DateFormatter = Pick<Intl.DateTimeFormat, 'format'>;

const formats = {
    longMonthYear: { month: 'long', year: 'numeric' },
    shortMonthYear: { month: '2-digit', year: 'numeric' },
    longMonth: { month: 'long' },
    shortMonth: { month: 'short' },
    year: { year: 'numeric' },
    dayMonthYear: { day: '2-digit', month: '2-digit', year: 'numeric' },
    shortDateTime: {
        format: {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        },
        suffix: {
            minute: marker('dateFormatting.timeSuffix'),
        },
    },
} satisfies Record<string, Intl.DateTimeFormatOptions | ExtendedFormat>;

let formattersLocale: string | null = null;
const formatters = new Map<keyof typeof formats, DateFormatter>();

function getFormatter(t: TranslocoService, formatKey: keyof typeof formats): DateFormatter {
    const locale = t.getActiveLang();

    if (locale !== formattersLocale) {
        formattersLocale = locale;
        formatters.clear();
    }
    let formatter = formatters.get(formatKey);
    if (formatter === undefined) {
        const format: Intl.DateTimeFormatOptions | ExtendedFormat = formats[formatKey];
        if ('format' in format) {
            const baseFormatter = new Intl.DateTimeFormat(locale, format.format);
            const suffixes = format.suffix;
            let suffixEntries: Array<[string, string]>;
            if (suffixes && (suffixEntries = Object.entries(suffixes)).length !== 0) {
                const mappedSuffixes = Object.fromEntries<string>(
                    suffixEntries.map(([k, v]) => [k, t.translate(v)] as const),
                );
                formatter = {
                    format: (date) =>
                        baseFormatter
                            .formatToParts(date)
                            .map((v) => {
                                const suffix: string = mappedSuffixes[v.type] ?? '';
                                return v.value + suffix;
                            })
                            .join(''),
                };
            } else {
                formatter = baseFormatter;
            }
        } else {
            formatter = new Intl.DateTimeFormat(locale, format);
        }
        formatters.set(formatKey, formatter);
    }
    return formatter;
}

export type DateFormatPreset = keyof typeof formats;
export type DateFormatInput = string | number | Date | DateTime;

export function formatDate(
    date: DateFormatInput,
    t: TranslocoService,
    format?: DateFormatPreset,
): string;
export function formatDate(
    date: DateFormatInput | null | undefined,
    t: TranslocoService,
    format?: DateFormatPreset,
): string | null;
export function formatDate(
    date: DateFormatInput | null | undefined,
    t: TranslocoService,
    format: DateFormatPreset = 'longMonthYear',
): string | null {
    if (date == null || date === '') return null;
    let d: number | Date;
    if (typeof date === 'string') {
        d = Date.parse(date);
        // Do not use DateTime.isDateTime here to avoid putting Luxon into the main bundle
    } else if (typeof date === 'object' && 'toMillis' in date) {
        d = date.toMillis();
    } else {
        d = date;
    }
    return getFormatter(t, format).format(d);
}

export function formatDateComputed(
    computation: () => DateFormatInput,
    format?: DateFormatPreset,
): Signal<string>;

export function formatDateComputed(
    computation: () => DateFormatInput | null | undefined,
    format?: DateFormatPreset,
): Signal<string | null>;

export function formatDateComputed(
    computation: () => DateFormatInput | null | undefined,
    format?: DateFormatPreset,
): Signal<string | null> {
    return i18nCompute((t) => formatDate(computation(), t, format));
}
