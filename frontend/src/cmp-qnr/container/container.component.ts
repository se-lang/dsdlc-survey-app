import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { QnrParentElementFragment } from '../../generated/graphql';
import { QnrElementChildrenComponent } from '../../qnr-render/qnr-element-children/qnr-element-children.component';

@Component({
    selector: 'lla-qnr-container',
    imports: [QnrElementChildrenComponent],
    template: ` <lla-qnr-element-children [parentElement]="element()" />`,
    styles: `
        :host {
            display: block;
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContainerComponent {
    readonly element = input.required<QnrParentElementFragment>();
}
