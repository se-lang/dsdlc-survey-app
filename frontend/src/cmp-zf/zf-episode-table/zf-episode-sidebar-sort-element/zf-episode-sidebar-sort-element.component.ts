import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { SortKey, ZfEpisodeTableService } from '../zf-episode-table.service';
import { IconDirective } from '../../../components/icon/icon.directive';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'li[llaZfEpisodeSidebarElement]',
    imports: [IconDirective],
    templateUrl: './zf-episode-sidebar-sort-element.component.html',
    styleUrl: './zf-episode-sidebar-sort-element.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[attr.aria-sort]': 'ariaSort()',
    },
})
export class ZfEpisodeSidebarSortElementComponent {
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
