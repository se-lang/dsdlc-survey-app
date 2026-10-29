import {
    Binding,
    ClassSansProvider,
    ExistingSansProvider,
    FactorySansProvider,
    InjectionToken,
    Provider,
    Type,
    ValueSansProvider,
} from '@angular/core';

export interface CreatePlaceholderOpts {
    readonly component: Type<unknown>;
    readonly elementTag: string;
    readonly bindings?: Binding[] | undefined;
}

export interface QnrHtmlPlaceholder {
    readonly node: Node;
    readonly selector: string;
    readonly component: Type<unknown>;
    readonly bindings?: Binding[] | undefined;
}

export interface QnrHtmlSpecialsContext {
    createPlaceholder(opts: CreatePlaceholderOpts): QnrHtmlPlaceholder;
}

/**
 * Allows replacement of special elements within any HTML returned by the Questionnaire system.
 * Use provideQnrHtmlSpecial to register it.
 */
export interface QnrHtmlSpecial {
    replaceSpecial(content: DocumentFragment, context: QnrHtmlSpecialsContext): void;
}

export const QNR_HTML_SPECIALS = new InjectionToken<readonly QnrHtmlSpecial[]>('QNR_HTML_SPECIALS');

export function provideQnrHtmlSpecial(
    provider: ClassSansProvider | ValueSansProvider | ExistingSansProvider | FactorySansProvider,
): Provider {
    return {
        provide: QNR_HTML_SPECIALS,
        multi: true,
        ...provider,
    };
}
