import { ChangeDetectionStrategy, Component, computed, inject, input, Signal } from '@angular/core';
import { ZfEpisodeCategoryFragment, ZfEpisodesBaseFragment } from '../../../generated/graphql';
import { IconDirective } from '../../../components/icon/icon.directive';
import { ZfEpisodeColorStylesDirective } from '../../zf-episode-color-styles.directive';
import { ZfEpisodeTableService } from '../zf-episode-table.service';

interface MappedCategory {
    category: ZfEpisodeCategoryFragment;
    selected: boolean;
}

@Component({
    selector: 'lla-zf-episode-table-filter',
    imports: [IconDirective, ZfEpisodeColorStylesDirective],
    templateUrl: './zf-episode-table-filter.component.html',
    styleUrl: './zf-episode-table-filter.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZfEpisodeTableFilterComponent {
    readonly element = input.required<ZfEpisodesBaseFragment>();

    protected readonly tableService = inject(ZfEpisodeTableService);
    protected readonly categories: Signal<MappedCategory[]> = computed(() => {
        const filter = this.tableService.categoryFilter();
        return this.element().episodeCategories.map((category) => {
            return {
                category,
                selected: filter.includes(category.id),
            };
        });
    });
}
