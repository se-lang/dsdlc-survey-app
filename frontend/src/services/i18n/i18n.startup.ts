import { inject } from '@angular/core';
import { LangDefinition, TranslocoService } from '@jsverse/transloco';
import { Apollo } from 'apollo-angular';
import { distinctUntilChanged, skip } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { languageStorageName } from './i18n.service';

function findLanguage(
    desiredLanguages: readonly string[],
    supportedLanguages: readonly string[],
    extract: RegExp | null,
): string | null {
    for (const desiredLanguage of desiredLanguages) {
        let extractedLanguage: string;
        if (extract == null) {
            extractedLanguage = desiredLanguage;
        } else {
            const match = extract.exec(desiredLanguage);
            if (!match) {
                continue;
            }
            [extractedLanguage] = match;
        }
        if (supportedLanguages.includes(extractedLanguage)) {
            console.log('detected language', extractedLanguage);
            return extractedLanguage;
        }
    }
    return null;
}

function getDetectedLanguage(supportedLanguages: readonly string[]): string | null {
    const desiredLanguages = navigator.languages;
    return (
        findLanguage(desiredLanguages, supportedLanguages, null) ??
        findLanguage(desiredLanguages, supportedLanguages, /^([a-z]+)-/i)
    );
}

export function handleLanguageStartup() {
    const transloco = inject(TranslocoService);
    const apollo = inject(Apollo);

    const supportedLanguages = (transloco.getAvailableLangs() as LangDefinition[]).map((l) => l.id);
    const selectedLang = localStorage.getItem(languageStorageName);
    if (selectedLang != null && supportedLanguages.includes(selectedLang)) {
        transloco.setActiveLang(selectedLang);
    } else {
        localStorage.removeItem(languageStorageName);
        transloco.setActiveLang(
            getDetectedLanguage(supportedLanguages) ?? transloco.getDefaultLang(),
        );
    }

    transloco.langChanges$
        .pipe(distinctUntilChanged(), skip(1), takeUntilDestroyed())
        .subscribe(() => {
            console.log('Resetting Apollo cache after language change');
            apollo.client.cache
                .reset()
                .catch((err: unknown) =>
                    console.error('Failed to reset Apollo cache after language change', err),
                );
        });
}
