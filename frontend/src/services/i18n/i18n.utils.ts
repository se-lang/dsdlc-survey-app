import { computed, CreateComputedOptions, inject, Injector, Signal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { I18nService } from './i18n.service';

export function currentLanguage(): Signal<string> {
    return inject(I18nService).currentLoadedLanguageId;
}

export interface CreateI18nComputedOptions<R> extends CreateComputedOptions<R> {
    injector?: Injector;
}

/**
 * Like `computed`, but allows access to translations and will recompute on language change
 * @param computation
 * @param options
 */
export function i18nCompute<R>(
    computation: (t: TranslocoService) => R,
    options?: CreateI18nComputedOptions<R>,
): Signal<R> {
    const injector = options?.injector ?? inject(Injector);
    const i18n = injector.get(I18nService);
    const transloco = injector.get(TranslocoService);
    return computed(() => {
        i18n.currentLoadedLanguageIdOrNull(); // recompute when loaded language changes
        return computation(transloco);
    }, options);
}
