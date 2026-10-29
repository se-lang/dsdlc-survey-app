import {
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    effect,
    ElementRef,
    inject,
    input,
    linkedSignal,
    signal,
    Signal,
    viewChild,
} from '@angular/core';
import { DateTime } from '../../../util/luxon';
import {
    ZfEpisodeCategoryFragment,
    ZfEpisodeEntryFragment,
    ZfEpisodesCalendarFragment,
} from '../../../generated/graphql';
import { ZfCalendarService } from '../zf-calendar.service';
import { ZfCalendarViewModeSelectorComponent } from '../zf-calendar-view-mode-selector/zf-calendar-view-mode-selector.component';
import { DialogComponent } from '../../../components/dialog/dialog/dialog.component';
import { ZfEpisodeDialogComponent } from '../../zf-episode-dialog/zf-episode-dialog.component';
import { IconDirective } from '../../../components/icon/icon.directive';
import { DatePipe } from '../../../locale/date.pipe';
import { ArrowPopoverComponent } from '../../../components/arrow-popover/arrow-popover.component';
import { ZfEpisodePopoverComponent } from '../../zf-episode-popover/zf-episode-popover.component';
import { PopoverDirective } from '../../../components/popover/popover.directive';
import { TriggerPopoverDirective } from '../../../components/popover/trigger-popover.directive';

import { ZfEpisodeElementToggleDirective } from '../../zf-episode-element-toggle.directive';
import { ZfEpisodeColorStylesDirective } from '../../zf-episode-color-styles.directive';
import { ViewportService } from '../../../services/viewport.service';
import { ZfEpisodeNavigationComponent } from '../../zf-episode-navigation/zf-episode-navigation.component';
import {
    QUESTIONNAIRE_SERVICE,
    QuestionnaireContext,
} from '../../../services/qnr/questionnaire-service-interface';
import {
    ForcedAddEpisodeHighlight,
    ZF_EPISODE_SERVICE,
} from '../../../services/zf/zf-episode.interface';
import { APP_TOUR_STATE } from '../../../services/tour/tour-state';
import { TranslocoDirective } from '@jsverse/transloco';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TourHighlightElementDirective } from '../../../components/tour/tour-highlight-element.directive';
import { DialogContentComponent } from '../../../components/dialog/dialog-content/dialog-content.component';
import { DialogHeaderComponent } from '../../../components/dialog/dialog-header/dialog-header.component';
import { DialogFooterComponent } from '../../../components/dialog/dialog-footer/dialog-footer.component';
import { finalize } from 'rxjs';

interface UiMonth {
    readonly month: DateTime;
    readonly isYearStart: boolean;
    readonly isLast: boolean;
    readonly isFirst: boolean;
    readonly disabled: boolean;
}

interface MappedUiYear {
    readonly year: DateTime;
    readonly yearMarkerColWidth: number;
    readonly yearMarkerColWidthSubDesktop: number;
    readonly previous: DateTime | null;
    readonly next: DateTime | null;
    readonly previousGoesToFirst: boolean;
    readonly nextGoesToLast: boolean;
}

@Component({
    selector: 'lla-zf-calendar',
    imports: [
        ZfCalendarViewModeSelectorComponent,
        DialogComponent,
        ZfEpisodeDialogComponent,
        IconDirective,
        DatePipe,
        ArrowPopoverComponent,
        ZfEpisodePopoverComponent,
        PopoverDirective,
        TriggerPopoverDirective,
        ZfEpisodeColorStylesDirective,
        ZfEpisodeNavigationComponent,
        TranslocoDirective,
        TourHighlightElementDirective,
        DialogContentComponent,
        DialogHeaderComponent,
        DialogFooterComponent,
    ],
    templateUrl: './zf-calendar.component.html',
    styleUrl: './zf-calendar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ZfCalendarService],
    hostDirectives: [ZfEpisodeElementToggleDirective],
})
export class ZfCalendarComponent {
    readonly element = input.required<ZfEpisodesCalendarFragment>();
    readonly context = input.required<QuestionnaireContext>();

    protected readonly yearEndMarker = viewChild<never, ElementRef<HTMLElement>>('yearEndMarker', {
        read: ElementRef,
    });
    protected readonly yearStartMarker = viewChild<never, ElementRef<HTMLElement>>(
        'yearStartMarker',
        {
            read: ElementRef,
        },
    );

