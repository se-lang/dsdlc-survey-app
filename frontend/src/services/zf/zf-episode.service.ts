import { inject, Injectable, Signal } from '@angular/core';
import { QuestionnaireService } from '../qnr/questionnaire.service';
import {
    ZfEpisodeEntryFragment,
    ZofarHideGapGQL,
    ZofarNavigateToEpisodeGQL,
    ZofarRemoveEpisodeGQL,
    ZofarSaveEpisodeGQL,
    ZofarTokenTourStateGQL,
} from '../../generated/graphql';
import { filter, map, Observable, of, switchMap } from 'rxjs';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { ConfirmService } from '../confirm.service';
import { EpisodeSaveInput, EpisodeViewType, GapConfirmationResult } from './zf-episode.interface';
import { ZfBaseEpisodeService } from './zf-base-episode.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { TOUR_LINK_PREVIOUS_PARAM } from '../tour/tour-link';
import { QUESTIONNAIRE_PAGE_SKIP_CONFIRMATION } from '../../pages/questionnaire-page/questionnaire-page-routing-constants';

@Injectable()
export class ZfEpisodeService extends ZfBaseEpisodeService {
    readonly #router = inject(Router);
    readonly #tokenTourStateGql = inject(ZofarTokenTourStateGQL);
    readonly #confirmService = inject(ConfirmService);
    protected readonly qnrService = inject(QuestionnaireService);
    readonly #saveEpisodeGql = inject(ZofarSaveEpisodeGQL);
    readonly #navigateToEpisodeDetailsGql = inject(ZofarNavigateToEpisodeGQL);
    readonly #removeEpisodeGql = inject(ZofarRemoveEpisodeGQL);
    readonly #hideEpisodeGql = inject(ZofarHideGapGQL);

    constructor() {
        super();
        this.qnrService.context$
            .pipe(
                filter((context) => {
                    return context.page.allElements.some((el) =>
                        el.types.includes('ZfEpisodesCalendarElement'),
                    );
                }),
                switchMap(() => {
                    return this.#tokenTourStateGql.fetch().pipe(
                        filter((response) => {
                            return response.data.zofarToken?.hasSeenTour === false;
                        }),
                    );
                }),
                takeUntilDestroyed(),
            )
            .subscribe(() => {
                this.#router
                    .navigate(['/tour'], {
                        queryParams: {
                            [TOUR_LINK_PREVIOUS_PARAM]: this.#router.url,
                        },
                        info: {
                            [QUESTIONNAIRE_PAGE_SKIP_CONFIRMATION]: true,
                        },
                    })
                    .catch((err: unknown) => console.error('Failed to navigate to tour', err));
            });
    }

    get resolvedViewType(): Signal<EpisodeViewType> {
        return this.viewType;
    }

    handleGapClick(entry: ZfEpisodeEntryFragment): Observable<GapConfirmationResult> {
        return this.#confirmService
            .showConfirmPopup({
                title: marker('zofarEpisodes.gapConfirmTitle'),
                question: marker('zofarEpisodes.gapConfirmQuestion'),
                yes: marker('zofarEpisodes.gapConfirmYes'),
                no: marker('zofarEpisodes.gapConfirmNo'),
            })
            .pipe(
                switchMap((confirmed) => {
                    if (confirmed) {
                        return of({
                            type: 'new-episode',
                            episodeData: {
                                startDate: entry.startDate,
                                endDate: entry.endDate,
                            },
                        } satisfies GapConfirmationResult);
                    } else {
                        return this.qnrService
                            .pageMutation(this.#hideEpisodeGql, (context) => {
                                return {
                                    data: {
                                        id: entry.id,
                                        questionnaireId: context.questionnaireId,
                                        version: context.page.version,
                                    },
                                };
                            })
                            .pipe(
                                map(() => {
                                    return {
                                        type: 'nothing',
                                    } satisfies GapConfirmationResult;
                                }),
                            );
                    }
                }),
            );
    }

    saveEpisode(input: EpisodeSaveInput): Observable<unknown> {
        return this.qnrService.pageMutation(this.#saveEpisodeGql, (context) => {
            return {
                data: {
                    ...input.data,
                    questionnaireId: context.questionnaireId,
                    version: context.page.version,
                },
                continueToDetails: input.continueToDetails,
            };
        });
    }

    navigateToEpisodeDetails(episodeId: string): Observable<unknown> {
        return this.qnrService.pageMutation(this.#navigateToEpisodeDetailsGql, (context) => {
            return {
                data: {
                    questionnaireId: context.questionnaireId,
                    episodeId,
                },
            };
        });
    }

    removeEpisode(id: string) {
        this.#confirmService
            .showConfirmPopup({
                title: marker('zofarEpisodes.confirmDeleteTitle'),
                questionHeader: marker('zofarEpisodes.confirmDeleteHeader'),
                question: marker('zofarEpisodes.confirmDelete'),
                yes: marker('zofarEpisodes.confirmDeleteYes'),
                no: marker('zofarEpisodes.confirmDeleteNo'),
            })
            .subscribe((confirmed) => {
                if (confirmed) {
                    this.qnrService
                        .pageMutation(this.#removeEpisodeGql, (context) => {
                            return {
                                data: {
                                    id,
                                    version: context.page.version,
                                    questionnaireId: context.questionnaireId,
                                },
                            };
                        })
                        .subscribe();
                }
            });
    }
}
