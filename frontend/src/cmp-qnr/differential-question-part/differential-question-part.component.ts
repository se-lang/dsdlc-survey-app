import { ChangeDetectionStrategy, Component, computed, forwardRef, input } from '@angular/core';
import {
    QnrBaseChoiceOptionElementFragment,
    QnrDifferentialQuestionPartElementFragment,
} from '../../generated/graphql';
import {
    CHOICE_OPTION_COMPONENT_CONTEXT,
    ChoiceOptionComponentContext,
} from '../choice-option/choice-option.component';
import { qnrFormControl } from '../../services/qnr/qnr-form';
import { QnrElementComponent } from '../../qnr-render/qnr-element/qnr-element.component';
import { uniqueComponentId } from '../../util/unique-component-id';
import { QuestionnaireContext } from '../../services/qnr/questionnaire-service-interface';

@Component({
    selector: 'lla-differential-question-part',
    imports: [QnrElementComponent],
    templateUrl: './differential-question-part.component.html',
    styleUrl: './differential-question-part.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: CHOICE_OPTION_COMPONENT_CONTEXT,
            useExisting: forwardRef(() => DifferentialQuestionPartComponent),
        },
    ],
})
export class DifferentialQuestionPartComponent implements ChoiceOptionComponentContext {
    readonly element = input.required<QnrDifferentialQuestionPartElementFragment>();
    readonly context = input.required<QuestionnaireContext>();

    protected readonly firstChoiceId = uniqueComponentId();
    protected readonly lastChoiceId = uniqueComponentId();

    protected readonly firstChoiceElement = computed(() => {
        return this.#extractChoice(0);
    });
    protected readonly lastChoiceElement = computed(() => {
        return this.#extractChoice(-1);
    });

    readonly idLookup = computed(() => {
        const map = new Map<string, string>();
        const firstElement = this.firstChoiceElement();
        if (firstElement != null) {
            map.set(firstElement.id, this.firstChoiceId);
        }
        const lastElement = this.lastChoiceElement();
        if (lastElement != null) {
            map.set(lastElement.id, this.lastChoiceId);
        }
        return map;
    });
    readonly hiddenLabels = () => true;
    readonly singleChoiceFormControl = qnrFormControl(this.element, this.context);
    readonly singleChoiceFormControlName = computed(() => {
        return this.element().formControlId;
    });

    #extractChoice(index: number): QnrBaseChoiceOptionElementFragment | null {
        const element = this.element();
        const context = this.context();
        const childId = element.childrenIds.at(index);
        if (childId == null) {
            console.warn('DifferentialQuestionPart has no children!', element);
            return null;
        }
        const child = context.element(childId);
        if (!child?.types.includes('QnrChoiceOptionElement')) {
            console.warn(
                'DifferentialQuestionPart element not found or invalid at index',
                index,
                element,
                child,
            );
            return null;
        }
        return child as QnrBaseChoiceOptionElementFragment;
    }

    protected trackChildId(childId: string): string {
        return childId;
    }
}
