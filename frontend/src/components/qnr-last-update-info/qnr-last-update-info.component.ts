import { ChangeDetectionStrategy, Component } from '@angular/core';
import { injectFromCurrentQnr } from '../../services/qnr/global-qnr-access';
import { formatDateComputed } from '../../locale/date-formats';
import { TranslocoDirective } from '@jsverse/transloco';
import { QUESTIONNAIRE_SERVICE } from '../../services/qnr/questionnaire-service-interface';

@Component({
    selector: 'lla-qnr-last-update-info',
    imports: [TranslocoDirective],
    templateUrl: './qnr-last-update-info.component.html',
    styleUrl: './qnr-last-update-info.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QnrLastUpdateInfoComponent {
    protected readonly qnrService = injectFromCurrentQnr(QUESTIONNAIRE_SERVICE);
    protected readonly formattedDate = formatDateComputed(() => {
        return this.qnrService()?.context()?.status.lastVisit;
    }, 'shortDateTime');
}
