import { computed, inject, Injectable, linkedSignal, Signal, signal, Type } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { EpisodeViewType, ForcedAddEpisodeHighlight } from '../zf/zf-episode.interface';
import { AppTourState } from './tour-state';
import { httpResource } from '@angular/common/http';
import { CurrentQuestionnairePageFragment } from '../../generated/graphql';
import { TOUR_LINK_PREVIOUS_PARAM } from './tour-link';
import { ComputePositionConfig } from '@floating-ui/dom';
import { ViewportService } from '../viewport.service';

export interface TourStepComponentContent {
    readonly component: Type<unknown>;
    readonly inputs?: Record<string, unknown>;
}

export interface DialogPositionPlain {
    readonly type: 'center';
}

export interface DialogPositionRelative {
    readonly type: 'relative';
    readonly side?: 'left' | 'right';
    readonly mode?: 'element' | 'circle';
    readonly margin?: string;
    readonly overlap?: string;
}

export interface DialogPositionFixed {
    readonly type: 'fixed';
    readonly inset: string;
    readonly margin?: string;
}

export type DialogPosition = DialogPositionPlain | DialogPositionRelative | DialogPositionFixed;

export type TourStepPositionCompute = Omit<ComputePositionConfig, 'strategy' | 'middleware'>;

export interface TourStep {
    readonly highlight?: string | string[];
    readonly dialogPosition?: DialogPosition | (() => DialogPosition | null | undefined);
    readonly computePosition?:
        | TourStepPositionCompute
        | (() => TourStepPositionCompute | null | undefined);
    readonly icon: string;
    readonly title: string;
    readonly content: string | TourStepComponentContent;
    readonly showEpisodeDialog?: string;
    readonly highlightEpisodeAdd?: ForcedAddEpisodeHighlight;
    readonly highlightEpisodes?: string[];
    readonly forceEpisodeViewType?: EpisodeViewType;
    readonly dataIndex?: number;
}

@Injectable()
export class TourControllerService implements AppTourState {
    readonly #router = inject(Router);
    readonly #viewportService = inject(ViewportService);
    readonly #activatedRoute = inject(ActivatedRoute);

