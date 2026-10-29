import { computed, DestroyRef, inject, Injectable, Injector } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
    CurrentQuestionnairePageDocument,
    CurrentQuestionnairePageGQL,
    CurrentQuestionnairePageQuery,
    QnrElementFragment,
    QnrMultipleChoiceOptionElementFragment,
    QnrMultipleChoiceQuestionElementFragment,
    QuestionnairePageButtonType,
    SubmitZofarPageGQL,
    ZfFormSubmitItem,
    ZofarBackGQL,
} from '../../generated/graphql';
import {
    BehaviorSubject,
    catchError,
    distinctUntilChanged,
    filter,
    finalize,
    first,
    forkJoin,
    from,
    ignoreElements,
    map,
    mergeAll,
    Observable,
    of,
    shareReplay,
    startWith,
    Subject,
    switchMap,
    tap,
    throwError,
} from 'rxjs';
import { withGlobalLoading, withGraphqlGlobalLoading } from '../global-loading.service';
import { MutationOptionsAlone, MutationResult } from 'apollo-angular';
import type { FetchResult } from '@apollo/client/link/core';
import { ApolloCache } from '@apollo/client';
import { ViewportScroller } from '@angular/common';
import { canSubmitForm } from '../../util/form-submit';
import {
    BaseQuestionnaireService,
    QnrMutationResult,
    QnrMutator,
    QuestionnaireContext,
} from './questionnaire-service-interface';
import { makeQuestionnaireContext } from './make-context';

export const QUESTIONNAIRE_NOT_FOUND_ERROR = new Error('Questionnaire not found');

/**
 * This service provides the core functionality for the questionnaire system.
 */
@Injectable()
export class QuestionnaireService extends BaseQuestionnaireService {
    readonly #injector = inject(Injector);
    readonly #currentPageGql = inject(CurrentQuestionnairePageGQL);
    readonly #submitGql = inject(SubmitZofarPageGQL);
    readonly #backGql = inject(ZofarBackGQL);
    readonly #viewportScroller = inject(ViewportScroller);

