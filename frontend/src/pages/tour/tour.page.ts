import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    effect,
    inject,
    untracked,
    viewChild,
} from '@angular/core';
import { QnrPageComponent } from '../../qnr-render/qnr-page/qnr-page.component';
import { provideCoreQnrComponents } from '../../cmp-qnr/core-qnr-components';
import { provideZofarComponents } from '../../cmp-zf/zf-qnr-components';
import { provideQnrComponentLookup } from '../../services/qnr/qnr-components';
import { registerCurrentQnr } from '../../services/qnr/global-qnr-access';
import { provideTourServices } from '../../services/tour/tour-services';
import { BackdropSvgComponent } from '../../components/tour/backdrop-svg/backdrop-svg.component';
import { CdkPortal, DomPortalOutlet, PortalOutlet } from '@angular/cdk/portal';
import { TourDialogComponent } from '../../components/tour/tour-dialog/tour-dialog.component';
import { MarkTourSeenGQL } from '../../generated/graphql';

@Component({
    selector: 'lla-tour',
    imports: [QnrPageComponent, BackdropSvgComponent, CdkPortal, TourDialogComponent],
    templateUrl: './tour.page.html',
    styleUrl: './tour.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideCoreQnrComponents(),
        provideZofarComponents(),
        provideQnrComponentLookup(),
        provideTourServices(),
    ],
})
export class TourPage {
    readonly #markTourSeenGql = inject(MarkTourSeenGQL);
    protected readonly bodyPortalOutlet: PortalOutlet;
    protected readonly portalContent = viewChild.required<CdkPortal>('portalContent');

    constructor() {
        const globalTourElementHost = document.createElement('div');
        document.body.appendChild(globalTourElementHost);
        this.bodyPortalOutlet = new DomPortalOutlet(globalTourElementHost);
        inject(DestroyRef).onDestroy(() => this.bodyPortalOutlet.dispose());

        effect((onCleanup) => {
            untracked(() => void this.bodyPortalOutlet.attach(this.portalContent()));
            onCleanup(() => {
                this.bodyPortalOutlet.detach();
            });
        });

        registerCurrentQnr();

        this.#markTourSeenGql.mutate().subscribe({
            error: (err: unknown) => console.error('Failed to mark tour as seen', err),
        });
    }
}

export default TourPage;
