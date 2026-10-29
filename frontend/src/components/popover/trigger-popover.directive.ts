import { Directive, effect, ElementRef, inject, input } from '@angular/core';
import { PopoverAction, PopoverDirective } from './popover.directive';

@Directive({
    selector: '[llaTriggerPopover]',
    host: {
        '[attr.popovertargetaction]': 'popoverAction()',
    },
})
export class TriggerPopoverDirective {
    readonly popover = input.required<PopoverDirective>({
        alias: 'llaTriggerPopover',
    });
    readonly popoverAction = input<PopoverAction>('show');

    constructor() {
        const hostElement = inject(ElementRef).nativeElement as unknown;
        if (!(hostElement instanceof HTMLButtonElement)) {
            throw new Error('Only buttons can be popover triggers');
        }
        effect((onCleanup) => {
            onCleanup(this.popover().bindToButton(hostElement, this.popoverAction));
        });
    }
}
