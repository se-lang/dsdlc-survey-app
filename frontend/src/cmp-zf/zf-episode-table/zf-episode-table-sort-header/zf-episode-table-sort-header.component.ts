import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { SortKey, ZfEpisodeTableService } from '../zf-episode-table.service';
import { IconDirective } from '../../../components/icon/icon.directive';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'th[llaZfEpisodeTableHeader]',
    imports: [IconDirective],
    templateUrl: './zf-episode-table-sort-header.component.html',
    styleUrl: './zf-episode-table-sort-header.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[attr.aria-sort]': 'ariaSort()',
    },
})
export class ZfEpisodeTableSortHeaderComponent {
    readonly sortKey = input.required<SortKey>();
    protected readonly service = inject(ZfEpisodeTableService);
    protected readonly ariaSort = computed(() => {
        const sortBy = this.service.sortBy();
        if (sortBy.key === this.sortKey()) {
            return sortBy.dir === -1 ? 'descending' : 'ascending';
        } else {
            return null;
        }
    });
    protected readonly sorted = computed(() => this.service.sortBy().key === this.sortKey());
}
