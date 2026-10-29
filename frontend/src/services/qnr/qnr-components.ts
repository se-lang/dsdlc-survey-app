import { inject, InjectionToken, Provider, reflectComponentType, Type } from '@angular/core';
import { QnrElementFragment, QnrElementType } from '../../generated/graphql';

import { QuestionnaireContext } from './questionnaire-service-interface';

type AllowedQnrInput = 'element' | 'context';

function isAllowedQnrInput(input: string): input is AllowedQnrInput {
    return input === 'element' || input === 'context';
}

const QNR_ELEMENT_REGISTRATION = new InjectionToken<readonly QnrComponentDefinition[]>(
    'QNR_ELEMENT_REGISTRATION',
);

type QnrElementInputFactory = (
    element: QnrElementFragment,
    context: QuestionnaireContext,
) => Record<string, unknown>;

const inputsElementOnly: QnrElementInputFactory = (element) => ({ element });
const inputsContextOnly: QnrElementInputFactory = (_, context) => ({ context });
const inputsElementAndContext: QnrElementInputFactory = (element, context) => ({
    element,
    context,
});
const inputsNone: QnrElementInputFactory = () => ({});

/**
 * Provide a registration for a questionnaire component type.
 * The arguments start with a list of `QnrElementType`, describing the types this component should render.
 * The component can have inputs `element` (the GraphQL element being rendered) and `context`
 * (the `QuestionnaireContext`).
 */
export function provideQnrComponent(
    ...args: [...QnrElementType[], component: Type<unknown>]
): Provider {
    const component = args.pop() as Type<unknown>;
    const mirror = reflectComponentType(component);

    let hasElementInput = false,
        hasContextInput = false;
    if (mirror) {
        for (const input of mirror.inputs) {
            switch (input.templateName) {
                case 'element':
                    hasElementInput = true;
                    break;
                case 'context':
                    hasContextInput = true;
                    break;
            }
        }
    }

    if (llaDevMode) {
        if (mirror == null) {
            throw new Error(`Questionnaire component ${component.name} is not a component.`);
        }
    }

    let inputsFactory: QnrElementInputFactory;
    if (hasElementInput && hasContextInput) {
        inputsFactory = inputsElementAndContext;
    } else if (hasElementInput) {
        inputsFactory = inputsElementOnly;
    } else if (hasContextInput) {
        inputsFactory = inputsContextOnly;
    } else {
        inputsFactory = inputsNone;
    }

    return {
        provide: QNR_ELEMENT_REGISTRATION,
        useValue: {
            types: args as QnrElementType[],
            component,
            inputsFactory,
        } satisfies QnrComponentDefinition,
        multi: true,
    };
}

export interface QnrComponentDefinition {
    readonly types: readonly QnrElementType[];
    readonly component: Type<unknown>;
    readonly inputsFactory: (
        element: QnrElementFragment,
        context: QuestionnaireContext,
    ) => Record<string, unknown>;
}

export interface QnrComponentLookup {
    getComponent(element: QnrElementFragment): QnrComponentDefinition | null;
}

const QNR_COMPONENT_LOOKUP = new InjectionToken<QnrComponentLookup>('QNR_COMPONENT_LOOKUP');

/**
 * Register a `QnrComponentLookup` in the current injector based on components registered via
 * `provideQnrComponent`. For every element, its `types` array will be searched and the first type
 * for which a component has been registered will be returned.
 */
export function provideQnrComponentLookup(): Provider {
    return {
        provide: QNR_COMPONENT_LOOKUP,
        useFactory: () => {
            const components = inject(QNR_ELEMENT_REGISTRATION);
            const map = new Map<QnrElementType, QnrComponentDefinition>();
            for (const componentDefinition of components) {
                for (const type of componentDefinition.types) {
                    if (llaDevMode && map.has(type)) {
                        throw new Error(
                            `Duplicate component registration for element type ${type}`,
                        );
                    }

                    map.set(type, componentDefinition);
                }
            }
            return {
                getComponent(element: QnrElementFragment): QnrComponentDefinition | null {
                    for (const type of element.types) {
                        const result = map.get(type);
                        if (result != null) {
                            return result;
                        }
                    }
                    return null;
                },
            };
        },
    };
}

export function qnrComponentLookup(): QnrComponentLookup {
    return inject(QNR_COMPONENT_LOOKUP);
}
