import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';

import { finalize } from 'rxjs';
import {
    MappedQuestionnaireButton,
    QUESTIONNAIRE_SERVICE,
} from '../../services/qnr/questionnaire-service-interface';
import { RouterLink } from '@angular/router';
import { TourHighlightElementDirective } from '../tour/tour-highlight-element.directive';

@Component({
    selector: 'lla-qnr-navigation',
    imports: [RouterLink, TourHighlightElementDirective],
    templateUrl: './qnr-navigation.component.html',
    styleUrl: './qnr-navigation.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QnrNavigationComponent {
    readonly root = input(true);
    readonly highlightSuffix = input('');

    protected readonly service = inject(QUESTIONNAIRE_SERVICE);
    protected readonly navigating = signal(false);

    handleNavigation(button: MappedQuestionnaireButton) {
        if (button.handler == null || this.navigating()) {
            return;
        }
        this.navigating.set(true);
        button
            .handler()
            .pipe(finalize(() => this.navigating.set(false)))
            .subscribe({
                error: (err: unknown) => {
                    console.error('QNR Navigation failed', err);
                },
            });
    }
}
