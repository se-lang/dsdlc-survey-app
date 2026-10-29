import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TourPositionsService } from '../../../services/tour/tour-positions.service';
import { uniqueComponentId } from '../../../util/unique-component-id';

@Component({
    selector: 'lla-backdrop-svg',
    imports: [],
    templateUrl: './backdrop-svg.component.html',
    styleUrl: './backdrop-svg.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackdropSvgComponent {
    protected readonly positions = inject(TourPositionsService);
    protected readonly componentId = uniqueComponentId();
}
