import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconDirective } from '../icon/icon.directive';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
    selector: 'lla-back-button',
    imports: [RouterLink, IconDirective, TranslocoPipe],
    templateUrl: './back-button.component.html',
    styleUrl: './back-button.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackButtonComponent {
    routerLink = input.required<string>();
    ariaLabel = input.required<string>();
}
export default BackButtonComponent;
