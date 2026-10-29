import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FindQuestionnaireFromExternalGQL } from '../../generated/graphql';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap, take } from 'rxjs';
import { checkNotNull } from '../../util/checks';
import { withGlobalLoading } from '../../services/global-loading.service';

@Component({
    selector: 'lla-zofar-from-external',
    imports: [],
    templateUrl: './zofar-from-external.page.html',
    styleUrl: './zofar-from-external.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZofarFromExternalPage {
    constructor() {
        const activatedRoute = inject(ActivatedRoute);
        const findGql = inject(FindQuestionnaireFromExternalGQL);
        const router = inject(Router);
        activatedRoute.paramMap
            .pipe(
                map((params) => checkNotNull(params.get('externalId'))),
                take(1),
                switchMap((externalId) => findGql.fetch({ externalId })),
                switchMap(async (result) => {
                    if (result.data.zofarLookupExternalQuestionnaireId == null) {
                        await router.navigate(['/404'], {
                            skipLocationChange: true,
                        });
                    } else {
                        await router.navigate(
                            ['/umfrage', result.data.zofarLookupExternalQuestionnaireId],
                            {
                                replaceUrl: true,
                            },
                        );
                    }
                }),
                withGlobalLoading(),
            )
            .subscribe({
                error: (err: unknown) =>
                    console.error('Zofar from external navigation failed', err),
            });
    }
}

export default ZofarFromExternalPage;
