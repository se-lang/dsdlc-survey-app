import { ChangeDetectionStrategy, Component, inject, Injector } from '@angular/core';
import { QuestionnaireFilesGQL } from '../../generated/graphql';
import { rxResource } from '@angular/core/rxjs-interop';
import { withGraphqlGlobalLoading } from '../../services/global-loading.service';
import { IconDirective } from '../../components/icon/icon.directive';
import { DashboardPage } from '../dashboard/dashboard.page';
import { marker } from '@jsverse/transloco-keys-manager/marker';

@Component({
    selector: 'lla-dashboard-files',
    imports: [IconDirective],
    templateUrl: './dashboard-files.page.html',
    styleUrl: './dashboard-files.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardFilesPage {
    readonly #injector = inject(Injector);
    readonly #filesGql = inject(QuestionnaireFilesGQL);

    readonly #filesRef = this.#filesGql.watch(
        {
            filters: {
                type: 'FILE',
            },
        },
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
    protected readonly files = rxResource({
        stream: () =>
            this.#filesRef.valueChanges.pipe(
                withGraphqlGlobalLoading({ injector: this.#injector }),
            ),
    });

    constructor() {
        inject(DashboardPage).title.set(marker('dashboardFiles.header'));
    }
}

export default DashboardFilesPage;