    readonly #steps: readonly TourStep[] = [
        {
            icon: 'tour-circle',
            title: marker('tour.intro.title'),
            content: marker('tour.intro.content'),
        },
        {
            highlight: 'zf-calendar-1',
            dialogPosition: () => {
                return this.#viewportService.isMobile()
                    ? {
                          type: 'fixed',
                          inset: 'auto 0 0 0',
                      }
                    : {
                          type: 'fixed',
                          inset: 'auto 50px 150px auto',
                      };
            },
            icon: 'calendar-circle',
            title: marker('tour.calendar.title'),
            content: marker('tour.calendar.content'),
        },
        {
            highlight: ['new-episode-calendar', 'episode-add'],
            dialogPosition: () => {
                return this.#viewportService.isMobile()
                    ? {
                          type: 'fixed',
                          inset: 'auto 0 0 0',
                      }
                    : {
                          type: 'fixed',
                          inset: 'auto 0 150px 0',
                          margin: '0 auto',
                      };
            },
            icon: 'add-circle',
            title: marker('tour.add-entry.title'),
            content: marker('tour.add-entry.content'),
            highlightEpisodeAdd: {
                categoryId: 'internship',
                monthIndex: 9,
            },
        },
        {
            highlight: 'episode-dialog',
            dialogPosition: {
                type: 'relative',
                mode: 'element',
            },
            computePosition: {
                placement: 'left',
            },
            icon: 'add-circle',
            title: marker('tour.add-episode.title'),
            content: marker('tour.add-episode.content'),
            showEpisodeDialog: 'episode1',
        },
        {
            highlight: 'episode-to-details',
            dialogPosition: {
                type: 'relative',
            },
            computePosition: {
                placement: 'top',
            },
            icon: 'add-circle',
            title: marker('tour.continue-episode.title'),
            content: marker('tour.continue-episode.content'),
            showEpisodeDialog: 'episode1',
        },
        {
            highlight: 'questionnaire-box',
            dialogPosition: {
                type: 'relative',
                mode: 'element',
            },
            computePosition: {
                placement: 'left',
            },
            icon: 'add-circle',
            title: marker('tour.continue-episode.title'),
            content: marker('tour.continue-episode.content'),
            dataIndex: 2,
        },
        {
            highlight: ['episode-episode1', 'nav-next-btn-calendar'],
            highlightEpisodes: ['episode1'],
            dialogPosition: () => {
                return this.#viewportService.isMobile()
                    ? {
                          type: 'fixed',
                          inset: 'auto 0 0 0',
                      }
                    : {
                          type: 'fixed',
                          inset: 'auto 50px 150px auto',
                      };
            },
            icon: 'add-circle',
            title: marker('tour.continue-episode.title'),
            content: marker('tour.continue-episode.content'),
        },
        {
            highlight: 'zf-calendar-1',
            dialogPosition: () => {
                return this.#viewportService.isMobile()
                    ? {
                          type: 'fixed',
                          inset: 'auto 0 0 0',
                      }
                    : {
                          type: 'fixed',
                          inset: 'auto 50px 150px auto',
                      };
            },
            icon: 'calendar-circle',
            title: marker('tour.calendar2.title'),
            content: marker('tour.calendar2.content'),
            dataIndex: 1,
        },
        {
            highlight: 'episode-mode-toggle',
            computePosition: () => {
                return {
                    placement: this.#viewportService.isMobile() ? 'bottom' : 'left-start',
                };
            },
            icon: 'calendar-circle',
            title: marker('tour.table.title'),
            content: marker('tour.table.content'),
            dataIndex: 1,
        },
        {
            highlight: 'episode-table',
            dialogPosition: () => {
                return this.#viewportService.isMobile()
                    ? {
                          type: 'fixed',
                          inset: 'auto 0 0 0',
                      }
                    : {
                          type: 'fixed',
                          inset: 'auto 0 150px 0',
                          margin: '0 auto',
                      };
            },
            icon: 'calendar-circle',
            title: marker('tour.table.title'),
            content: marker('tour.table.content'),
            dataIndex: 1,
            forceEpisodeViewType: 'list',
        },
        {
            highlight: 'tour-link',
            computePosition: () => {
                return {
                    placement: this.#viewportService.isMobile() ? 'bottom' : 'left-start',
                };
            },
            icon: 'help',
            title: marker('tour.finish.title'),
            content: marker('tour.finish.content'),
        },
    ];

    readonly #totalSteps = signal(this.#steps.length);

    readonly #currentStepIndex = signal(0);

    readonly #highlightedElements = signal<ReadonlyMap<string, Element>>(new Map());

    readonly currentStep = computed(() => this.#steps[this.#currentStepIndex()]);

    readonly currentStepIndex = this.#currentStepIndex.asReadonly();

    readonly firstStep = computed(() => this.#currentStepIndex() === 0);
    readonly lastStep = computed(() => this.#currentStepIndex() === this.#totalSteps() - 1);

    readonly currentStepAnimated = this.#currentStepIndex.asReadonly();
    readonly totalSteps = this.#totalSteps.asReadonly();

    readonly #dataIndex = computed(() => this.currentStep().dataIndex ?? 0);
    readonly pageResource = httpResource<CurrentQuestionnairePageFragment>(
        () => `/tour-data/${String(this.#dataIndex()).padStart(2, '0')}.json`,
    );

    readonly pageResourceValue: Signal<CurrentQuestionnairePageFragment | undefined> = linkedSignal(
        {
            source: this.pageResource.value,
            computation: (source, previous) => {
                if (source != null) {
                    return source;
                } else {
                    return previous?.value;
                }
            },
        },
    );

    readonly registerHighlight = (name: string, element: Element): (() => void) => {
        this.#highlightedElements.update((map) => {
            if (map.get(name) !== element) {
                const newMap = new Map(map);
                newMap.set(name, element);
                return newMap;
            } else {
                return map;
            }
        });
        return () => {
            this.#highlightedElements.update((map) => {
                if (map.get(name) === element) {
                    const newMap = new Map(map);
                    newMap.delete(name);
                    return newMap;
                } else {
                    return map;
                }
            });
        };
    };

    readonly highlightedElements: Signal<readonly Element[]> = computed(() => {
        const step = this.currentStep();
        if (Array.isArray(step.highlight)) {
            const highlightedElements = this.#highlightedElements();
            return step.highlight
                .map((highlight) => {
                    return highlightedElements.get(highlight);
                })
                .filter((el) => el != null);
        } else if (step.highlight) {
            const element = this.#highlightedElements().get(step.highlight);
            return element == null ? [] : [element];
        } else {
            return [];
        }
    });

    endTour() {
        const nextUrl = this.#activatedRoute.snapshot.queryParamMap.get(TOUR_LINK_PREVIOUS_PARAM);
        void this.#router.navigateByUrl(nextUrl ?? '/');
    }

    skipTour() {
        if (this.lastStep()) {
            this.endTour();
        } else {
            this.#currentStepIndex.set(this.#steps.length - 1);
        }
    }

    previous() {
        this.move(-1);
    }

    next() {
        this.move(1);
    }

    move(dir: -1 | 1) {
        this.#currentStepIndex.update((i) =>
            Math.min(this.#steps.length - 1, Math.max(0, i + dir)),
        );
    }
}
