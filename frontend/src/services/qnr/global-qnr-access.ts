import {
    computed,
    DestroyRef,
    inject,
    InjectionToken,
    Injector,
    ProviderToken,
    Signal,
    signal,
    untracked,
    WritableSignal,
} from '@angular/core';

const CURRENT_QNR_INJECTOR = new InjectionToken<WritableSignal<Injector | null>>(
    'CURRENT_QNR_INJECTOR',
    {
        providedIn: 'root',
        factory: () => signal<Injector | null>(null),
    },
);

/**
 * Dynamically inject something from the current questionnaire. The resulting signal will
 * update when the current questionnaire changes. If there is no questionnaire active, the signal
 * will hold `null`.
 */
export function injectFromCurrentQnr<T>(token: ProviderToken<T>): Signal<T | null> {
    const currentInjectorSignal = inject(CURRENT_QNR_INJECTOR);
    return computed(() => {
        const currentInjector = currentInjectorSignal();
        // Don't run any potential provider factory in the reactive context of this computed
        return untracked(() => currentInjector?.get(token) ?? null);
    });
}

function warnConcurrentQuestionnaires() {
    console.warn('Conflict between multiple questionnaires on the page!');
}

/**
 * Register the current injector as the questionnaire injector. The questionnaire injector
 * is used to get the questionnaire services and questionnaire context.
 */
export function registerCurrentQnr() {
    const qnrInjector = inject(Injector);
    const currentQnrInjector = inject(CURRENT_QNR_INJECTOR);
    const destroyRef = inject(DestroyRef);

    const previousInjector = currentQnrInjector();
    if (previousInjector != null) {
        warnConcurrentQuestionnaires();
        return;
    }
    currentQnrInjector.set(qnrInjector);
    destroyRef.onDestroy(() => {
        const injectorNow = currentQnrInjector();
        if (injectorNow !== qnrInjector) {
            warnConcurrentQuestionnaires();
        } else {
            currentQnrInjector.set(null);
        }
    });
}
