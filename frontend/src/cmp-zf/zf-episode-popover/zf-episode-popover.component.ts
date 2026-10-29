import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ZfEpisodeEntryFragment } from '../../generated/graphql';
import { DatePipe } from '../../locale/date.pipe';
import { IconDirective } from '../../components/icon/icon.directive';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
    selector: 'lla-zf-episode-popover',
    imports: [DatePipe, IconDirective, TranslocoDirective],
    templateUrl: './zf-episode-popover.component.html',
    styleUrl: './zf-episode-popover.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZfEpisodePopoverComponent {
    readonly episode = input.required<ZfEpisodeEntryFragment>();

    readonly deleteEpisode = output();
    readonly editEpisode = output();
}
