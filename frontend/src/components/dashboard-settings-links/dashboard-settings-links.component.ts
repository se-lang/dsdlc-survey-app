import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { SettingsLink } from '../../services/settings-links.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { uniqueComponentId } from '../../util/unique-component-id';
import { NgTemplateOutlet } from '@angular/common';

@Component({
    selector: 'lla-dashboard-settings-links',
    imports: [RouterLink, RouterLinkActive, TranslocoDirective, NgTemplateOutlet],
    templateUrl: './dashboard-settings-links.component.html',
    styleUrl: './dashboard-settings-links.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardSettingsLinksComponent {
    readonly settingsLinks = input.required<readonly SettingsLink[]>();

    protected readonly componentId = uniqueComponentId('links');

    protected readonly expandedId = signal<number | null>(null);

    toggleExpanded(id: number) {
        this.expandedId.update((current) => (current !== id ? id : null));
    }
}
