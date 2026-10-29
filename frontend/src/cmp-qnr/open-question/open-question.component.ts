import {
    ChangeDetectionStrategy,
    Component,
    computed,
    ElementRef,
    inject,
    InjectionToken,
    input,
    Signal,
    viewChild,
} from '@angular/core';
import { QnrOpenQuestionElementFragment } from '../../generated/graphql';
import { uniqueComponentId } from '../../util/unique-component-id';
import { qnrFormControl } from '../../services/qnr/qnr-form';
import { ReactiveFormsModule } from '@angular/forms';
import { QnrElementChildrenComponent } from '../../qnr-render/qnr-element-children/qnr-element-children.component';
import { MonthYearPickerComponent } from '../../components/month-year-picker/month-year-picker/month-year-picker.component';
import { MonthYearPickerInputDirective } from '../../components/month-year-picker/month-year-picker-input.directive';
import { ValidationErrorsComponent, ValidationFallbackDirective } from 'ngx-valdemort';
import { QuestionnaireContext } from '../../services/qnr/questionnaire-service-interface';
import { filter, map, Observable, switchMap } from 'rxjs';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

export type OpenQuestionInputStyle = 'default' | 'basic';

export interface OpenQuestionContext {
    readonly style?: OpenQuestionInputStyle;
    readonly openMatrixMode?: boolean;
    readonly focus?: Observable<string>;
    readonly onInput?: (questionId: string) => void;
}

export const OPEN_QUESTION_CONTEXT = new InjectionToken<OpenQuestionContext>(
    'OPEN_QUESTION_CONTEXT',
);

@Component({
    selector: 'lla-open-question',
    imports: [
        ReactiveFormsModule,
        QnrElementChildrenComponent,
        MonthYearPickerComponent,
        MonthYearPickerInputDirective,
        ValidationErrorsComponent,
        ValidationFallbackDirective,
    ],
    templateUrl: './open-question.component.html',
    styleUrl: './open-question.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class]': '"open-question--style-" + resolvedStyle()',
        '[class.open-matrix-mode]': 'openMatrixMode()',
        '[class.matrix-header-custom-label-mode]': 'matrixHeaderCustomLabelMode()',
    },
})
export class OpenQuestionComponent {
    readonly element = input.required<QnrOpenQuestionElementFragment>();
    readonly context = input.required<QuestionnaireContext>();

    readonly style = input<OpenQuestionInputStyle>();
    readonly openMatrixMode = input<boolean>(false);
    readonly matrixHeaderCustomLabelMode = input<boolean>(false);

    protected readonly openQuestionContext = inject(OPEN_QUESTION_CONTEXT, { optional: true });

    protected readonly resolvedStyle: Signal<OpenQuestionInputStyle> = computed(() => {
        return this.style() ?? this.openQuestionContext?.style ?? 'default';
    });

    protected readonly elementId = uniqueComponentId();
    protected readonly formControlId = this.elementId + '-fc';
    protected readonly dataListId = this.elementId + '-dl';
    protected readonly formControl = qnrFormControl(this.element, this.context);
    protected readonly pageForm = computed(() => this.context().formId);

    protected readonly inputmode = computed(() => {
        const element = this.element();
        switch (element.inputType) {
            case 'TEXT':
                return 'text';
            case 'DECIMAL':
                return 'decimal';
            case 'INTEGER':
                return 'integer';
            case 'EMAIL':
                return 'email';
            case 'YEAR_MONTH':
                return null;
        }
    });

    protected readonly inputType = computed(() => {
        const element = this.element();
        switch (element.inputType) {
            case 'YEAR_MONTH':
                return 'year-month';
            default:
                return 'text';
        }
    });

    protected readonly minDate = computed(() => {
        const element = this.element();
        return element.validators.find((v) => v.__typename === 'MinDateValidator')?.minDate;
    });
    protected readonly maxDate = computed(() => {
        const element = this.element();
        return element.validators.find((v) => v.__typename === 'MaxDateValidator')?.maxDate;
    });

    protected readonly textInput = viewChild<string, ElementRef<HTMLInputElement>>('textInput', {
        read: ElementRef,
    });

    protected onTextInput() {
        this.openQuestionContext?.onInput?.(this.element().id);
    }

    constructor() {
        const focusObservable = this.openQuestionContext?.focus;
        if (focusObservable != null) {
            toObservable(this.element)
                .pipe(
                    map((element) => element.id),
                    switchMap((elementId) => {
                        return focusObservable.pipe(filter((focusId) => focusId === elementId));
                    }),
                    takeUntilDestroyed(),
                )
                .subscribe(() => this.textInput()?.nativeElement.focus());
        }
    }
}
