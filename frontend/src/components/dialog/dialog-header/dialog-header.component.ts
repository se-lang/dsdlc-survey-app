import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    input,
    output,
    Signal,
} from '@angular/core';
import { DialogCloseDirective } from '../dialog/dialog-close.directive';
import { TranslocoDirective } from '@jsverse/transloco';
import { IconDirective } from '../../icon/icon.directive';
import { DialogComponent } from '../dialog/dialog.component';

export type DialogHeaderColor = 'gray' | 'brand';

@Component({
    selector: 'lla-dialog-header',
    imports: [DialogCloseDirective, TranslocoDirective, IconDirective],
    templateUrl: './dialog-header.component.html',
    styleUrl: './dialog-header.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[style.--_lla-dialog-header-set-bg]': "color() ? 'var(--lla-clr-' + color() + ')' : null",
        '[style.--_lla-dialog-header-set-color]':
            "color() ? 'var(--lla-clr-contrast-' + color() + ')' : null",
    },
})
export class DialogHeaderComponent {
    readonly title = input<string>();
    readonly subtitle = input<string>();
    readonly color = input<DialogHeaderColor>();
    readonly enableCloseIcon = input<boolean | undefined>(undefined);

    readonly closeIconClick = output();

    protected readonly resolvedEnableCloseIcon: Signal<boolean>;

    constructor() {
        const parent = inject(DialogComponent, { optional: true });
        const defaultEnableCloseIcon = !!parent?.isRealDialog;
        this.resolvedEnableCloseIcon = computed(
            () => this.enableCloseIcon() ?? defaultEnableCloseIcon,
        );
    }
}
