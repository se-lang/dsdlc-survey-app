import {
    ChangeDetectionStrategy,
    Component,
    computed,
    forwardRef,
    inject,
    input,
    Signal,
} from '@angular/core';
import {
    QnrBaseChoiceOptionElementFragment,
    QnrMatrixQuestionCategoryElementFragment,
    QnrOpenQuestionElementFragment,
    QnrSingleChoiceMatrixQuestionCategoryElementFragment,
    QnrSingleChoiceOptionElementFragment,
} from '../../generated/graphql';
import {
    CHOICE_OPTION_COMPONENT_CONTEXT,
    ChoiceOptionComponentContext,
} from '../choice-option/choice-option.component';
import { qnrFormControl } from '../../services/qnr/qnr-form';
import { uniqueComponentId } from '../../util/unique-component-id';
import { QnrElementChildrenComponent } from '../../qnr-render/qnr-element-children/qnr-element-children.component';
import { OpenQuestionComponent } from '../open-question/open-question.component';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { delay, filter, pairwise, startWith, switchMap, take } from 'rxjs';
import { MatrixQuestionComponent } from '../matrix-question/matrix-question.component';
import { QuestionnaireContext } from '../../services/qnr/questionnaire-service-interface';
import { ReactiveFormsModule } from '@angular/forms';
import { NgTemplateOutlet } from '@angular/common';

@Component({
    selector: 'lla-matrix-question-category',
    imports: [
        QnrElementChildrenComponent,
        OpenQuestionComponent,
        ReactiveFormsModule,
        NgTemplateOutlet,
    ],
    templateUrl: './matrix-question-category.component.html',
    styleUrl: './matrix-question-category.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: CHOICE_OPTION_COMPONENT_CONTEXT,
            useExisting: forwardRef(() => MatrixQuestionCategoryComponent),
        },
    ],
    host: {
        '[class.is-double-matrix]': 'isDoubleMatrix()',
    },
})
export class MatrixQuestionCategoryComponent implements ChoiceOptionComponentContext {
    readonly context = input.required<QuestionnaireContext>();
    readonly element = input.required<
        | QnrMatrixQuestionCategoryElementFragment
        | QnrSingleChoiceMatrixQuestionCategoryElementFragment
    >();

    protected readonly customLabelElement = computed(() => {
        const element = this.element();
        if (element.customLabelElementId != null) {
            const context = this.context();
            const labelElement = context.element(element.customLabelElementId);
            if (labelElement == null || !labelElement.types.includes('QnrOpenQuestionElement')) {
                console.warn(
                    'customLabelElementId for matrix question is an invalid element',
                    labelElement,
                    element.customLabelElementId,
                );
                return null;
            } else {
                return labelElement as QnrOpenQuestionElementFragment;
            }
        } else {
            return null;
        }
    });

    protected readonly headingId = uniqueComponentId('heading');

    readonly #isSingleChoice = computed(() => {
        return this.element().types.includes('QnrSingleChoiceMatrixQuestionCategoryElement');
    });
    protected readonly isOpen = computed(() => {
        return this.element().types.includes('QnrOpenMatrixQuestionCategoryElement');
    });
    protected readonly isDoubleMatrix = computed(() => {
        return this.element().types.includes('QnrDoubleMatrixQuestionCategoryElement');
    });

    readonly #formControlSignal = computed(() => {
        if (this.#isSingleChoice()) {
            return qnrFormControl(
                this.element as Signal<QnrSingleChoiceMatrixQuestionCategoryElementFragment>,
                this.context,
            );
        } else {
            return null;
        }
    });
    readonly singleChoiceFormControl = computed(() => {
        return this.#formControlSignal()?.();
    });

    readonly singleChoiceFormControlName = computed(() => {
        if (this.#isSingleChoice()) {
            return (this.element() as QnrSingleChoiceMatrixQuestionCategoryElementFragment)
                .formControlId;
        } else {
            return null;
        }
    });

    protected readonly pageForm = computed(() => this.context().formId);

    protected readonly selectOptions: Signal<QnrBaseChoiceOptionElementFragment[] | null> =
        computed(() => {
            if (!this.#isSingleChoice()) {
                return null;
            }
            const element = this.element() as QnrSingleChoiceMatrixQuestionCategoryElementFragment;
            if (element.style !== 'SELECT') {
                return null;
            }
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

    constructor() {
        const parent = inject(MatrixQuestionComponent);
        toObservable(this.singleChoiceFormControl)
            .pipe(
                filter(Boolean),
                switchMap((fc) => fc.valueChanges.pipe(startWith(fc.value))),
                pairwise(),
                filter(([first, second]) => first == null && second != null),
                take(1),
                delay(450),
                takeUntilDestroyed(),
            )
            .subscribe(() => {
                parent.autoSlideNext();
            });
    }

    protected singleChoiceOptionFormValue(element: QnrBaseChoiceOptionElementFragment) {
        return (element as QnrSingleChoiceOptionElementFragment).formValue;
    }
}
