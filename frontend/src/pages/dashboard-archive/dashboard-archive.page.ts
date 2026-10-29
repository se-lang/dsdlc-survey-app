import {
    ChangeDetectionStrategy,
    Component,
    effect,
    inject,
    Injector,
    signal,
} from '@angular/core';
import { QuestionnaireNewsGQL, QuestionnaireNewsOrder } from '../../generated/graphql';
import { rxResource } from '@angular/core/rxjs-interop';
import { withGraphqlGlobalLoading } from '../../services/global-loading.service';
import { IconDirective } from '../../components/icon/icon.directive';
import { TranslocoDirective } from '@jsverse/transloco';
import { DatePipe } from '../../locale/date.pipe';
import { RouterLink } from '@angular/router';
import { DashboardPage } from '../dashboard/dashboard.page';
import { marker } from '@jsverse/transloco-keys-manager/marker';

@Component({
    selector: 'lla-dashboard-archive',
    imports: [IconDirective, TranslocoDirective, DatePipe, RouterLink],
    templateUrl: './dashboard-archive.page.html',
    styleUrl: './dashboard-archive.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardArchivePage {
    readonly #injector = inject(Injector);
    readonly #newsGql = inject(QuestionnaireNewsGQL);

    readonly sortOption = signal<QuestionnaireNewsOrder>({
        date: 'ASC',
    });

    readonly #newsRef = this.#newsGql.watch(
        { filters: null, ordering: this.sortOption() },
        {
            notifyOnNetworkStatusChange: true,
            useInitialLoading: true,
            // necessary because of a bug in Apollo where it does not emit the refetched
            // data after every cache purge unless this is set.
            // see: https://github.com/apollographql/apollo-client/issues/12069
            // see https://github.com/apollographql/apollo-client/issues/12747
            // Fixed in Apollo 4.0 (currently RC), but we have to wait for Apollo Angular support.
            returnPartialData: true,
        },
    );
    protected readonly news = rxResource({
        stream: () =>
            this.#newsRef.valueChanges.pipe(withGraphqlGlobalLoading({ injector: this.#injector })),
    });

    constructor() {
        inject(DashboardPage).title.set(marker('archive.header'));

        effect(() => {
            this.#newsRef
                .setOptions({
                    variables: {
                        filters: null,
                        ordering: this.sortOption(),
                    },
                })
                .catch(() => {
                    console.error('Error setting options for news query');
                });
        });
    }
}
export default DashboardArchivePage;
