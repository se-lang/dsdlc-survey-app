import { ZfEpisodeEntryFragment, ZfSaveEpisodeInput } from '../../generated/graphql';
import { InjectionToken, Signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';

export type EpisodeSaveData = Omit<ZfSaveEpisodeInput, 'questionnaireId' | 'version'>;

export interface EpisodeSaveInput {
    readonly data: EpisodeSaveData;
    readonly continueToDetails: boolean;
}

export type EpisodeViewType = 'calendar' | 'list';

export interface ForcedAddEpisodeHighlight {
    readonly categoryId: string;
    readonly monthIndex: number;
}

export interface GapConfirmationNewEpisode {
    type: 'new-episode';
    episodeData: Partial<ZfEpisodeEntryFragment> | null;
}

export interface GapConfirmationNothing {
    type: 'nothing';
}

export type GapConfirmationResult = GapConfirmationNewEpisode | GapConfirmationNothing;

export interface ZfEpisodeServiceInterface {
    readonly viewType: WritableSignal<EpisodeViewType>;
    readonly resolvedViewType: Signal<EpisodeViewType>;
    readonly showViewTypeSwitcher: Signal<boolean>;
    readonly presentEpisodeElements: Signal<PresentEpisodeElements>;

    saveEpisode(input: EpisodeSaveInput): Observable<unknown>;
    navigateToEpisodeDetails(episodeId: string): Observable<unknown>;

    handleGapClick(entry: ZfEpisodeEntryFragment): Observable<GapConfirmationResult>;

    removeEpisode(id: string): void;
}

export interface PresentEpisodeElements {
    readonly calendar: boolean;
    readonly table: boolean;
}

export const ZF_EPISODE_SERVICE = new InjectionToken<ZfEpisodeServiceInterface>(
    'ZF_EPISODE_SERVICE',
);
