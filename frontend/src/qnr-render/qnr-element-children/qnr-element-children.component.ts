import { ChangeDetectionStrategy, Component, computed, input, Signal } from '@angular/core';
import { QnrElementsComponent } from '../qnr-elements/qnr-elements.component';
import { QnrParentElementFragment } from '../../generated/graphql';

@Component({
    selector: 'lla-qnr-element-children',
    imports: [QnrElementsComponent],
    styles: `
        :host {
            display: contents;
        }
    `,
    template: ` <lla-qnr-elements [elementIds]="childrenIds()" />`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QnrElementChildrenComponent {
    readonly parentElement = input.required<QnrParentElementFragment>();

    readonly childrenIds: Signal<readonly string[]> = computed(() => {
        const pe = this.parentElement();
        if ('childrenIds' in pe) {
            return pe.childrenIds;
        } else {
            console.warn('lla-qnr-element-children used outside parent element.');
            return [];
        }
    });
}
