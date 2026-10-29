import {
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    ElementRef,
    inject,
    Injector,
} from '@angular/core';
import { DialogComponent } from '../../dialog/dialog/dialog.component';
import { DialogHeaderComponent } from '../../dialog/dialog-header/dialog-header.component';
import { DialogFooterComponent } from '../../dialog/dialog-footer/dialog-footer.component';
import { TourControllerService } from '../../../services/tour/tour-controller.service';
import { DialogContentComponent } from '../../dialog/dialog-content/dialog-content.component';
import { TranslocoDirective } from '@jsverse/transloco';
import { i18nCompute } from '../../../services/i18n/i18n.utils';
import { NgComponentOutlet } from '@angular/common';
import { SimpleTourStepComponent } from '../simple-tour-step/simple-tour-step.component';
import { TourDialogHeaderComponent } from '../tour-dialog-header/tour-dialog-header.component';
import { ViewportService } from '../../../services/viewport.service';
import { TourNavigationComponent } from '../tour-navigation/tour-navigation.component';
import { TourPositionsService } from '../../../services/tour/tour-positions.service';

@Component({
    selector: 'lla-tour-dialog',
    imports: [
        DialogComponent,
        DialogHeaderComponent,
        DialogFooterComponent,
        DialogContentComponent,
        TranslocoDirective,
        NgComponentOutlet,
        TourDialogHeaderComponent,
        TourNavigationComponent,
    ],
    templateUrl: './tour-dialog.component.html',
    styleUrl: './tour-dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        // '[style.--lla-tour-dialog-inset-desktop]': 'positions.dialogPosition().inset',
        // '[style.--lla-tour-dialog-margin-desktop]': 'positions.dialogPosition().margin',
    },
})
export class TourDialogComponent {
    protected readonly viewport = inject(ViewportService);
    protected readonly controller = inject(TourControllerService);
    protected readonly positions = inject(TourPositionsService);

    protected readonly progressWidthCss = computed(() => {
        return (
            String(
                ((this.controller.currentStepAnimated() + 1) / this.controller.totalSteps()) * 100,
            ) + '%'
        );
    });

    readonly #formatter = i18nCompute((t) => new Intl.NumberFormat(t.getActiveLang()));
    protected readonly formattedStep = computed(() =>
        this.#formatter().format(this.controller.currentStepIndex() + 1),
    );
    protected readonly formattedTotalSteps = computed(() =>
        this.#formatter().format(this.controller.totalSteps()),
    );

    protected readonly contentComponent = computed(() => {
        const step = this.controller.currentStep();
        if (typeof step.content === 'string') {
            return {
                component: SimpleTourStepComponent,
                inputs: {
                    content: step.content,
                },
            };
        } else {
            return step.content;
        }
    });

    constructor() {
        const destroyRef = inject(DestroyRef);

        inject(TourPositionsService).startUpdate(
            inject<ElementRef<HTMLElement>>(ElementRef).nativeElement,
            inject(Injector),
        );

        destroyRef.onDestroy(() => {
            console.log('Tour Dialog destroyed');
        });
    }
}
