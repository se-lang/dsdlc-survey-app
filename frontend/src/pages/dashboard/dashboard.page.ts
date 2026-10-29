import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    Injector,
    signal,
} from '@angular/core';
import { DialogHeaderComponent } from '../../components/dialog/dialog-header/dialog-header.component';
import { DialogContentComponent } from '../../components/dialog/dialog-content/dialog-content.component';
import { RouterOutlet } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { DialogSidebarComponent } from '../../components/dialog/dialog-sidebar/dialog-sidebar.component';
import { LogoutTriggerDirective } from '../../directives/logout-trigger.directive';
import { SettingsLinksService } from '../../services/settings-links.service';
import { DashboardSettingsLinksComponent } from '../../components/dashboard-settings-links/dashboard-settings-links.component';
import { DialogSubheaderComponent } from '../../components/dialog/dialog-subheader/dialog-subheader.component';
import { i18nCompute } from '../../services/i18n/i18n.utils';
import { SideMenuService } from '../../services/side-menu.service';
import { MobileSidebarComponent } from '../../components/mobile-sidebar/mobile-sidebar.component';
import { NgTemplateOutlet } from '@angular/common';
import { IconDirective } from '../../components/icon/icon.directive';

@Component({
    selector: 'lla-dashboard',
    imports: [
        DialogHeaderComponent,
        DialogContentComponent,
        TranslocoDirective,
        DialogSidebarComponent,
        LogoutTriggerDirective,
        RouterOutlet,
        DashboardSettingsLinksComponent,
        DialogSubheaderComponent,
        MobileSidebarComponent,
        NgTemplateOutlet,
        IconDirective,
    ],
    templateUrl: './dashboard.page.html',
    styleUrl: './dashboard.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {
    protected readonly settingsLinks = inject(SettingsLinksService).createSettingsLinks();
    protected readonly sideMenuService = inject(SideMenuService);
    protected readonly sidebarOpen = signal(false);

    readonly #injector = inject(Injector);

    readonly title = signal<(() => string) | string | null>(null);
    protected readonly resolvedTitle = computed(() => {
        const title = this.title();
        if (typeof title === 'function') {
            return title();
        } else {
            return null;
        }
    });
    protected readonly resolvedTitleSignal = computed(() => {
        const title = this.title();
        if (typeof title === 'string') {
            return i18nCompute((t) => t.translate(title), { injector: this.#injector });
        } else {
            return null;
        }
    });

    constructor() {
        this.sideMenuService.bindToSignal(this.sidebarOpen);
    }
}
