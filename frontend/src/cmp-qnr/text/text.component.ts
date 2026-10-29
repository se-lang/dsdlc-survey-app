import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { QnrTextElementFragment } from '../../generated/graphql';

@Component({
    selector: 'lla-qnr-text',
    imports: [],
    template: `{{ element().text }}`,
    styles: `
        :host {
            font-size: var(--lla-text-flow-font-size);
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextComponent {
    readonly element = input.required<QnrTextElementFragment>();
}
