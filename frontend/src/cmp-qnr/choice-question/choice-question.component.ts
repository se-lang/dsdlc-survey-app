import {
    ChangeDetectionStrategy,
    Component,
    computed,
    forwardRef,
    input,
    Signal,
} from '@angular/core';
import {
    QnrBaseChoiceOptionElementFragment,
    QnrMultipleChoiceQuestionElementFragment,
    QnrSingleChoiceOptionElementFragment,
    QnrSingleChoiceQuestionElementFragment,
} from '../../generated/graphql';
import { QnrElementChildrenComponent } from '../../qnr-render/qnr-element-children/qnr-element-children.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { qnrFormControl } from '../../services/qnr/qnr-form';
import { QnrElementsComponent } from '../../qnr-render/qnr-elements/qnr-elements.component';
import { frontendConfig } from '../../frontend-config';
import {
    CHOICE_OPTION_COMPONENT_CONTEXT,
    ChoiceOptionComponentContext,
} from '../choice-option/choice-option.component';
import {
    QnrFormControlType,
    QuestionnaireContext,
} from '../../services/qnr/questionnaire-service-interface';

@Component({
    selector: 'lla-choice-question',
    imports: [QnrElementChildrenComponent, ReactiveFormsModule, QnrElementsComponent],
    templateUrl: './choice-question.component.html',
    styleUrl: './choice-question.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: CHOICE_OPTION_COMPONENT_CONTEXT,
            useExisting: forwardRef(() => ChoiceQuestionComponent),
        },
    ],
})
export class ChoiceQuestionComponent implements ChoiceOptionComponentContext {
    readonly context = input.required<QuestionnaireContext>();
    readonly element = input.required<
        QnrSingleChoiceQuestionElementFragment | QnrMultipleChoiceQuestionElementFragment
    >();
    protected readonly options: Signal<QnrBaseChoiceOptionElementFragment[]> = computed(() => {
        const element = this.element();
        const context = this.context();
        return element.optionIds
            .map((childId) => {
                const child = context.element(childId);
                if (child?.types.includes('QnrChoiceOptionElement')) {
                    return child as QnrBaseChoiceOptionElementFragment;
                } else {
                    return null;
                }
            })
            .filter((v) => v != null);
    });
    readonly #isSingleChoice = computed(() => {
        return this.element().types.includes('QnrSingleChoiceQuestionElement');
    });

    readonly useButtons = computed(() => {
        const options = this.options();
        if (!this.#isSingleChoice()) {
            return options.length > 1 && options.length <= frontendConfig.choiceQuestionButtonLimit;
        } else {
            return options.length <= frontendConfig.choiceQuestionButtonLimit;
        }
    });

    protected readonly allowButtonColumns = computed(() => {
        const options = this.options();
        return !options.some((option) => option.attachedOpenQuestionIds.length !== 0);
    });

    protected readonly style = computed(() => {
        return this.#isSingleChoice()
            ? (this.element() as QnrSingleChoiceQuestionElementFragment).style
            : null;
    });

    readonly #formControlSignal = computed(() => {
        if (this.#isSingleChoice()) {
            return qnrFormControl(
                this.element as Signal<QnrSingleChoiceQuestionElementFragment>,
                this.context,
            );
        } else {
            return null;
        }
    });
    readonly formControl = computed(() => {
        return this.#formControlSignal()?.();
    });

    readonly singleChoiceFormControlName = computed(() => {
        if (this.#isSingleChoice()) {
            return (this.element() as QnrSingleChoiceQuestionElementFragment).formControlId;
        } else {
            return null;
        }
    });

    protected readonly pageForm = computed(() => this.context().formId);

    get singleChoiceFormControl(): Signal<FormControl<QnrFormControlType> | null | undefined> {
        return this.formControl;
    }

    protected singleChoiceOptionFormValue(element: QnrBaseChoiceOptionElementFragment) {
        return (element as QnrSingleChoiceOptionElementFragment).formValue;
    }
}
