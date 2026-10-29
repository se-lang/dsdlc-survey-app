import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { QnrDifferentialQuestionElementFragment } from '../../generated/graphql';
import { QnrElementChildrenComponent } from '../../qnr-render/qnr-element-children/qnr-element-children.component';
import { QnrElementComponent } from '../../qnr-render/qnr-element/qnr-element.component';

@Component({
    selector: 'lla-differential-question',
    imports: [QnrElementChildrenComponent, QnrElementComponent],
    templateUrl: './differential-question.component.html',
    styleUrl: './differential-question.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DifferentialQuestionComponent {
    readonly element = input.required<QnrDifferentialQuestionElementFragment>();

    protected trackPartId(partId: string): string {
        return partId;
    }
}
