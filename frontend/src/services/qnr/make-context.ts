import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { AnyQnrElementFragment, CurrentQuestionnairePageFragment } from '../../generated/graphql';
import { QnrFormControlType, QuestionnaireContext } from './questionnaire-service-interface';

let nextFormId = 0;

export function makeQuestionnaireContext(
    questionnaireId: string,
    questionnaire: CurrentQuestionnairePageFragment,
): QuestionnaireContext {
    const page = questionnaire.currentPage;
    const map = new Map<string, AnyQnrElementFragment>();
    const formControls: Array<[string, FormControl<QnrFormControlType>]> = [];
    for (const el of page.allElements) {
        map.set(el.id, el);
        if ('formControlId' in el) {
            formControls.push([
                el.formControlId,
                new FormControl<QnrFormControlType>(null, {
                    validators: getValidators(el),
                }),
            ]);
        }
    }
    const formGroup = new FormGroup(Object.fromEntries(formControls));
    for (const formValue of page.formValues) {
        const control = formGroup.get(formValue.formControlId);
        if (control == null) {
            console.warn('Got form value for unknown form control', formValue);
        } else {
            control.setValue(formValue.value);
        }
    }
    return {
        questionnaireId,
        page,
        status: questionnaire.status,
        formGroup,
        formId: `lla-page-form-${String(nextFormId++)}`,
        element(id: string): AnyQnrElementFragment | undefined {
            return map.get(id);
        },
    };
}

function getValidators(element: AnyQnrElementFragment): ValidatorFn[] | null {
    function wrapValidator(
        validator: ValidatorFn,
        name: string,
        errorMessage: string,
    ): ValidatorFn {
        return (control) => {
            const result = validator(control);
            if (result != null) {
                return { [name]: errorMessage };
            } else {
                return null;
            }
        };
    }

    if ('validators' in element) {
        const validators: ValidatorFn[] = [];
        for (const v of element.validators) {
            switch (v.__typename) {
                case 'MaxTextLengthValidator':
                    validators.push(
                        wrapValidator(
                            Validators.maxLength(v.maxLength),
                            'maxLength',
                            v.errorMessage,
                        ),
                    );
                    break;
                case 'MaxValueValidator':
                    validators.push(
                        wrapValidator(Validators.max(Number(v.maxValue)), 'max', v.errorMessage),
                    );
                    break;
                case 'MinValueValidator':
                    validators.push(
                        wrapValidator(Validators.min(Number(v.minValue)), 'min', v.errorMessage),
                    );
                    break;
                case 'TextPatternValidator':
                    validators.push(
                        wrapValidator(
                            Validators.pattern(new RegExp(v.pattern, v.flags)),
                            'pattern',
                            v.errorMessage,
                        ),
                    );
                    break;
                case 'EmailValidator':
                    validators.push(wrapValidator(Validators.email, 'email', v.errorMessage));
                    break;
                case 'MaxDateValidator':
                case 'MinDateValidator':
                    // handled directly by month picker
                    break;
                default:
                    console.warn('Unsupported field validator', v, 'for', element);
            }
        }
        return validators;
    } else {
        return null;
    }
}
