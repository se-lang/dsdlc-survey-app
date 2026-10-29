import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import {
    QUESTIONNAIRE_NOT_FOUND_ERROR,
    QuestionnaireService,
} from '../../services/qnr/questionnaire.service';
import { provideCoreQnrComponents } from '../../cmp-qnr/core-qnr-components';
import { provideQnrComponentLookup } from '../../services/qnr/qnr-components';
import { provideZofarComponents } from '../../cmp-zf/zf-qnr-components';
import { provideQuestionnaireServices } from '../../services/qnr/questionnaire-services';
import { registerCurrentQnr } from '../../services/qnr/global-qnr-access';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { checkNotNull } from '../../util/checks';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { QnrPageComponent } from '../../qnr-render/qnr-page/qnr-page.component';
import { provideZofarQuestionnaireServices } from '../../services/zf/zf-questionnaire-services';

@Component({
    selector: 'lla-questionnaire-page',
    imports: [QnrPageComponent],
    templateUrl: './questionnaire-page.component.html',
    styleUrl: './questionnaire-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideCoreQnrComponents(),
        provideZofarComponents(),
        provideQnrComponentLookup(),
        provideQuestionnaireServices(),
        provideZofarQuestionnaireServices(),
    ],
})
export class QuestionnairePage {
    readonly service = inject(QuestionnaireService);

    constructor() {
        // register this page as the current questionnaire
        registerCurrentQnr();

        const router = inject(Router);

        inject(ActivatedRoute)
            .paramMap.pipe(
                map((params) => checkNotNull(params.get('id'))),
                takeUntilDestroyed(),
            )
            .subscribe((questionnaireId) => this.service.setQuestionnaireId(questionnaireId));

        effect(() => {
            const contextError = this.service.contextError();
            if (contextError === QUESTIONNAIRE_NOT_FOUND_ERROR) {
                void router.navigate(['/404'], {
                    skipLocationChange: true,
                });
            }
        });
    }
}

export default QuestionnairePage;
