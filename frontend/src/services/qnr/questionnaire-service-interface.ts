import {
    AnyQnrElementFragment,
    OperationInfoFragment,
    QnrPageFragment,
    QuestionnairePageButtonType,
    QuestionnaireStatusFragment,
} from '../../generated/graphql';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { MutationResult } from 'apollo-angular';
import {
    computed,
    DestroyRef,
    inject,
    Injectable,
    InjectionToken,
    isSignal,
    signal,
    Signal,
} from '@angular/core';

export type QnrFormControlType = string | boolean | null;

export interface QuestionnaireContext {
    readonly questionnaireId: string;
    readonly page: QnrPageFragment;
    readonly status: QuestionnaireStatusFragment;
    readonly formGroup: FormGroup<Record<string, FormControl<QnrFormControlType>>>;
    readonly formId: string;

    element(id: string): AnyQnrElementFragment | undefined;
}

export type QnrMutationResult = QnrPageFragment | OperationInfoFragment;
export type QnrMutatorResult = QnrMutationResult | MutationResult<{ nextPage: QnrMutationResult }>;
export type QnrMutator = (context: QuestionnaireContext) => Observable<QnrMutatorResult | null>;

export interface MappedQuestionnaireButton {
    id: string;
    cssClasses: string[];
    label: string;
    routerLink?: unknown[] | undefined;
    handler?: (() => Observable<unknown>) | undefined;
    highlight: string | null;
}

export interface QuestionnaireServiceInterface {
    readonly context: Signal<QuestionnaireContext | undefined>;
    readonly rootNavigationHidden: Signal<boolean>;
    readonly pageButtons: Signal<readonly MappedQuestionnaireButton[]>;
    readonly contextError: Signal<unknown>;
    readonly unexpectedError: Signal<unknown>;

    readonly focusInvalidFormElement: Observable<void>;

    hideRootNavigationForThisElement(when?: Signal<boolean>): void;

    next(): Observable<unknown>;

    back(): Observable<unknown>;

    mutate(func: QnrMutator): Observable<unknown>;

    handleNavigation(type: QuestionnairePageButtonType): Observable<unknown>;
}

export const QUESTIONNAIRE_SERVICE = new InjectionToken<QuestionnaireServiceInterface>(
    'QUESTIONNAIRE_SERVICE',
);

@Injectable()
export abstract class BaseQuestionnaireService implements QuestionnaireServiceInterface {
    /**
     * This contains either a unique object or a signal.
     * Signals are used to mark custom conditions, unique objects just take the place of `true`.
     */
    readonly #rootNavigationHiddenSet = signal<Array<Signal<boolean> | object>>([]);

    /**
     * Whether the root navigation should be hidden at the moment.
     */
    readonly rootNavigationHidden = computed(() =>
        this.#rootNavigationHiddenSet().some((r) => (isSignal(r) ? r() : true)),
    );

    /**
     * Whether the root navigation should be hidden while the element (identified by the current injector)
     * is active. Optionally provide a signal which determines when the root navigation should be hidden.
     *
     * This is used to hide the root navigation while an element on the page (such as the Zofar Calendar)
     * takes over navigation.
     */
    hideRootNavigationForThisElement(when?: Signal<boolean>) {
        const ref = when ?? (Object.create(null) as object);
        this.#rootNavigationHiddenSet.update((a) => [...a, ref]);
        inject(DestroyRef).onDestroy(() =>
            this.#rootNavigationHiddenSet.update((a) => a.filter((r) => r !== ref)),
        );
    }

    readonly pageButtons = computed(() => {
        const page = this.context()?.page;
        if (page == null) return [];

        const buttons: MappedQuestionnaireButton[] = [];
        for (const button of page.buttons) {
            const cssClasses: string[] = [];
            switch (button.type) {
                case 'BACK':
                    cssClasses.push('lla-button--secondary');
                    break;
            }
            buttons.push({
                id: `backend:${button.id}`,
                label: button.label,
                cssClasses,
                handler:
                    button.type === 'FINISH' ? undefined : () => this.handleNavigation(button.type),
                routerLink: button.type === 'FINISH' ? ['/'] : undefined,
                highlight: button.type === 'NEXT' ? 'nav-next-btn' : null,
            });
        }
        return buttons;
    });

    abstract readonly context: Signal<QuestionnaireContext | undefined>;
    abstract readonly context$: Observable<QuestionnaireContext>;
    abstract readonly contextError: Signal<unknown>;
    abstract readonly focusInvalidFormElement: Observable<void>;
    abstract readonly unexpectedError: Signal<unknown>;

    abstract back(): Observable<unknown>;

    abstract handleNavigation(type: QuestionnairePageButtonType): Observable<unknown>;

    abstract mutate(func: QnrMutator): Observable<unknown>;

    abstract next(): Observable<unknown>;
}
