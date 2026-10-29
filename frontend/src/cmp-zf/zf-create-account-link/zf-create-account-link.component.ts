import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'lla-zf-create-account-link',
    imports: [RouterLink],
    templateUrl: './zf-create-account-link.component.html',
    styleUrl: './zf-create-account-link.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZfCreateAccountLinkComponent {
    readonly htmlContents = input<string | undefined>();
}
