import { inject, Injectable, Injector, runInInjectionContext, Signal } from '@angular/core';
import { LoginStateService } from './login/login-state.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { environment } from '../environments/environment';
import { QuestionnaireFilesGQL } from '../generated/graphql';
import { combineLatest, map, Observable, of, startWith, switchMap } from 'rxjs';

export interface SettingsLinkBase {
    readonly id: number;
    readonly textLangKey?: string;
    readonly text?: string;
    readonly accountRequired?: boolean;
    readonly guestRequired?: boolean;
}

export interface SettingsLinkLink extends SettingsLinkBase {
    readonly link: string[];
}

export interface SettingsLinkExternalLink extends SettingsLinkBase {
    readonly externalLink: string;
    readonly newWindow?: boolean;
}
export interface SettingsLinkChildren extends SettingsLinkBase {
    readonly children: Array<SettingsLinkLink | SettingsLinkExternalLink>;
}

export type SettingsLink = SettingsLinkLink | SettingsLinkExternalLink | SettingsLinkChildren;

type SettingsLinkFactory = () => Observable<SettingsLink>;

const settingsLinks: ReadonlyArray<SettingsLinkFactory | SettingsLink> = [
    {
        id: 0,
        textLangKey: marker('dashboard.questionnaires'),
        link: ['/'],
    },
    () => {
        const filesGql = inject(QuestionnaireFilesGQL);

        const privacyFiles$ = filesGql
            .watch({
                filters: { type: 'PRIVACY' },
                pagination: { limit: 1 },
            })
            .valueChanges.pipe(startWith(undefined));

        return privacyFiles$.pipe(
            map((privacyFilesResult) => {
                console.log({ privacyFilesResult });
                const privacyFile = privacyFilesResult?.data.questionnaireFiles.at(0);
                return {
                    id: 1,
                    textLangKey: marker('dashboard.support'),
                    children: [
                        {
                            id: 0,
                            textLangKey: marker('dashboard.files'),
                            link: ['/studienunterlagen/'],
                        },
                        {
                            id: 1,
                            textLangKey: marker('dashboard.contact'),
                            link: ['/kontakt/'],
                        },
                        ...(privacyFile == null
                            ? []
                            : [
                                  {
                                      id: 2,
                                      text: privacyFile.title,
                                      externalLink: privacyFile.file.url,
                                      newWindow: true,
                                  },
                              ]),
                        {
                            id: 3,
                            textLangKey: marker('dashboard.imprint'),
                            externalLink: 'https://www.dzhw.eu/impressum',
                            newWindow: true,
                        },
                    ],
                } satisfies SettingsLink;
            }),
        );
    },
    {
        id: 2,
        textLangKey: marker('dashboard.archive'),
        link: ['/archiv/'],
    },
    {
        id: 3,
        textLangKey: marker('dashboard.accountSettings'),
        accountRequired: true,
        children: [
            {
                id: 1,
                textLangKey: marker('dashboard.passwordChange'),
                link: ['passwort-ändern'],
                accountRequired: true,
            },
            {
                id: 2,
                textLangKey: marker('dashboard.emailChange'),
                link: ['email-ändern'],
                accountRequired: true,
            },
            {
                id: 3,
                textLangKey: marker('dashboard.pushNotifications'),
                link: ['benachrichtigungen'],
                accountRequired: true,
            },
            {
                id: 4,
                textLangKey: marker('dashboard.changeAccount'),
                link: ['konto-ändern'],
                accountRequired: true,
            },
        ],
    },
    ...(environment.guestCreateAccountsEnabled
        ? [
              {
                  id: 4,
                  textLangKey: marker('dashboard.createAccountFromGuest'),
                  link: ['register'],
                  guestRequired: true,
              },
          ]
        : []),
];

@Injectable({
    providedIn: 'root',
})
export class SettingsLinksService {
    readonly #loginState = inject(LoginStateService);
    readonly #injector = inject(Injector);

    createSettingsLinks(): Signal<readonly SettingsLink[]> {
        const linksObservable = this.#loginState.currentUser().pipe(
            startWith(null),
            switchMap((u) => {
                if (u == null) return of([]);
                const isUser = u.__typename === 'User';
                const isGuest = !isUser && u.hasGuestSession;
                const isAnyUser = isUser || isGuest;
                if (!isAnyUser) {
                    return of([]);
                } else {
                    const linkObservables = settingsLinks.map((linkOrFactory) => {
                        if (typeof linkOrFactory === 'function') {
                            return runInInjectionContext(this.#injector, linkOrFactory);
                        } else {
                            return of(linkOrFactory);
                        }
                    });
                    return combineLatest(linkObservables).pipe(
                        map((links) => {
                            return links.filter((link) => {
                                let ok = true;
                                if (link.accountRequired) {
                                    ok &&= isUser;
                                }
                                if (link.guestRequired) {
                                    ok &&= isGuest;
                                }
                                return ok;
                            });
                        }),
                    );
                }
            }),
        );

        return toSignal(linksObservable, { initialValue: [] });
    }
}
