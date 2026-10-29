import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { OperationMessageFragment } from '../../generated/graphql';

@Component({
    selector: 'lla-server-error-list',
    imports: [],
    templateUrl: './server-error-list.component.html',
    styleUrl: './server-error-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServerErrorListComponent {
    readonly errors = input.required<readonly OperationMessageFragment[]>();
}
