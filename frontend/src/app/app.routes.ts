import { Route, Routes } from '@angular/router';
import { MainLayout } from '../layouts/main/main.layout';
import { isLoggedInGuard, loginPageGuard } from '../services/login/login-guards';
import { BOXED_LAYOUT_DIALOG_SIZE, BoxedLayout } from '../layouts/boxed/boxed.layout';
import { DashboardPage } from '../pages/dashboard/dashboard.page';
import {
    QUESTIONNAIRE_PAGE_LEAVE_TEXT_OVERRIDE,
    QUESTIONNAIRE_PAGE_LEAVE_TEXT_OVERRIDE_CALENDAR,
} from '../pages/questionnaire-page/questionnaire-page-routing-constants';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import BackButtonComponent from '../components/back-button/back-button.component';
import { environment } from '../environments/environment';
import { registerPageGuard } from '../pages/register/register.page';
import { ConfirmOptions } from '../services/confirm.service';

interface BackButtonConfig {
    routerLink?: string;
    ariaLabel?: string;
}

function dashboardBackButtonRoute(route: Route, backButtonConfig: BackButtonConfig = {}): Route {
    const { path, ...restRoute } = route;
    return {
        path,
        children: [
            {
                path: '',
                ...restRoute,
            },
            {
                path: '',
                pathMatch: 'full',
                outlet: 'backButton',
                data: {
                    routerLink: '/',
                    ariaLabel: marker('dashboard.backButtonLabel'),
                    ...backButtonConfig,
                },
                component: BackButtonComponent,
            },
        ],
    };
}

export const routes: Routes = [
    {
        path: '',
        component: BoxedLayout,
        data: {
            [BOXED_LAYOUT_DIALOG_SIZE]: 'default',
        },
        children: [
            {
                path: '',
                component: DashboardPage,
                canActivate: [isLoggedInGuard()],
                // always run the isLoggedInGuard in case the user clicks "Logout" on the dashboard
                // this way we can trigger the appropriate redirect
                runGuardsAndResolvers: 'always',
                children: [
                    {
                        path: '',
                        loadComponent: () =>
                            import(
                                '../pages/dashboard-questionnaires/dashboard-questionnaires.page'
                            ),
                    },
                    {
                        path: '',
                        pathMatch: 'full',
                        outlet: 'subheader',
                        loadComponent: () =>
                            import('../components/news-info-bar/news-info-bar.component'),
                    },
                    dashboardBackButtonRoute({
                        path: 'studienunterlagen',
                        loadComponent: () =>
                            import('../pages/dashboard-files/dashboard-files.page'),
                    }),
                    dashboardBackButtonRoute({
                        path: 'archiv',
                        loadComponent: () =>
                            import('../pages/dashboard-archive/dashboard-archive.page'),
                    }),
                    dashboardBackButtonRoute(
                        {
                            path: 'news/:uid',
                            loadComponent: () =>
                                import('../pages/dashboard-news-detail/dashboard-news-detail.page'),
                        },
                        {
                            routerLink: '/archiv',
                            ariaLabel: marker('archive.backButtonLabel'),
                        },
                    ),
                    dashboardBackButtonRoute({
                        path: 'passwort-ändern',
                        canActivate: [isLoggedInGuard(false)],
                        loadComponent: () =>
                            import('../pages/change-password/change-password.page'),
                    }),
                    dashboardBackButtonRoute({
                        path: 'email-ändern',
                        canActivate: [isLoggedInGuard(false)],
                        loadComponent: () =>
                            import('../pages/email-change-trigger/email-change-trigger.page'),
                    }),
                    dashboardBackButtonRoute({
                        path: 'konto-ändern',
                        canActivate: [isLoggedInGuard(false)],
                        loadComponent: () =>
                            import('../pages/change-account-page/change-account-page.component'),
                    }),
                    dashboardBackButtonRoute({
                        path: 'kontakt',
                        loadComponent: () =>
                            import('../pages/dashboard-contact/dashboard-contact.page'),
                    }),
                    dashboardBackButtonRoute({
                        path: 'benachrichtigungen',
                        canActivate: [isLoggedInGuard()],
                        loadComponent: () =>
                            import('../pages/web-push-settings/web-push-settings.page'),
                    }),
                ],
            },
        ],
    },
    {
        path: '',
        component: BoxedLayout,
        data: {
            [BOXED_LAYOUT_DIALOG_SIZE]: 'login',
        },
        children: [
            {
                path: 'login-welcome',
                canActivate: [loginPageGuard],
                loadComponent: () => import('../pages/login-welcome/login-welcome.page'),
            },
            ...((environment.loginEnabled ?? true)
                ? [
                      {
                          path: 'login',
                          canActivate: [loginPageGuard],
                          loadComponent: () => import('../pages/login/login.page'),
                      },
                  ]
                : []),
            ...((environment.registerEnabled ?? true) ||
            (environment.guestCreateAccountsEnabled ?? true)
                ? [
                      {
                          path: 'register',
                          loadComponent: () => import('../pages/register/register.page'),
                          canActivate: [registerPageGuard],
                      },
                  ]
                : []),
            {
                path: 'account-aktivieren/:uid/:token',
                loadComponent: () => import('../pages/activate-account/activate-account.component'),
            },
            {
                path: 'forgot-password',
                loadComponent: () => import('../pages/forgot-password/forgot-password.page'),
            },
            {
                path: 'reset-password/:uid/:token',
                loadComponent: () => import('../pages/reset-password/reset-password.page'),
            },
            {
                path: 'email-ändern/:uid/:token',
                loadComponent: () => import('../pages/email-change/email-change.page'),
            },
        ],
    },
    {
        path: '',
        component: MainLayout,
        children: [
            {
                path: 'umfrage',
                canActivate: [isLoggedInGuard()],
                loadChildren: () => import('../pages/questionnaire-page/questionnaire-page.routes'),
            },
            {
                path: 'tour',
                data: {
                    [QUESTIONNAIRE_PAGE_LEAVE_TEXT_OVERRIDE]: {
                        title: marker('questionnaire.leaveToTourTitle'),
                        question: marker('questionnaire.leaveToTourQuestion'),
                        yes: marker('questionnaire.leaveToTourYes'),
                    } satisfies Partial<ConfirmOptions>,
                    [QUESTIONNAIRE_PAGE_LEAVE_TEXT_OVERRIDE_CALENDAR]: {
                        title: marker('questionnaire.leaveToTourTitle'),
                        question: marker('questionnaire.leaveToTourQuestionCalendar'),
                        yes: marker('questionnaire.leaveToTourYes'),
                    } satisfies Partial<ConfirmOptions>,
                },
                loadComponent: () => import('../pages/tour/tour.page'),
            },
            {
                path: 'zofar-umfrage/:externalId',
                canActivate: [isLoggedInGuard()],

                loadComponent: () =>
                    import('../pages/zofar-from-external/zofar-from-external.page'),
            },
        ],
    },
    {
        path: '**',
        component: MainLayout,
        children: [
            {
                path: '',
                loadComponent: () => import('../pages/not-found/not-found.page'),
            },
        ],
    },
];
