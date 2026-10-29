import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    InjectionToken,
    Injector,
    input,
    Signal,
    untracked,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    QnrBaseChoiceOptionElementFragment,
    QnrMultipleChoiceOptionElementFragment,
    QnrSingleChoiceOptionElementFragment,
} from '../../generated/graphql';
import { uniqueComponentId } from '../../util/unique-component-id';
import { NgTemplateOutlet } from '@angular/common';
import { qnrFormControl } from '../../services/qnr/qnr-form';
import { QnrElementsComponent } from '../../qnr-render/qnr-elements/qnr-elements.component';
import { QuestionnaireContext } from '../../services/qnr/questionnaire-service-interface';
import {
    OPEN_QUESTION_CONTEXT,
    OpenQuestionContext,
} from '../open-question/open-question.component';
import { filter, map, Observable, startWith, switchMap } from 'rxjs';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

export interface ChoiceOptionComponentContext {
    readonly useButtons?: () => boolean;
    readonly hiddenLabels?: () => boolean;
    readonly idLookup?: () => ReadonlyMap<string, string>;
    readonly singleChoiceFormControl: Signal<FormControl | null | undefined>;
    readonly singleChoiceFormControlName: Signal<string | null | undefined>;
}

export const CHOICE_OPTION_COMPONENT_CONTEXT = new InjectionToken<ChoiceOptionComponentContext>(
    'CHOICE_OPTION_COMPONENT_CONTEXT',
);

@Component({
    selector: 'lla-choice-option',
    imports: [FormsModule, ReactiveFormsModule, NgTemplateOutlet, QnrElementsComponent],
    templateUrl: './choice-option.component.html',
    styleUrl: './choice-option.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: OPEN_QUESTION_CONTEXT,
            useFactory: () => {
                const choiceOptionComponent = inject(ChoiceOptionComponent);
                return {
                    focus: choiceOptionComponent.focusOpenQuestion,
                    onInput: (id) => choiceOptionComponent.onNestedOpenQuestionInput(id),
                } satisfies OpenQuestionContext;
            },
        },
    ],
})
export class ChoiceOptionComponent {
    readonly element = input.required<
        QnrSingleChoiceOptionElementFragment | QnrMultipleChoiceOptionElementFragment
    >();
    readonly context = input.required<QuestionnaireContext>();

    protected readonly isSingleChoice = computed(() => {
        return this.element().types.includes('QnrSingleChoiceOptionElement');
    });

    readonly focusOpenQuestion: Observable<string>;

    readonly #choiceOptionContext = inject(CHOICE_OPTION_COMPONENT_CONTEXT, { optional: true });

    protected readonly formControlName = computed(() => {
        if (this.isSingleChoice()) {
            return this.#choiceOptionContext?.singleChoiceFormControlName();
        }
        return null;
    });

    #formControlSignal = computed(() => {
        return this.isSingleChoice()
            ? this.#choiceOptionContext?.singleChoiceFormControl
            : qnrFormControl(
                  this.element as Signal<QnrMultipleChoiceOptionElementFragment>,
                  this.context,
              );
    });

    protected readonly formControl = computed(() => {
        return this.#formControlSignal()?.() ?? null;
    });

    protected readonly defaultElementId = uniqueComponentId();
    protected readonly overriddenElementId: () => string | null | undefined;
    protected readonly pageForm = computed(() => this.context().formId);
    protected readonly useButtons: () => boolean;
    protected readonly hiddenLabels: () => boolean;

    onNestedOpenQuestionInput(openQuestionId: string) {
        const element = untracked(this.element);
        if (element.attachedOpenQuestionIds.includes(openQuestionId)) {
            const formControl = untracked(this.formControl);
            if (formControl != null) {
                const newValue = 'formValue' in element ? element.formValue : true;
                // Do not emit the event so that we don't think the user changed the form value
                // and focus the first attached open question again
                formControl.setValue(newValue, { emitEvent: false });
            }
        }
    }

    constructor() {
        const injector = inject(Injector);
        this.focusOpenQuestion = toObservable(this.element).pipe(
            map((element) => {
                return {
                    attachedOpenIdToFocus: element.attachedOpenQuestionIds.at(0),
                    expectedFormValue: 'formValue' in element ? element.formValue : null,
                };
            }),
            filter(
                (v): v is { attachedOpenIdToFocus: string; expectedFormValue: string | null } =>
                    !!v.attachedOpenIdToFocus,
            ),
            switchMap(({ attachedOpenIdToFocus, expectedFormValue }) => {
                return toObservable(this.formControl, { injector }).pipe(
                    filter(Boolean),
                    switchMap((fc) => {
                        return fc.valueChanges.pipe(startWith(fc.value));
                    }),
                    filter(
                        (formValue) =>
                            expectedFormValue === null || formValue === expectedFormValue,
                    ),
                    filter(Boolean),
                    map(() => attachedOpenIdToFocus),
                );
            }),
            takeUntilDestroyed(),
        );

        if (this.#choiceOptionContext == null) {
            this.useButtons = () => false;
            this.hiddenLabels = () => false;
            this.overriddenElementId = () => null;
            console.warn('SingleChoiceOption without question context!');
        } else {
            this.useButtons = this.#choiceOptionContext.useButtons ?? (() => false);
            this.hiddenLabels = this.#choiceOptionContext.hiddenLabels ?? (() => false);
            this.overriddenElementId = computed(() => {
                const element = this.element();
                return this.#choiceOptionContext?.idLookup?.().get(element.id);
            });
        }
    }

    protected singleChoiceOptionFormValue(element: QnrBaseChoiceOptionElementFragment) {
        return (element as QnrSingleChoiceOptionElementFragment).formValue;
    }
}