    readonly #service = inject(ZfCalendarService);
    readonly #episodeService = inject(ZF_EPISODE_SERVICE);
    readonly #qnrService = inject(QUESTIONNAIRE_SERVICE);
    readonly #destroyRef = inject(DestroyRef);
    protected readonly viewportService = inject(ViewportService);
    readonly state = computed(() => this.#service.makeState(this.element(), this.context()));

    readonly dialogOpen = signal(false);
    readonly gapDialogOpen = linkedSignal(() => {
        const element = this.element();
        return element.entries.some((entry) => entry.gap);
    });
    readonly gapDialogNavigating = signal(false);

    readonly categories: Signal<readonly ZfEpisodeCategoryFragment[]> = computed(() => {
        return this.element().episodeCategories;
    });

    readonly badges = computed(() => this.#service.createBadges(this.state()));
    readonly badgeGroups = computed(() =>
        this.#service.createBadgeGroups(this.state(), this.badges()),
    );
    readonly markers = computed(() => this.#service.createMarkers(this.state()));
    readonly markerGroups = computed(() =>
        this.#service.createMarkerGroups(this.state(), this.markers()),
    );
    readonly gapMarkers = computed(() => this.#service.createGapMarkers(this.state()));

    readonly months: Signal<readonly UiMonth[]> = computed(() => {
        const { startDate, endDate, viewEndDate, viewStartDate, lastMonth } = this.state();

        const months: UiMonth[] = [];
        let curr = viewStartDate;

        while (curr <= viewEndDate) {
            months.push({
                month: curr,
                disabled: curr > endDate || curr < startDate,
                isYearStart: curr.month === 1 || curr.toMillis() === viewStartDate.toMillis(),
                isLast: curr.toMillis() === lastMonth.toMillis(),
                isFirst: curr.toMillis() === viewStartDate.toMillis(),
            });
            curr = curr.plus({ months: 1 });
        }
        return months;
    });

    readonly years: Signal<readonly MappedUiYear[]> = computed(() => {
        const { startDate, endDate } = this.state();
        const months = this.months();
        if (months.length === 0) {
            return [];
        }
        const years: MappedUiYear[] = [];
        const firstYearMonths = 13 - months[0].month.month;
        const restOfTheYearsMonths = months.length - firstYearMonths;
        const yearCount = 1 + Math.ceil(restOfTheYearsMonths / 12);
        let previousYear: DateTime | null = null;
        let nextYear: DateTime | null = null;
        for (let i = 0; i < yearCount; i++) {
            const year = nextYear ?? months[i === 0 ? 0 : firstYearMonths + (i - 1) * 12].month;
            const nextYearIndex = i + 1;
            nextYear = nextYearIndex < yearCount ? months[firstYearMonths + i * 12].month : null;
            let monthCount: number;
            if (i === 0) {
                monthCount = 12 - startDate.month + 1;
            } else if (i === yearCount - 1) {
                monthCount = endDate.month;
            } else {
                monthCount = 12;
            }

            let colSub = 0;
            if (previousYear != null || nextYear != null) {
                colSub = Math.min(monthCount - 1, 2);
            }

            years.push({
                year,
                yearMarkerColWidth: monthCount,
                yearMarkerColWidthSubDesktop: colSub,
                previous: previousYear,
                next: nextYear,
                previousGoesToFirst: i === 1,
                nextGoesToLast: nextYearIndex + 1 === yearCount,
            });
            previousYear = year;
        }
        return years;
    });

    readonly columns = computed(() => {
        return this.months().length;
    });

    protected readonly calendarZoom = computed(() => {
        const monthsPerPage = this.#service.viewMode().monthsPerPage;
        // Transform the "infinite" we have to -1 for the paradata
        return isFinite(monthsPerPage) ? monthsPerPage : -1;
    });

    currentPage = signal(0);
    mobileCategoryTitlesHidden = signal(true);

    readonly monthsPerPage = computed(() => {
        const viewMode = this.#service.viewMode();
        return Math.min(Math.max(this.columns(), 6), viewMode.monthsPerPage);
    });
    readonly editingEpisode = signal<ZfEpisodeEntryFragment | null>(null);
    readonly newEpisodePrefill = signal<Partial<ZfEpisodeEntryFragment> | null>(null);
    readonly newEpisodeTypeCategory = signal<ZfEpisodeCategoryFragment | null>(null);

    protected readonly tourMode: boolean;
    protected readonly resolvedEditingEpisode: Signal<ZfEpisodeEntryFragment | null>;
    protected readonly resolvedDialogOpen: Signal<boolean>;
    protected readonly dialogVisiblyHidden: Signal<boolean>;
    protected readonly forceAddEpisodeHighlight:
        | Signal<ForcedAddEpisodeHighlight | undefined>
        | undefined;
    protected readonly highlightEpisodes: Signal<readonly string[] | undefined> | undefined;

    protected readonly scrollAtEnd = signal(false);
    protected readonly scrollAtStart = signal(false);

    readonly #hostElement = inject<ElementRef<HTMLElement>>(ElementRef);

    constructor() {
        const tourState = inject(APP_TOUR_STATE);
        const tourStep = tourState.currentStep;
        if (tourStep == null) {
            this.tourMode = false;
            this.resolvedEditingEpisode = this.editingEpisode;
            this.resolvedDialogOpen = this.dialogOpen;
            this.forceAddEpisodeHighlight = undefined;
            this.dialogVisiblyHidden = signal(false);
            this.highlightEpisodes = undefined;
        } else {
            this.tourMode = true;
            this.resolvedEditingEpisode = computed(() => {
                const episodeId = tourStep().showEpisodeDialog;
                if (episodeId == null) {
                    return null;
                } else {
                    return this.element().entries.find((e) => e.id === episodeId) ?? null;
                }
            });
            // Dialog must always be open during the Tour, so that we can animate the highlight :|
            this.resolvedDialogOpen = signal(true);
            this.dialogVisiblyHidden = computed(() => tourStep().showEpisodeDialog == null);
            this.forceAddEpisodeHighlight = computed(() => tourStep().highlightEpisodeAdd);
            this.highlightEpisodes = computed(() => tourStep().highlightEpisodes);
        }

        ZfEpisodeElementToggleDirective.setViewType('calendar');
        const toggleDirective = inject(ZfEpisodeElementToggleDirective);
        this.#qnrService.hideRootNavigationForThisElement(
            computed(() => !toggleDirective.isHidden()),
        );

        const intersectionObserver = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    const intersecting = entry.isIntersecting;
                    const isStart = entry.target.getAttribute('data-lla-year-marker') === 'start';
                    (isStart ? this.scrollAtStart : this.scrollAtEnd).set(intersecting);
                }
            },
            {
                root: this.#hostElement.nativeElement,
            },
        );
        effect((onCleanup) => {
            const yearEndMarker = this.yearEndMarker()?.nativeElement;
            if (yearEndMarker != null) {
                intersectionObserver.observe(yearEndMarker);
                onCleanup(() => intersectionObserver.unobserve(yearEndMarker));
            }
            const yearStartMarker = this.yearStartMarker()?.nativeElement;
            if (yearStartMarker != null) {
                intersectionObserver.observe(yearStartMarker);
                onCleanup(() => intersectionObserver.unobserve(yearStartMarker));
            }
        });
        inject(DestroyRef).onDestroy(() => intersectionObserver.disconnect());
    }

