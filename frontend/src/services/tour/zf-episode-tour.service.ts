import { computed, inject, Injectable, Signal } from '@angular/core';
import { EpisodeViewType, GapConfirmationResult } from '../zf/zf-episode.interface';
import {
    QUESTIONNAIRE_SERVICE,
    QuestionnaireServiceInterface,
} from '../qnr/questionnaire-service-interface';
import { Observable, of } from 'rxjs';
import { ZfBaseEpisodeService } from '../zf/zf-base-episode.service';
import { TourControllerService } from './tour-controller.service';

@Injectable()
export class ZfEpisodeTourService extends ZfBaseEpisodeService {
    protected readonly qnrService: QuestionnaireServiceInterface = inject(QUESTIONNAIRE_SERVICE);

    readonly resolvedViewType: Signal<EpisodeViewType>;

    constructor() {
        super();
        const tourService = inject(TourControllerService);
        this.resolvedViewType = computed(() => {
            return tourService.currentStep().forceEpisodeViewType ?? this.viewType();
        });
    }

    removeEpisode(): void {
        // NOOP
    }

    saveEpisode(): Observable<unknown> {
        return of(null);
    }

    navigateToEpisodeDetails(): Observable<unknown> {
        return of(null);
    }

    handleGapClick(): Observable<GapConfirmationResult> {
        return of({ type: 'nothing' });
    }
}
