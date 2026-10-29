import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconDirective } from '../../icon/icon.directive';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
    selector: 'lla-tour-dialog-header',
    imports: [IconDirective, TranslocoPipe],
    templateUrl: './tour-dialog-header.component.html',
    styleUrl: './tour-dialog-header.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TourDialogHeaderComponent {
    readonly icon = input.required<string>();
    readonly title = input.required<string>();
}
