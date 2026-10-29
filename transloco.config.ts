import { TranslocoGlobalConfig } from '@jsverse/transloco-utils';

const config: TranslocoGlobalConfig = {
    rootTranslationsPath: 'frontend/public/assets/i18n',
    langs: ['de', 'en'],
    keysManager: {
        addMissingKeys: true,
        emitErrorOnExtraKeys: true,
        input: 'frontend/src',
        output: 'backend/lla_translations/base_json',
        unflat: true,
    },
};

export default config;
