import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { QnrElementComponent } from '../qnr-element/qnr-element.component';

@Component({
    selector: 'lla-qnr-elements',
    imports: [QnrElementComponent],
    template: `
        @for (elementId of elementIds(); track trackElementId(elementId)) {
            <lla-qnr-element [elementId]="elementId" />
        }
    `,
    styles: `
        :host {
            display: contents;
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QnrElementsComponent {
    readonly elementIds = input.required<readonly string[]>();

    protected trackElementId(id: string): string {
        // disable bogus NG0956: https://github.com/angular/angular/issues/56471
        return id;
    }
}
