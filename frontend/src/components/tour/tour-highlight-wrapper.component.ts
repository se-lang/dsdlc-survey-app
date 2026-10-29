import { ChangeDetectionStrategy, Component, input, TemplateRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

@Component({
    selector: 'lla-tour-highlight-wrapper',
    imports: [NgTemplateOutlet],
    template: `<ng-container *ngTemplateOutlet="template()" />
        <div class="lla-tour-highlight-element" [attr.data-lla-tour]="identifier()"></div>`,
    host: {
        class: 'lla-tour-highlight-container',
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TourHighlightWrapperComponent {
    readonly template = input.required<TemplateRef<unknown>>();
    readonly identifier = input<string>();
}
