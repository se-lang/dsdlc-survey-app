import {
    ApplicationConfig,
    inject,
    isDevMode,
    provideAppInitializer,
    provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { provideGraphql } from './graphql.provider';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideServiceWorker } from '@angular/service-worker';
import { provideTranslocoConfig } from '@jsverse/transloco';

import { provideLanguageHandling } from '../services/i18n/i18n.providers';
import { apiLanguageHeaderInterceptor } from '../services/i18n/gql-language-header.interceptor';
import { FormDisabledService } from '../services/form-disabled.service';
import { provideParadata } from '../services/paradata/start-paradata';
import { httpHeaderOptionsInterceptor } from '../util/graphql-options-interceptor';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZonelessChangeDetection(),
        provideRouter(routes, withComponentInputBinding(), withInMemoryScrolling()),
        provideHttpClient(
            withFetch(),
            withInterceptors([apiLanguageHeaderInterceptor, httpHeaderOptionsInterceptor]),
        ),
        provideGraphql(),
        provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000',
        }),
        provideTranslocoConfig({
            availableLangs: [
                {
                    id: 'de',
                    label: 'Deutsch',
                },
                ...((environment.englishEnabled ?? true)
                    ? [
                          {
                              id: 'en',
                              label: 'English',
                          },
                      ]
                    : []),
            ],
            defaultLang: 'de',
            reRenderOnLangChange: true,
            prodMode: !isDevMode(),
            missingHandler: {
                allowEmpty: true,
            },
        }),
        provideLanguageHandling(),
        provideAppInitializer(() => {
            inject(FormDisabledService).handleLabelDisabledTrigger();
        }),
        provideParadata(),
    ],
};
