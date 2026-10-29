import { computed, inject, InjectionToken, Provider, Signal } from '@angular/core';
import { QnrElementType, QnrFormControlElementFragment } from '../../generated/graphql';
import { FormControl } from '@angular/forms';

import { QnrFormControlType, QuestionnaireContext } from './questionnaire-service-interface';

export function qnrFormControl(
    element: Signal<QnrFormControlElementFragment>,
    context: Signal<QuestionnaireContext>,
): Signal<FormControl<QnrFormControlType>> {
    return computed(() => {
        const ctx = context();
        const el = element();
        const formGroup = ctx.formGroup;
        if (!(el.formControlId in formGroup.controls)) {
            console.error('formControlId missing for element', el);
            throw new Error(
                `Invalid formControlId ${el.formControlId}, not registered in context FormGroup.`,
            );
        }
        return formGroup.controls[el.formControlId];
    });
}

export type QnrFormHandler<T extends QnrFormControlElementFragment> = (
    element: T,
    formControl: FormControl,
) => string | null;

interface QnrFormHandlerRegistration {
    readonly types: readonly QnrElementType[];
    readonly handler: QnrFormHandler<QnrFormControlElementFragment>;
}

const QNR_FORM_HANDLERS = new InjectionToken<readonly QnrFormHandlerRegistration[]>(
    'QNR_FORM_HANDLERS',
);

export function provideQnrFormHandler<T extends QnrFormControlElementFragment>(
    ...args: [...QnrElementType[], QnrFormHandler<T>]
): Provider {
    const handler = args.pop() as QnrFormHandler<QnrFormControlElementFragment>;
    return {
        provide: QNR_FORM_HANDLERS,
        multi: true,
        useValue: {
            types: args as readonly QnrElementType[],
            handler,
        } satisfies QnrFormHandlerRegistration,
    };
}

export interface QnrFormHandlerLookup {
    getFormHandler(
        element: QnrFormControlElementFragment,
    ): QnrFormHandler<QnrFormControlElementFragment> | null;
}

const QNR_FORM_HANDLER_LOOKUP = new InjectionToken<QnrFormHandlerLookup>('QNR_FORM_HANDLER_LOOKUP');

export function provideQnrFormHandlerLookup(): Provider {
    return {
        provide: QNR_FORM_HANDLER_LOOKUP,
        useFactory: () => {
            const handlers = inject(QNR_FORM_HANDLERS);
            const map = new Map<QnrElementType, QnrFormHandler<QnrFormControlElementFragment>>();
            for (const { types, handler } of handlers) {
                for (const type of types) {
                    if (llaDevMode && map.has(type)) {
                        throw new Error(
                            `Duplicate form handler registration for element type ${type}`,
                        );
                    }
                    map.set(type, handler);
                }
            }
            return {
                getFormHandler(
                    element: QnrFormControlElementFragment,
                ): QnrFormHandler<QnrFormControlElementFragment> | null {
                    for (const type of element.types) {
                        const result = map.get(type);
                        if (result != null) {
                            return result;
                        }
                    }
                    return null;
                },
            } satisfies QnrFormHandlerLookup;
        },
    };
}

export function qnrFormHandlerLookup(): QnrFormHandlerLookup {
    return inject(QNR_FORM_HANDLER_LOOKUP);
}
