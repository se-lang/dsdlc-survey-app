import { computed, Injectable, signal } from '@angular/core';
import { DateTime } from '../../util/luxon';
import {
    ZfEpisodeCategoryFragment,
    ZfEpisodeEntryFragment,
    ZfEpisodesTableFragment,
    ZfEpisodeTypeFragment,
} from '../../generated/graphql';
import { i18nCompute } from '../../services/i18n/i18n.utils';
import { checkNotNull } from '../../util/checks';

export interface MappedEpisodeBase {
    start: DateTime;
    end: DateTime;
    episode: ZfEpisodeEntryFragment;
    categorySortIndex: number;
    categoryId: string | null;
    typeLabel: string;
}

export interface MappedEpisodeReal extends MappedEpisodeBase {
    entryType: 'episode';
    type: ZfEpisodeTypeFragment;
    category: ZfEpisodeCategoryFragment;
}

export interface MappedEpisodeGap extends MappedEpisodeBase {
    entryType: 'gap';
}

export type MappedEpisode = MappedEpisodeReal | MappedEpisodeGap;

export type SortKey = 'episodeTypeId' | 'label' | 'startDate' | 'endDate' | 'category';

export interface SortBy {
    key: SortKey;
    dir: number;
}

@Injectable()
export class ZfEpisodeTableService {
    readonly sortBy = signal<SortBy>({
        key: 'startDate',
        dir: 1,
    });

    readonly categoryFilter = signal<readonly string[]>([]);

    #localeSorter = i18nCompute((t) => {
        return new Intl.Collator(t.getActiveLang(), {
            sensitivity: 'base',
        });
    });

    #sorter = computed<(a: MappedEpisode, b: MappedEpisode) => number>(() => {
        const { key, dir } = this.sortBy();
        let localeSorter: Intl.Collator;
        switch (key) {
            case 'episodeTypeId':
                localeSorter = this.#localeSorter();
                return (a, b) => {
                    if (a.categorySortIndex === b.categorySortIndex) {
                        return dir * localeSorter.compare(a.typeLabel, b.typeLabel);
                    } else {
                        return dir * (a.categorySortIndex - b.categorySortIndex);
                    }
                };
            case 'label':
                localeSorter = this.#localeSorter();
                return (a, b) => dir * localeSorter.compare(a.episode.label, b.episode.label);
            case 'category':
                return (a, b) => dir * (a.categorySortIndex - b.categorySortIndex);
            case 'startDate':
                return (a, b) => dir * (a.start.toMillis() - b.start.toMillis());
            case 'endDate':
                return (a, b) => dir * (a.end.toMillis() - b.end.toMillis());
        }
    });

    setSortBy(newKey: SortKey) {
        this.sortBy.update(({ key, dir }) =>
            key === newKey ? { key, dir: dir * -1 } : { key: newKey, dir: 1 },
        );
    }

    makeSortedEpisodes(element: ZfEpisodesTableFragment) {
        let episodes = element.entries.flatMap((episode) => {
            if (episode.gap) {
                return {
                    entryType: 'gap',
                    episode,
                    start: DateTime.fromISO(episode.startDate),
                    end: DateTime.fromISO(episode.endDate),
                    categorySortIndex: -1,
                    typeLabel: '',
                    categoryId: null,
                } satisfies MappedEpisodeGap;
            }
            const episodeType = checkNotNull(
                element.episodeTypes.find((t) => t.id === episode.episodeTypeId),
            );
            const category = checkNotNull(
                element.episodeCategories.find((c) => c.typeIds.includes(episode.episodeTypeId)),
            );
            return {
                entryType: 'episode',
                episode,
                start: DateTime.fromISO(episode.startDate),
                end: DateTime.fromISO(episode.endDate),
                category: category,
                type: episodeType,
                typeLabel: episodeType.label,
                categorySortIndex: category.sortIndex,
                categoryId: category.id,
            } satisfies MappedEpisodeReal;
        });
        const categoryFilter: ReadonlyArray<string | null> = this.categoryFilter();
        if (categoryFilter.length !== 0) {
            episodes = episodes.filter((e) => categoryFilter.includes(e.categoryId));
        }
        episodes.sort(this.#sorter());
        return episodes;
    }

    toggleCategoryFilter(categoryId: string) {
        this.categoryFilter.update((filter) => {
            const index = filter.indexOf(categoryId);
            if (index === -1) {
                return [...filter, categoryId];
            } else {
                const next = [...filter];
                next.splice(index, 1);
                return next;
            }
        });
    }
}
