import { inject, Pipe, PipeTransform } from '@angular/core';
import { DateFormatInput, DateFormatPreset, formatDate } from './date-formats';
import { I18nService } from '../services/i18n/i18n.service';
import { TranslocoService } from '@jsverse/transloco';

@Pipe({
    name: 'date',
    pure: false,
})
export class DatePipe implements PipeTransform {
    readonly #i18n = inject(I18nService);
    readonly #transloco = inject(TranslocoService);

    #locale: string | undefined = undefined;
    #value: DateFormatInput | undefined = undefined;
    #format: DateFormatPreset | undefined = undefined;
    #output: string | null = null;

    transform(value: DateFormatInput | null | undefined, format?: DateFormatPreset): string | null {
        const locale = this.#i18n.currentLoadedLanguageIdOrNull();
        if (locale == null) {
            return null;
        }
        value ??= undefined;
        if (this.#locale !== locale || this.#value !== value || this.#format !== format) {
            this.#locale = locale;
            this.#value = value;
            this.#format = format;
            this.#output = formatDate(value, this.#transloco, format);
        }
        return this.#output;
    }
}
