import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DialogContentComponent } from '../dialog/dialog-content/dialog-content.component';
import { CONFIRM_DIALOG_CONTEXT } from '../../services/confirm.service';
import { DialogFooterComponent } from '../dialog/dialog-footer/dialog-footer.component';
import { TranslocoDirective } from '@jsverse/transloco';
import { DialogHeaderComponent } from '../dialog/dialog-header/dialog-header.component';
import { marker } from '@jsverse/transloco-keys-manager/marker';

@Component({
    selector: 'lla-confirmation-dialog',
    imports: [
        DialogContentComponent,
        DialogFooterComponent,
        TranslocoDirective,
        DialogHeaderComponent,
    ],
    templateUrl: './confirmation-dialog.component.html',
    styleUrl: './confirmation-dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationDialogComponent {
    protected readonly context = inject(CONFIRM_DIALOG_CONTEXT);

    protected readonly titleFallback = marker('confirmDialog.title');
    protected readonly yesFallback = marker('confirmDialog.yes');
    protected readonly noFallback = marker('confirmDialog.no');
}
