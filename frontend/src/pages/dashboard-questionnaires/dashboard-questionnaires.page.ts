import { ChangeDetectionStrategy, Component, computed, inject, Injector } from '@angular/core';
import { QuestionnairesGQL, RefreshQuestionnaireStatusGQL } from '../../generated/graphql';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { withGraphqlGlobalLoading } from '../../services/global-loading.service';
import { catchError, filter, map, of, switchMap, take } from 'rxjs';
import { DatePipe } from '../../locale/date.pipe';
import { IconDirective } from '../../components/icon/icon.directive';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { DashboardPage } from '../dashboard/dashboard.page';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { environment } from '../../environments/environment';

@Component({
    selector: 'lla-dashboard-questionnaires',
    imports: [DatePipe, IconDirective, RouterLink, TranslocoDirective],
    templateUrl: './dashboard-questionnaires.page.html',
    styleUrl: './dashboard-questionnaires.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardQuestionnairesPage {
    readonly #questionnairesGql = inject(QuestionnairesGQL);
    readonly #refreshQuestionnairesGql = inject(RefreshQuestionnaireStatusGQL);
    readonly #injector = inject(Injector);
    readonly #questionnairesRef = this.#questionnairesGql.watch(undefined, {
        notifyOnNetworkStatusChange: true,
        useInitialLoading: true,
        // necessary because of a bug in Apollo where it does not emit the refetched
        // data after every cache purge unless this is set.
        // see: https://github.com/apollographql/apollo-client/issues/12069
        // see https://github.com/apollographql/apollo-client/issues/12747
        // Fixed in Apollo 4.0 (currently RC), but we have to wait for Apollo Angular support.
        returnPartialData: true,
    });
    protected readonly questionnaires = rxResource({
        stream: () =>
            this.#questionnairesRef.valueChanges.pipe(
                withGraphqlGlobalLoading({ injector: this.#injector }),
            ),
    });

    protected readonly visibleQuestionnaires = computed(() => {
        return this.questionnaires.value()?.questionnaires.results.filter((q) => !q.status.hidden);
    });

    constructor() {
        inject(DashboardPage).title.set(marker('dashboard.header'));

        this.#questionnairesRef.valueChanges
            .pipe(
                filter((v) => !v.loading && !v.partial),
                map((v) => v.data),
                filter(Boolean),
                take(1),
                switchMap((questionnaires) => {
                    const ids = questionnaires.questionnaires.results.map(
                        ({ status: { id } }) => id,
                    );
                    if (ids.length !== 0) {
                        return this.#refreshQuestionnairesGql
                            .mutate({
                                statusIds: ids,
                            })
                            .pipe(
                                catchError((err: unknown) => {
                                    console.error(
                                        'Failed to refresh questionnaire status for dashboard',
                                        err,
                                    );
                                    return of();
                                }),
                            );
                    } else {
                        return of();
                    }
                }),
                takeUntilDestroyed(),
            )
            .subscribe();
    }

    protected readonly environment = environment;
}

export default DashboardQuestionnairesPage;