    readonly #questionnaireId$ = new BehaviorSubject<string | null>(null);
    readonly #lock$ = new BehaviorSubject(false);
    readonly #context$ = this.#questionnaireId$.pipe(
        filter(Boolean),
        switchMap((questionnaireId) => {
            return this.#currentPageGql
                .watch(
                    { questionnaireId },
                    {
                        useInitialLoading: true,
                        notifyOnNetworkStatusChange: true,
                        fetchPolicy: 'network-only',
                    },
                )
                .valueChanges.pipe(
                    withGraphqlGlobalLoading(),
                    map((response) => ({ response, questionnaireId })),
                );
        }),
        map(({ response, questionnaireId }) => {
            if (response.questionnaire == null) {
                throw QUESTIONNAIRE_NOT_FOUND_ERROR;
            } else {
                return makeQuestionnaireContext(questionnaireId, response.questionnaire);
            }
        }),
        tap({
            next: () => this.#viewportScroller.scrollToPosition([0, 0]),
        }),
        takeUntilDestroyed(),
        shareReplay(1),
    );

    get context$(): Observable<QuestionnaireContext> {
        return this.#context$;
    }

    readonly context = toSignal(
        this.#context$.pipe(
            catchError((err: unknown) => {
                if (err !== QUESTIONNAIRE_NOT_FOUND_ERROR) {
                    console.error('Unexpected error in questionnaire context pipe', err);
                }
                return of();
            }),
        ),
    );

    readonly contextError = toSignal(
        this.#context$.pipe(
            ignoreElements(),
            catchError((err: unknown) => of(err)),
        ),
    );
    readonly unexpectedError = computed(() => {
        const err = this.contextError();
        return err === QUESTIONNAIRE_NOT_FOUND_ERROR ? undefined : err;
    });

    private readonly focusInvalidFormElement0 = new Subject<void>();

    /**
     * This Observable emits, when the first invalid form field in the questionnaire should be focused.
     */
    get focusInvalidFormElement(): Observable<void> {
        return this.focusInvalidFormElement0;
    }

    constructor() {
        super();
        inject(DestroyRef).onDestroy(() => this.#lock$.complete());

        this.#context$
            .pipe(
                switchMap((context) => {
                    const handlers = context.page.allElements
                        .map((element) => this.#maybeHandleExclusivity(context, element))
                        .filter((obs) => obs != null);
                    return from(handlers).pipe(mergeAll());
                }),
                takeUntilDestroyed(),
            )
            .subscribe();
    }

    #maybeHandleExclusivity(
        context: QuestionnaireContext,
        element: QnrElementFragment,
    ): Observable<unknown> | null {
        if (!element.types.includes('QnrMultipleChoiceQuestionElement')) {
            return null;
        }
        const questionElement = element as QnrMultipleChoiceQuestionElementFragment;
        const options = questionElement.optionIds
            .map((optionId) => {
                const optionElement = context.page.allElements.find((e) => e.id === optionId);
                if (!optionElement?.types.includes('QnrMultipleChoiceOptionElement')) {
                    return null;
                }
                const option = optionElement as QnrMultipleChoiceOptionElementFragment;
                const formControl = context.formGroup.get(option.formControlId);
                if (formControl == null) {
                    return null;
                }
                return { option, formControl };
            })
            .filter((x) => x != null);

        const exclusiveOptions = options.filter((option) => option.option.exclusive);
        if (exclusiveOptions.length === 0) {
            return null;
        }
        return forkJoin(
            options.map((option) => {
                return option.formControl.valueChanges.pipe(
                    startWith(option.formControl.value),
                    distinctUntilChanged(),
                    filter(Boolean),
                    tap({
                        next: () => {
                            for (const innerOption of options) {
                                if (
                                    innerOption !== option &&
                                    (option.option.exclusive || innerOption.option.exclusive)
                                ) {
                                    innerOption.formControl.setValue(false);
                                }
                            }
                        },
                        finalize: () => console.log('finalized!'),
                    }),
                );
            }),
        );
    }

    /**
     * Whether the user be asked to confirm leaving of the page. Must be called at the moment of the attempt to leave.
     */
    leaveConfirmationType(): 'none' | 'calendar' | 'default' {
        if (this.contextError() != null) {
            // if there is an error being shown, we don't need to ask the user if they want to save data
            return 'none';
        } else if (this.context()?.page.buttons.some((b) => b.type === 'FINISH')) {
            // if there is a "finish" button on the page, we're on the last page of the questionnaire
            // no need to ask there
            return 'none';
        } else {
            const hasCalendar = this.context()?.page.allElements.some((element) =>
                element.types.includes('ZfEpisodesCalendarElement'),
            );
            return hasCalendar ? 'calendar' : 'default';
        }
    }

    /**
     * Set the GraphQL ID for the questionnaire that should be used. This must be called to initiate loading of
     * the questionnaire.
     */
    setQuestionnaireId(questionnaireId: string) {
        this.#questionnaireId$.next(questionnaireId);
    }

    /**
     * Navigate to the next page.
     */
    next(): Observable<unknown> {
        return this.pageMutation(this.#submitGql, (context) => {
            if (!canSubmitForm(context.formGroup)) {
                context.formGroup.markAllAsTouched();
                this.focusInvalidFormElement0.next();
                return null;
            }

            console.log('submitting form', context.formGroup.getRawValue());

            const values: ZfFormSubmitItem[] = Object.entries(context.formGroup.getRawValue()).map(
                ([id, value]) => {
                    return { id, value };
                },
            );
            return {
                data: {
                    formValues: values,
                    version: context.page.version,
                    questionnaireId: context.questionnaireId,
                },
            };
        });
    }

    /**
     * Navigate back
     */
    back(): Observable<unknown> {
        return this.pageMutation(this.#backGql, (context) => {
            return {
                questionnaireId: context.questionnaireId,
            };
        });
    }

    /**
     * Run a GraphQL mutation that returns a new page.
     * @param mutation
     * @param variablesCallback
     */
    pageMutation<
        T extends {
            nextPage: QnrMutationResult;
        },
        V = object,
    >(
        mutation: {
            mutate(
                variables: V,
                options?: Omit<MutationOptionsAlone<T, V>, 'optimisticResponse'>,
            ): Observable<MutationResult<T>>;
        },
        variablesCallback?: (context: QuestionnaireContext) => V | null,
    ): Observable<unknown> {
        return this.mutate((context) => {
            const variables = variablesCallback?.(context);
            if (variables == null) {
                return of(null);
            }
            return mutation.mutate(variables, {
                update: (cache, result) => this.#updatePageFromMutation(context, cache, result),
            });
        });
    }

    #updatePageFromMutation(
        context: QuestionnaireContext,
        cache: ApolloCache<unknown>,
        result: Omit<FetchResult<{ nextPage: QnrMutationResult }>, 'context'>,
    ) {
        const nextPage = result.data?.nextPage;
        if (nextPage?.__typename === 'ZfPage') {
            cache.writeQuery<CurrentQuestionnairePageQuery>({
                query: CurrentQuestionnairePageDocument,
                variables: {
                    questionnaireId: context.questionnaireId,
                },
                data: {
                    __typename: 'Query',
                    questionnaire: {
                        __typename: 'ZfQuestionnaire',
                        id: context.questionnaireId,
                        currentPage: nextPage,
                        status: context.status,
                    },
                },
            });
        }
    }

    /**
     * Run a mutation under the Questionnaire lock.
     * @param func
     */
    mutate(func: QnrMutator): Observable<unknown> {
        return this.#lock$.pipe(
            first((locked) => !locked),
            tap(() => this.#lock$.next(true)),
            switchMap(() => this.#context$),
            first(),
            switchMap(func),
            withGlobalLoading({ injector: this.#injector }),
            tap({
                next: (result) => {
                    if (result != null) {
                        let unwrapped: QnrMutationResult | undefined;
                        if ('__typename' in result) {
                            unwrapped = result;
                        } else {
                            unwrapped = result.data?.nextPage;
                        }
                        if (unwrapped?.__typename !== 'ZfPage') {
                            console.error('OperationError during ZfPage mutation', result);
                            // TODO: We should show some kind of notification to the user
                        }
                    }
                },
                error: (err: unknown) => {
                    console.error('Zofar submit failed', err);
                },
            }),
            finalize(() => this.#lock$.next(false)),
        );
    }

    /**
     * Handle navigation from the given button.
     */
    handleNavigation(type: QuestionnairePageButtonType): Observable<unknown> {
        switch (type) {
            case 'BACK':
                return this.back();
            case 'NEXT':
                return this.next();
            default:
                return throwError(() => new Error('Unsupported custom navigation type'));
        }
    }
}
