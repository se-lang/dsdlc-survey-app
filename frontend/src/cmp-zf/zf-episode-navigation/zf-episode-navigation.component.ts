import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { QnrNavigationComponent } from '../../components/qnr-navigation/qnr-navigation.component';
import { TranslocoDirective } from '@jsverse/transloco';
import { ReserveBodyBottomMarginDirective } from '../../body-bottom-margin/reserve-body-bottom-margin.directive';
import { TourHighlightElementDirective } from '../../components/tour/tour-highlight-element.directive';

@Component({
    selector: 'lla-zf-episode-navigation',
    imports: [QnrNavigationComponent, TranslocoDirective, TourHighlightElementDirective],
    templateUrl: './zf-episode-navigation.component.html',
    styleUrl: './zf-episode-navigation.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    hostDirectives: [ReserveBodyBottomMarginDirective],
})
export class ZfEpisodeNavigationComponent {
    readonly mode = input.required<'calendar' | 'table'>();
    readonly newEpisode = output();
}
