import { computed, inject, Injectable, signal, Signal } from '@angular/core';
import {
    BaseQuestionnaireService,
    QuestionnaireContext,
} from '../qnr/questionnaire-service-interface';
import { filter, NEVER, Observable, of } from 'rxjs';
import { makeQuestionnaireContext } from '../qnr/make-context';
import { TourControllerService } from './tour-controller.service';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable()
export class QuestionnaireTourService extends BaseQuestionnaireService {
    readonly #tourController = inject(TourControllerService);

    context: Signal<QuestionnaireContext | undefined> = computed(() => {
        const questionnaire = this.#tourController.pageResourceValue();
        return questionnaire == null
            ? undefined
            : makeQuestionnaireContext(questionnaire.id, questionnaire);
    });
    context$ = toObservable(this.context).pipe(filter(Boolean));
    contextError: Signal<unknown> = signal(undefined);
    unexpectedError: Signal<unknown> = signal(undefined);
    focusInvalidFormElement: Observable<void> = NEVER;
    next(): Observable<unknown> {
        return of(undefined);
    }
    back(): Observable<unknown> {
        return of(undefined);
    }
    mutate(): Observable<unknown> {
        return of(undefined);
    }
    handleNavigation(): Observable<unknown> {
        return of(undefined);
    }
}
