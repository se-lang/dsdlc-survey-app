import { Directive, inject } from '@angular/core';
import { DialogComponent } from './dialog.component';

@Directive({
    selector: '[llaDialogClose]',
    host: {
        '(click)': 'dialog.close()',
    },
})
export class DialogCloseDirective {
    readonly dialog = inject(DialogComponent);
}
