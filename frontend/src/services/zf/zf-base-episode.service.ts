import { computed, Injectable, Signal, signal } from '@angular/core';
import { QuestionnaireServiceInterface } from '../qnr/questionnaire-service-interface';
import { Observable } from 'rxjs';
import { ZfEpisodeEntryFragment } from '../../generated/graphql';
import {
    EpisodeSaveInput,
    EpisodeViewType,
    GapConfirmationResult,
    PresentEpisodeElements,
    ZfEpisodeServiceInterface,
} from './zf-episode.interface';

@Injectable()
export abstract class ZfBaseEpisodeService implements ZfEpisodeServiceInterface {
    protected abstract readonly qnrService: QuestionnaireServiceInterface;

    readonly viewType = signal<'calendar' | 'list'>('calendar');
    abstract readonly resolvedViewType: Signal<EpisodeViewType>;

    readonly presentEpisodeElements: Signal<PresentEpisodeElements> = computed(() => {
        const context = this.qnrService.context();
        let calendar = false,
            table = false;
        if (context != null) {
            for (const element of context.page.allElements) {
                if (element.types.includes('ZfEpisodesCalendarElement')) {
                    calendar = true;
                }
                if (element.types.includes('ZfEpisodesTableElement')) {
                    table = true;
                }
                if (calendar && table) {
                    break;
                }
            }
        }
        return { calendar, table };
    });

    readonly showViewTypeSwitcher = computed(() => {
        const { calendar, table } = this.presentEpisodeElements();
        return calendar && table;
    });

    abstract saveEpisode(input: EpisodeSaveInput): Observable<unknown>;

    abstract navigateToEpisodeDetails(episodeId: string): Observable<unknown>;

    abstract removeEpisode(id: string): void;

    abstract handleGapClick(entry: ZfEpisodeEntryFragment): Observable<GapConfirmationResult>;
}
