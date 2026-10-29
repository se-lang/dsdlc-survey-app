import { ChangeDetectionStrategy, Component, effect, inject, Injector, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { withGraphqlGlobalLoading } from '../../services/global-loading.service';
import { DatePipe } from '../../locale/date.pipe';
import { QuestionnaireNewsDetailFragment, QuestionnaireNewsNodeGQL } from '../../generated/graphql';
import { filter, map, switchMap } from 'rxjs';
import { TranslocoDirective } from '@jsverse/transloco';
import { QnrNewsService } from '../../services/qnr/qnr-news.service';
import { DashboardPage } from '../dashboard/dashboard.page';
import { marker } from '@jsverse/transloco-keys-manager/marker';

@Component({
    selector: 'lla-dashboard-news-detail',
    imports: [DatePipe, TranslocoDirective],
    templateUrl: './dashboard-news-detail.page.html',
    styleUrl: './dashboard-news-detail.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardNewsDetailPage {
    readonly uid = input.required<string>();
    readonly #injector = inject(Injector);
    readonly qnrNewsService = inject(QnrNewsService);
    readonly #newsDetailGql = inject(QuestionnaireNewsNodeGQL);

    readonly newsDetail = toSignal(
        toObservable(this.uid, { injector: this.#injector }).pipe(
            switchMap((id) => this.#newsDetailGql.watch({ nodeId: id }).valueChanges),
            withGraphqlGlobalLoading({ injector: this.#injector }),
            map((r) => r.node),
            filter(
                (n): n is QuestionnaireNewsDetailFragment =>
                    n != null && n.__typename === 'QuestionnaireNews',
            ),
        ),
        { initialValue: undefined },
    );

    constructor() {
        inject(DashboardPage).title.set(marker('archive.header'));
        effect(
            () => {
                const detail = this.newsDetail();
                if (detail && !detail.seen) {
                    this.qnrNewsService.markAsSeen(detail.id);
                }
            },
            { injector: this.#injector },
        );
    }
}
export default DashboardNewsDetailPage;
