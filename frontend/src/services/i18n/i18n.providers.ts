import {
    EnvironmentProviders,
    makeEnvironmentProviders,
    provideAppInitializer,
} from '@angular/core';
import { I18nService } from './i18n.service';
import {
    DefaultFallbackStrategy,
    DefaultInterceptor,
    DefaultMissingHandler,
    DefaultTranspiler,
    provideTranslocoFallbackStrategy,
    provideTranslocoInterceptor,
    provideTranslocoLoader,
    provideTranslocoMissingHandler,
    provideTranslocoTranspiler,
} from '@jsverse/transloco';
import { TranslocoHttpLoader } from './transloco-loader';
import { handleLanguageStartup } from './i18n.startup';

export function provideLanguageHandling(): EnvironmentProviders {
    return makeEnvironmentProviders([
        provideAppInitializer(handleLanguageStartup),
        I18nService,
        provideTranslocoTranspiler(DefaultTranspiler),
        provideTranslocoMissingHandler(DefaultMissingHandler),
        provideTranslocoInterceptor(DefaultInterceptor),
        provideTranslocoFallbackStrategy(DefaultFallbackStrategy),
        provideTranslocoLoader(TranslocoHttpLoader),
    ]);
}
