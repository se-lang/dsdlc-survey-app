import {
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    inject,
    input,
    signal,
    Signal,
} from '@angular/core';
import { ZfEpisodeEntryFragment, ZfEpisodesTableFragment } from '../../../generated/graphql';

import { TranslocoDirective } from '@jsverse/transloco';
import { DatePipe } from '../../../locale/date.pipe';
import { IconDirective } from '../../../components/icon/icon.directive';
import { ZfEpisodeTableSortHeaderComponent } from '../zf-episode-table-sort-header/zf-episode-table-sort-header.component';
import { MappedEpisode, ZfEpisodeTableService } from '../zf-episode-table.service';
import { ZfEpisodeElementToggleDirective } from '../../zf-episode-element-toggle.directive';
import { DialogComponent } from '../../../components/dialog/dialog/dialog.component';
import { ZfEpisodeDialogComponent } from '../../zf-episode-dialog/zf-episode-dialog.component';
import { ZfEpisodeColorStylesDirective } from '../../zf-episode-color-styles.directive';
import { ZfEpisodeTableFilterComponent } from '../zf-episode-table-filter/zf-episode-table-filter.component';
import { ViewportService } from '../../../services/viewport.service';
import { ZfEpisodeSidebarSortElementComponent } from '../zf-episode-sidebar-sort-element/zf-episode-sidebar-sort-element.component';
import { MobileSidebarComponent } from '../../../components/mobile-sidebar/mobile-sidebar.component';
import { ZfEpisodeNavigationComponent } from '../../zf-episode-navigation/zf-episode-navigation.component';
import {
    QUESTIONNAIRE_SERVICE,
    QuestionnaireContext,
} from '../../../services/qnr/questionnaire-service-interface';
import { ZF_EPISODE_SERVICE } from '../../../services/zf/zf-episode.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TourHighlightElementDirective } from '../../../components/tour/tour-highlight-element.directive';

@Component({
    selector: 'lla-zf-episode-table',
    imports: [
        TranslocoDirective,
        DatePipe,
        IconDirective,
        ZfEpisodeTableSortHeaderComponent,
        DialogComponent,
        ZfEpisodeDialogComponent,
        ZfEpisodeColorStylesDirective,
        ZfEpisodeTableFilterComponent,
        ZfEpisodeSidebarSortElementComponent,
        MobileSidebarComponent,
        ZfEpisodeNavigationComponent,
        TourHighlightElementDirective,
    ],
    templateUrl: './zf-episode-table.component.html',
    styleUrl: './zf-episode-table.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ZfEpisodeTableService],
    hostDirectives: [ZfEpisodeElementToggleDirective],
})
export class ZfEpisodeTableComponent {
    readonly element = input.required<ZfEpisodesTableFragment>();
    readonly context = input.required<QuestionnaireContext>();

    readonly #destroyRef = inject(DestroyRef);
    protected readonly service = inject(ZfEpisodeTableService);
    protected readonly zfEpisodeService = inject(ZF_EPISODE_SERVICE);
    protected readonly viewportService = inject(ViewportService);

    protected readonly episodes: Signal<MappedEpisode[]> = computed(() => {
        return this.service.makeSortedEpisodes(this.element());
    });

    protected readonly editingEpisode = signal<ZfEpisodeEntryFragment | null>(null);
    protected readonly newEpisodePrefill = signal<Partial<ZfEpisodeEntryFragment> | null>(null);
    protected readonly dialogOpen = signal(false);

    constructor() {
        ZfEpisodeElementToggleDirective.setViewType('list');
        const toggleDirective = inject(ZfEpisodeElementToggleDirective);
        inject(QUESTIONNAIRE_SERVICE).hideRootNavigationForThisElement(
            computed(() => !toggleDirective.isHidden()),
        );
    }

    protected removeEpisode(id: string) {
        this.zfEpisodeService.removeEpisode(id);
    }

    editClick(episode: MappedEpisode) {
        if (episode.episode.gap) {
            this.zfEpisodeService
                .handleGapClick(episode.episode)
                .pipe(takeUntilDestroyed(this.#destroyRef))
                .subscribe((result) => {
                    if (result.type === 'new-episode') {
                        this.newEpisode(result.episodeData);
                    }
                });
        } else {
            this.newEpisodePrefill.set(null);
            this.editingEpisode.set(episode.episode);
            this.dialogOpen.set(true);
        }
    }

    newEpisode(data: Partial<ZfEpisodeEntryFragment> | null = null) {
        this.newEpisodePrefill.set(data);
        this.editingEpisode.set(null);
        this.dialogOpen.set(true);
    }
}
