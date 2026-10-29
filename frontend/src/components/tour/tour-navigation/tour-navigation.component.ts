import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { TourControllerService } from '../../../services/tour/tour-controller.service';

@Component({
    selector: 'lla-tour-navigation',
    imports: [TranslocoDirective],
    templateUrl: './tour-navigation.component.html',
    styleUrl: './tour-navigation.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TourNavigationComponent {
    protected readonly controller = inject(TourControllerService);
}
