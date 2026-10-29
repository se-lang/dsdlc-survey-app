import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LangDefinition, TranslocoService } from '@jsverse/transloco';
import { I18nService } from '../../services/i18n/i18n.service';
import { IconToggleButtonComponent } from '../icon-toggle-button/icon-toggle-button/icon-toggle-button.component';
import { IconToggleButtonOptionDirective } from '../icon-toggle-button/icon-toggle-button-option.directive';
import { ViewportService } from '../../services/viewport.service';

@Component({
    selector: 'lla-language-switcher',
    imports: [IconToggleButtonComponent, IconToggleButtonOptionDirective],
    templateUrl: './language-switcher.component.html',
    styleUrl: './language-switcher.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitcherComponent {
    readonly #transloco = inject(TranslocoService);
    protected readonly viewportService = inject(ViewportService);
    protected readonly i18n = inject(I18nService);
    protected readonly availableLanguages = this.#transloco.getAvailableLangs() as LangDefinition[];

    constructor() {
        if (this.availableLanguages.length > 2) {
            console.error('Language switcher does not support > 2 languages.');
        }
    }
}
