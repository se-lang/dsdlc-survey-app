import {
    ChangeDetectionStrategy,
    Component,
    inject,
    input,
    Signal,
    signal,
    TemplateRef,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { PopoverDirective, PopoverHorizontalPosition } from './popover.directive';

@Component({
    selector: 'lla-native-popover-content',
    imports: [NgTemplateOutlet],
    template: ` <ng-container *ngTemplateOutlet="showContent() ? template() : null" />`,
    styles: `
        :host {
            display: block;
            inset: auto;
            margin: 0;
            top: anchor(bottom);
            // We currently don't position-try, because we the arrow of the popover doesn't flip
            // if needed, a solution for that will have to be found.
            position-try: normal flip-block;
        }

        :host.popover-h-position-mouse {
            left: calc(anchor(left) + var(--popover-x-offset));
            transform: translateX(-50%);
        }

        :host.popover-h-position-center {
            justify-self: anchor-center;
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[attr.popover]': '"auto"',
        '[style.--popover-x-offset]': 'xOffset().toFixed(2) + "px"',
        '[class]': '"popover-h-position-" + horizontalPosition()',
        '(beforetoggle)': 'beforeToggle($event)',
        '(transitionend)': 'transitionEnd()',
        '(transitioncancel)': 'transitionEnd()',
    },
})
export class NativePopoverContentComponent {
    readonly template = input.required<TemplateRef<unknown>>();
    readonly horizontalPosition: Signal<PopoverHorizontalPosition>;

    readonly xOffset = input(0);

    #open = false;
    protected readonly showContent = signal(false);

    constructor() {
        const dir = inject(PopoverDirective);
        this.horizontalPosition = dir.horizontalPosition;
    }

    protected beforeToggle(event: ToggleEvent) {
        if (event.newState === 'open') {
            this.showContent.set(true);
        }
        this.#open = event.newState === 'open';
    }

    protected transitionEnd() {
        if (!this.#open) {
            this.showContent.set(false);
        }
    }
}
