import { ChangeDetectionStrategy, Component, inject, Injector } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { IconDirective } from '../icon/icon.directive';
import {
    QuestionnaireNewsBaseFragment,
    QuestionnaireNewsFilter,
    QuestionnaireNewsGQL,
} from '../../generated/graphql';
import { rxResource } from '@angular/core/rxjs-interop';
import { withGraphqlGlobalLoading } from '../../services/global-loading.service';
import { map } from 'rxjs';
import { RouterLink } from '@angular/router';
import { QnrNewsService } from '../../services/qnr/qnr-news.service';
import { uniqueComponentId } from '../../util/unique-component-id';

function isNewsDetail(
    n: QuestionnaireNewsBaseFragment | null | undefined,
): n is QuestionnaireNewsBaseFragment {
    return n != null;
}

@Component({
    selector: 'lla-news-info-bar',
    imports: [TranslocoDirective, IconDirective, RouterLink],
    templateUrl: './news-info-bar.component.html',
    styleUrl: './news-info-bar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsInfoBarComponent {
    readonly #injector = inject(Injector);
    readonly #lastNewsGql = inject(QuestionnaireNewsGQL);
    readonly qnrNewsService = inject(QnrNewsService);

    readonly nameId = uniqueComponentId();

    private readonly defaultFilter: QuestionnaireNewsFilter = {
        seen: false,
        expired: false,
    };

    readonly #lastNewsRef = this.#lastNewsGql.watch(
        { filters: this.defaultFilter, ordering: [] },
        {
            notifyOnNetworkStatusChange: true,
            useInitialLoading: true,
            fetchPolicy: 'cache-and-network',
            // necessary because of a bug in Apollo where it does not emit the refetched
            // data after every cache purge unless this is set.
            // see: https://github.com/apollographql/apollo-client/issues/12069
            // see https://github.com/apollographql/apollo-client/issues/12747
            // Fixed in Apollo 4.0 (currently RC), but we have to wait for Apollo Angular support.
            returnPartialData: true,
        },
    );

    protected readonly lastNews = rxResource<QuestionnaireNewsBaseFragment | undefined, unknown>({
        stream: () =>
            this.#lastNewsRef.valueChanges.pipe(
                withGraphqlGlobalLoading({ injector: this.#injector }),
                map(
                    (data) =>
                        data.questionnaireNews.filter((n) => isNewsDetail(n)).at(-1) ?? undefined,
                ),
            ),
    });
}

export default NewsInfoBarComponent;
