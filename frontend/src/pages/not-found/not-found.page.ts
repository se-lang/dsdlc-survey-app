import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
    selector: 'lla-not-found',
    imports: [RouterLink, TranslocoDirective],
    templateUrl: './not-found.page.html',
    styleUrl: './not-found.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundPage {}
export default NotFoundPage;
