import { ChangeDetectionStrategy, Component, computed, forwardRef, input } from '@angular/core';
import { QnrDoubleMatrixQuestionPartElementFragment } from '../../generated/graphql';
import { uniqueComponentId } from '../../util/unique-component-id';
import { QnrElementChildrenComponent } from '../../qnr-render/qnr-element-children/qnr-element-children.component';
import {
    CHOICE_OPTION_COMPONENT_CONTEXT,
    ChoiceOptionComponentContext,
} from '../choice-option/choice-option.component';
import { qnrFormControl } from '../../services/qnr/qnr-form';

import { QuestionnaireContext } from '../../services/qnr/questionnaire-service-interface';

@Component({
    selector: 'lla-matrix-question-double-part',
    imports: [QnrElementChildrenComponent],
    templateUrl: './matrix-question-double-part.component.html',
    styleUrl: './matrix-question-double-part.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: CHOICE_OPTION_COMPONENT_CONTEXT,
            useExisting: forwardRef(() => MatrixQuestionDoublePartComponent),
        },
    ],
})
export class MatrixQuestionDoublePartComponent implements ChoiceOptionComponentContext {
    readonly element = input.required<QnrDoubleMatrixQuestionPartElementFragment>();
    readonly context = input.required<QuestionnaireContext>();

    protected readonly headingId = uniqueComponentId('heading');

    readonly singleChoiceFormControl = qnrFormControl(this.element, this.context);
    readonly singleChoiceFormControlName = computed(() => {
        return this.element().formControlId;
    });
}
