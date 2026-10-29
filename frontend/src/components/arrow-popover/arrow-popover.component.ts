import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconDirective } from '../icon/icon.directive';
import { popoverHandle } from '../popover/popover.interface';

@Component({
    selector: 'lla-arrow-popover',
    imports: [IconDirective],
    templateUrl: './arrow-popover.component.html',
    styleUrl: './arrow-popover.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class]': '"placement--" + this.popover.placement()',
    },
})
export class ArrowPopoverComponent {
    readonly closeButton = input(true, {
        transform: booleanAttribute,
    });

    protected readonly popover = popoverHandle();

    protected close() {
        this.popover.close();
    }
}
