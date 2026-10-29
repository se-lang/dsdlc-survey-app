import { ChangeDetectionStrategy, Component, computed, ElementRef, inject } from '@angular/core';
import { QUESTIONNAIRE_SERVICE } from '../../services/qnr/questionnaire-service-interface';
import { DialogComponent } from '../../components/dialog/dialog/dialog.component';
import { DialogContentComponent } from '../../components/dialog/dialog-content/dialog-content.component';
import { DialogFooterComponent } from '../../components/dialog/dialog-footer/dialog-footer.component';
import { DialogHeaderComponent } from '../../components/dialog/dialog-header/dialog-header.component';
import { QnrLastUpdateInfoComponent } from '../../components/qnr-last-update-info/qnr-last-update-info.component';
import { QnrNavigationComponent } from '../../components/qnr-navigation/qnr-navigation.component';
import { QnrPageContentsComponent } from '../qnr-page-contents/qnr-page-contents.component';
import { TranslocoDirective } from '@jsverse/transloco';
import { ViewportService } from '../../services/viewport.service';
import { i18nCompute } from '../../services/i18n/i18n.utils';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { formatDate } from '../../locale/date-formats';
import { QnrPageLayoutFragment } from '../../generated/graphql';
import { ZfEpisodeColorStylesDirective } from '../../cmp-zf/zf-episode-color-styles.directive';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TourHighlightElementDirective } from '../../components/tour/tour-highlight-element.directive';

const boxedLayouts: Array<string | undefined> = [
    'ZfEpisodeBoxedLayout',
    'QuestionnairePageLayoutBoxed',
] satisfies Array<QnrPageLayoutFragment['__typename']>;

@Component({
    selector: 'lla-qnr-page',
    imports: [
        DialogComponent,
        DialogContentComponent,
        DialogFooterComponent,
        DialogHeaderComponent,
        QnrLastUpdateInfoComponent,
        QnrNavigationComponent,
        QnrPageContentsComponent,
        TranslocoDirective,
        ZfEpisodeColorStylesDirective,
        TourHighlightElementDirective,
    ],
    templateUrl: './qnr-page.component.html',
    styleUrl: './qnr-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QnrPageComponent {
    protected readonly service = inject(QUESTIONNAIRE_SERVICE);
    protected readonly viewportService = inject(ViewportService);

    protected readonly isBoxedLayout = computed(() => {
        return boxedLayouts.includes(this.service.context()?.page.layout.__typename);
    });
    protected readonly boxedLayoutTitle = computed(() => {
        const layout = this.service.context()?.page.layout;
        switch (layout?.__typename) {
            case 'ZfEpisodeBoxedLayout':
                return layout.episode.label;
            case 'QuestionnairePageLayoutBoxed':
                return layout.title;
            default:
                return '';
        }
    });
    protected readonly boxedLayoutSubtitle = i18nCompute((t) => {
        const layout = this.service.context()?.page.layout;
        switch (layout?.__typename) {
            case 'ZfEpisodeBoxedLayout':
                return t.translate(marker('zofarEpisodes.detailQuestionSubtitle'), {
                    startDate: formatDate(layout.episode.startDate, t, 'longMonthYear'),
                    endDate: formatDate(layout.episode.endDate, t, 'longMonthYear'),
                });
            default:
                return undefined;
        }
    });
    protected readonly boxedLayoutEpisode = computed(() => {
        const layout = this.service.context()?.page.layout;
        switch (layout?.__typename) {
            case 'ZfEpisodeBoxedLayout':
                return layout.episode;
            default:
                return null;
        }
    });

    constructor() {
        const hostElement = inject<ElementRef<HTMLElement>>(ElementRef);
        this.service.focusInvalidFormElement.pipe(takeUntilDestroyed()).subscribe(() => {
            hostElement.nativeElement.querySelector<HTMLElement>('.ng-invalid')?.focus();
        });
    }
}
