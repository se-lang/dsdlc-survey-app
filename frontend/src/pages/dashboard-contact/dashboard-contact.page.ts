import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { i18nCompute } from '../../services/i18n/i18n.utils';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { parseTaggedI18n } from '../../util/extended-i18n';
import { DashboardPage } from '../dashboard/dashboard.page';

export interface Part {
    readonly content: string;
    readonly link?: string;
}

function createTelLink(tel: string): string {
    const fixed = tel
        .replace(/\s+/g, '')
        .replace(/^(?:0|\+49\(0\))/, '+49')
        .replace(/[^0-9+]+/g, '');
    return `tel:${fixed}`;
}

@Component({
    selector: 'lla-dashboard-contact',
    imports: [TranslocoDirective],
    templateUrl: './dashboard-contact.page.html',
    styleUrl: './dashboard-contact.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardContactPage {
    private readonly raw = i18nCompute((t) => t.translate(marker('contact.text')));
    protected readonly parts = computed<Part[]>(() => {
        const raw = this.raw();
        return parseTaggedI18n(raw, (tag, content) => {
            switch (tag) {
                case 'email':
                    return {
                        content,
                        link: `mailto:${content}`,
                    };
                case 'tel':
                    return {
                        content,
                        link: createTelLink(content),
                    };
                default:
                    return null;
            }
        });
    });

    constructor() {
        inject(DashboardPage).title.set(marker('contact.header'));
    }
}

export default DashboardContactPage;
