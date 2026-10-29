import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainLayout } from '../main/main.layout';
import { DialogComponent, DialogSize } from '../../components/dialog/dialog/dialog.component';

export const BOXED_LAYOUT_DIALOG_SIZE = 'lla-boxed-layout-dialog-size';

@Component({
    selector: 'lla-boxed',
    imports: [RouterOutlet, MainLayout, DialogComponent],
    templateUrl: './boxed.layout.html',
    styleUrl: './boxed.layout.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoxedLayout {
    readonly dialogSize = input<DialogSize>('default', {
        // eslint-disable-next-line @angular-eslint/no-input-rename
        alias: 'lla-boxed-layout-dialog-size',
    });
}
