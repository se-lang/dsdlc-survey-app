import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';
import { NavigationEnd, Params, Router, RouterLink } from '@angular/router';
import { IconDirective } from '../icon/icon.directive';
import { ZfEpisodeListCalendarToggleComponent } from '../../cmp-zf/zf-episode-list-calendar-toggle/zf-episode-list-calendar-toggle.component';
import { TranslocoDirective } from '@jsverse/transloco';
import { QnrLastUpdateInfoComponent } from '../qnr-last-update-info/qnr-last-update-info.component';
import { ViewportService } from '../../services/viewport.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import { TOUR_LINK_PREVIOUS_PARAM } from '../../services/tour/tour-link';
import { LoginStateService } from '../../services/login/login-state.service';
import { injectFromCurrentQnr } from '../../services/qnr/global-qnr-access';
import { ZF_EPISODE_SERVICE } from '../../services/zf/zf-episode.interface';
import { TourHighlightElementDirective } from '../tour/tour-highlight-element.directive';
import { SideMenuService } from '../../services/side-menu.service';

@Component({
    selector: 'lla-top-menu',
    imports: [
        LanguageSwitcherComponent,
        RouterLink,
        IconDirective,
        ZfEpisodeListCalendarToggleComponent,
        TranslocoDirective,
        QnrLastUpdateInfoComponent,
        TourHighlightElementDirective,
    ],
    templateUrl: './top-menu.component.html',
    styleUrl: './top-menu.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopMenuComponent {
    protected readonly viewportService = inject(ViewportService);
    protected readonly sideMenuService = inject(SideMenuService);
    protected readonly isLoggedIn = toSignal(inject(LoginStateService).isLoggedIn());
    protected readonly zfEpisodeService = injectFromCurrentQnr(ZF_EPISODE_SERVICE);
    protected readonly showTourLink = computed(() => {
        const elements = this.zfEpisodeService()?.presentEpisodeElements();
        return elements?.table || elements?.calendar;
    });

    protected readonly tourLinkQueryParams: Signal<Params | undefined>;

    constructor() {
        const router = inject(Router);
        this.tourLinkQueryParams = toSignal(
            router.events.pipe(
                filter((event) => event instanceof NavigationEnd),
                map((event) => event.url),
                startWith(router.url),
                map((url) => ({ [TOUR_LINK_PREVIOUS_PARAM]: url })),
            ),
        );
    }
}
