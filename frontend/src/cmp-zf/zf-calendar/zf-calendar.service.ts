import { Injectable, signal } from '@angular/core';
import {
    ZfEpisodeEntryFragment,
    ZfEpisodesCalendarFragment,
    ZfEpisodeTypeFragment,
} from '../../generated/graphql';
import { DateTime } from '../../util/luxon';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { checkNotNull } from '../../util/checks';

import { QuestionnaireContext } from '../../services/qnr/questionnaire-service-interface';

export interface CalendarViewModeBase {
    readonly minMonths: number;
    readonly monthsPerPage: number; // Infinity to show all
}

export interface CalendarViewModeLabel extends CalendarViewModeBase {
    readonly label: string;
}

export interface CalendarViewModeDuration extends CalendarViewModeBase {
    readonly duration: Intl.Duration;
}

export interface ElementGroup {
    id: string | number;
}

interface HasStart {
    start: DateTime;
}

export interface CalendarEntry {
    start: DateTime;
    episodeEntry: ZfEpisodeEntryFragment;
    cssStart: string;
}

export interface RealCalendarEntry extends CalendarEntry {
    episodeType: ZfEpisodeTypeFragment;
    category: string;
}

export interface GapEntry extends CalendarEntry {
    end: DateTime;
    cssWidth: string;
}

export interface Marker extends RealCalendarEntry {
    end: DateTime;
    text: string;
    cssWidth: string;
}

export interface CalendarGroup<CalendarEntry> extends ElementGroup {
    id: string;
    rows: CalendarEntry[][];
    items: CalendarEntry[];
}

export interface BadgeEntry {
    month: DateTime;
    episodeEntry: ZfEpisodeEntryFragment;
}

export interface CalendarBadgeGroup extends ElementGroup {
    cssOffset: string;
    month: DateTime;
    badges: BadgeEntry[];
}

export interface MarkerGroup extends ElementGroup {
    markers: Marker[];
    rows: Marker[][];
}

export type CalendarViewMode = CalendarViewModeLabel | CalendarViewModeDuration;

export const calendarViewModes: readonly CalendarViewMode[] = [
    {
        minMonths: 0,
        monthsPerPage: 6,
        duration: { months: 6 },
    },
    {
        minMonths: 0,
        monthsPerPage: 12,
        duration: { years: 1 },
    },
    {
        minMonths: 24,
        monthsPerPage: 24,
        duration: { years: 2 },
    },
    {
        minMonths: 60,
        monthsPerPage: 60,
        duration: { years: 5 },
    },
    {
        minMonths: 0,
        monthsPerPage: Infinity,
        label: marker('zofarEpisodes.viewModeAll'),
    },
];

export interface ZfCalendarState {
    readonly element: ZfEpisodesCalendarFragment;
    readonly context: QuestionnaireContext;
    readonly startDate: DateTime;
    readonly endDate: DateTime;
    readonly viewStartDate: DateTime;
    readonly viewEndDate: DateTime;
    readonly lastMonth: DateTime;
    readonly monthsInView: number;
}

@Injectable()
export class ZfCalendarService {
    makeState(element: ZfEpisodesCalendarFragment, context: QuestionnaireContext): ZfCalendarState {
        const startDate = DateTime.fromISO(element.minDate);
        const endDate = DateTime.fromISO(element.maxDate);
        const viewStartDate = startDate;
        const viewEndDate = endDate;

        const maxMonths = Math.floor(
            viewEndDate
                .plus({ days: 1 })
                .startOf('month')
                .diff(viewStartDate.startOf('month'), 'months').months,
        );
        const monthsInView = Math.min(maxMonths, 12);

        return {
            element,
            context,
            startDate,
            endDate,
            viewStartDate,
            viewEndDate,
            lastMonth: endDate.startOf('month'),
            monthsInView,
        };
    }

    readonly viewMode = signal<CalendarViewMode>(calendarViewModes[1]);

    createMarkers({
        element,
        viewStartDate,
        viewEndDate,
        monthsInView,
    }: ZfCalendarState): Marker[] {
        const markers: Marker[] = element.entries.flatMap((e) => {
            if (e.event || e.gap) {
                return [];
            }
            const markerStart = DateTime.fromISO(e.startDate);
            const markerEnd = DateTime.fromISO(e.endDate);

            if (markerStart > viewEndDate || markerEnd < viewStartDate) {
                return [];
            }

            const start = DateTime.max(markerStart, viewStartDate);
            const end = DateTime.min(markerEnd, viewEndDate);
            return {
                text: e.label,
                start: start,
                end: end,
                episodeType: checkNotNull(
                    element.episodeTypes.find((t) => t.id === e.episodeTypeId),
                ),
                episodeEntry: e,
                cssStart: this.#diffToUiWidth(viewStartDate, start, monthsInView),
                cssWidth: this.#diffToUiWidth(start, end.plus({ days: 1 }), monthsInView),
                category: e.episodeTypeId,
            } satisfies Marker;
        });

        // Sort markers by start date, which is needed for markerGroups algorithm
        markers.sort((a, b) => a.start.toMillis() - b.start.toMillis());

        return markers;
    }