    removeEpisode(id: string) {
        this.#episodeService.removeEpisode(id);
    }

    newEpisode(
        data: Partial<ZfEpisodeEntryFragment> | null = null,
        category: ZfEpisodeCategoryFragment | null = null,
    ) {
        this.editingEpisode.set(null);
        this.newEpisodePrefill.set(data);
        this.newEpisodeTypeCategory.set(category);
        this.dialogOpen.set(true);
    }

    editEpisode(episode: ZfEpisodeEntryFragment) {
        if (episode.allowEditDialog) {
            this.editingEpisode.set(episode);
            this.newEpisodeTypeCategory.set(null);
            this.newEpisodePrefill.set(null);
            this.dialogOpen.set(true);
        } else {
            this.#episodeService.navigateToEpisodeDetails(episode.id).subscribe({
                error: (err: unknown) => {
                    console.error('Failed to navigate to episode details directly', err);
                },
            });
        }
    }

    gapClick(episode: ZfEpisodeEntryFragment) {
        this.#episodeService
            .handleGapClick(episode)
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe((result) => {
                if (result.type === 'new-episode') {
                    this.newEpisode(result.episodeData);
                }
            });
    }

    closeDialog() {
        this.dialogOpen.set(false);
        this.editingEpisode.set(null);
        this.newEpisodeTypeCategory.set(null);
        this.newEpisodePrefill.set(null);
    }

    scrollToYear(year: DateTime) {
        const marker = this.#hostElement.nativeElement.querySelector(
            `[data-lla-calendar-year-start="${String(year.year)}"]`,
        );
        if (marker == null) {
            console.warn(`Failed to find year-start marker for year`, year.toISODate());
        } else {
            marker.scrollIntoView({
                // container: 'nearest',
                block: 'nearest',
                inline: 'start',
                behavior: 'smooth',
            });
        }
    }

    gapDialogNo() {
        if (this.gapDialogNavigating()) {
            return;
        }
        this.gapDialogNavigating.set(true);
        this.#qnrService
            .next()
            .pipe(finalize(() => this.gapDialogNavigating.set(false)))
            .subscribe({
                error: (err: unknown) =>
                    console.error('Failed to navigate on gap dialog click', err),
            });
    }
}
