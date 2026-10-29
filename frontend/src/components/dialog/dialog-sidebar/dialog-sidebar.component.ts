import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
    selector: 'lla-dialog-sidebar',
    imports: [],
    templateUrl: './dialog-sidebar.component.html',
    styleUrl: './dialog-sidebar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogSidebarComponent {
    readonly header = input<string>();
}
