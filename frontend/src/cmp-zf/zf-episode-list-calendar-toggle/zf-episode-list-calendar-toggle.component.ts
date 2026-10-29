import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IconToggleButtonComponent } from '../../components/icon-toggle-button/icon-toggle-button/icon-toggle-button.component';
import { IconToggleButtonOptionDirective } from '../../components/icon-toggle-button/icon-toggle-button-option.directive';
import { injectFromCurrentQnr } from '../../services/qnr/global-qnr-access';
import { TranslocoDirective } from '@jsverse/transloco';
import { ViewportService } from '../../services/viewport.service';
import { ZF_EPISODE_SERVICE } from '../../services/zf/zf-episode.interface';
import { TourHighlightElementDirective } from '../../components/tour/tour-highlight-element.directive';

@Component({
    selector: 'lla-zf-episode-list-calendar-toggle',
    imports: [
        IconToggleButtonComponent,
        IconToggleButtonOptionDirective,
        TranslocoDirective,
        TourHighlightElementDirective,
    ],
    templateUrl: './zf-episode-list-calendar-toggle.component.html',
    styleUrl: './zf-episode-list-calendar-toggle.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZfEpisodeListCalendarToggleComponent {
    protected readonly zfEpisodeService = injectFromCurrentQnr(ZF_EPISODE_SERVICE);
    protected readonly viewportService = inject(ViewportService);
}
