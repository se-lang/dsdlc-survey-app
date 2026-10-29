import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { QnrElementsComponent } from '../qnr-elements/qnr-elements.component';

import { QuestionnaireContext } from '../../services/qnr/questionnaire-service-interface';

@Component({
    selector: 'lla-qnr-page-contents',
    imports: [QnrElementsComponent],
    templateUrl: './qnr-page-contents.component.html',
    styleUrl: './qnr-page-contents.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QnrPageContentsComponent {
    readonly context = input.required<QuestionnaireContext>();
}