    createGapMarkers({
        element,
        viewStartDate,
        viewEndDate,
        monthsInView,
    }: ZfCalendarState): GapEntry[] {
        return element.entries.flatMap((e) => {
            if (!e.gap) {
                return [];
            }
            const markerStart = DateTime.fromISO(e.startDate);
            const markerEnd = DateTime.fromISO(e.endDate);

            if (markerStart > viewEndDate || markerEnd < viewStartDate) {
                return [];
            }
            const start = DateTime.max(markerStart, viewStartDate);
            const end = DateTime.min(markerEnd, viewEndDate);
            return {
                start: start,
                end: end,
                episodeEntry: e,
                cssStart: this.#diffToUiWidth(viewStartDate, start, monthsInView),
                cssWidth: this.#diffToUiWidth(start, end.plus({ days: 1 }), monthsInView),
            } satisfies GapEntry;
        });
    }

    createBadges({ element, viewStartDate, viewEndDate }: ZfCalendarState): BadgeEntry[] {
        return element.entries.flatMap((e) => {
            if (!e.event) return [];
            const markerStart = DateTime.fromISO(e.startDate);
            if (markerStart > viewEndDate || markerStart < viewStartDate) {
                return [];
            }

            return {
                month: DateTime.fromISO(e.startDate).startOf('month'),
                episodeEntry: e,
            } satisfies BadgeEntry;
        });
    }

    groupByCollision<CalendarEntry extends HasStart>(
        items: readonly CalendarEntry[],
        collides: (a: CalendarEntry, b: CalendarEntry) => boolean,
        fitsAfter: (last: CalendarEntry, curr: CalendarEntry) => boolean,
        idPrefix: string,
    ): Array<CalendarGroup<CalendarEntry>> {
        const groups: Array<CalendarGroup<CalendarEntry>> = [];
        const sorted = [...items].sort((a, b) => +a.start - +b.start);

        for (const item of sorted) {
            let added = false;

            for (const group of groups) {
                if (!group.items.some((i) => collides(i, item))) {
                    continue;
                }
                let placed = false;
                for (const row of group.rows) {
                    const last = row[row.length - 1];
                    if (fitsAfter(last, item)) {
                        row.push(item);
                        placed = true;
                        break;
                    }
                }
                if (!placed) {
                    group.rows.push([item]);
                }
                group.items.push(item);
                added = true;
                break;
            }
            if (!added) {
                groups.push({
                    id: `${idPrefix}-${String(groups.length)}`,
                    rows: [[item]],
                    items: [item],
                });
            }
        }
        return groups;
    }

    createBadgeGroups(
        { element, viewStartDate, monthsInView }: ZfCalendarState,
        badges: readonly BadgeEntry[],
    ): CalendarBadgeGroup[][] {
        return element.episodeCategories.map((cat) => {
            const categoryBadges = badges.filter((b) =>
                cat.typeIds.includes(b.episodeEntry.episodeTypeId),
            );
            const groups: CalendarBadgeGroup[] = [];
            categoryBadges.sort((a, b) => +a.month - +b.month);
            let currentGroup: CalendarBadgeGroup | null = null;
            for (const badge of categoryBadges) {
                if (currentGroup == null || !currentGroup.month.equals(badge.month)) {
                    currentGroup = {
                        id: badge.month.toMillis(),
                        month: badge.month,
                        badges: [],
                        cssOffset: this.#diffToUiWidth(viewStartDate, badge.month, monthsInView),
                    };
                    groups.push(currentGroup);
                }
                currentGroup.badges.push(badge);
            }
            return groups;
        });
    }

    createMarkerGroups({ element }: ZfCalendarState, markers: readonly Marker[]): MarkerGroup[][] {
        return element.episodeCategories.map((cat) => {
            const categoryMarkers = markers.filter((m) =>
                cat.typeIds.includes(m.episodeEntry.episodeTypeId),
            );
            const groups: Array<CalendarGroup<Marker>> = this.groupByCollision<Marker>(
                categoryMarkers,
                (a: Marker, b: Marker) => a.start <= b.end && a.end >= b.start,
                (last: Marker, curr: Marker) => last.end < curr.start,
                cat.id,
            );
            return groups.map((g) => ({
                id: g.id,
                rows: g.rows,
                markers: g.items,
            }));
        });
    }

    /**
     * Convert the diff between the two dates into CSS width.
     * Note: end is exclusive!
     * @param start
     * @param end
     * @param monthsInView
     * @private
     */
    #diffToUiWidth(start: DateTime, end: DateTime, monthsInView: number): string {
        const daysInFirstMonth = start.daysInMonth - (start.day - 1);
        const daysInLastMonth = end.day - 1;

        const monthDiff = end
            .startOf('month')
            .diff(start.plus({ months: 1 }).startOf('month'), ['months']).months;

        const percentage =
            ((monthDiff +
                daysInFirstMonth / start.daysInMonth +
                daysInLastMonth / end.daysInMonth) /
                monthsInView) *
            100;
        return `${percentage.toFixed(5)}%`;
    }
}
