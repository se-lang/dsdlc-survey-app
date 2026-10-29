import { Provider } from '@angular/core';
import { QuestionnaireService } from './questionnaire.service';
import { QUESTIONNAIRE_SERVICE } from './questionnaire-service-interface';

/**
 * Provide all services which are necessary for the questionnaire system.
 */
export function provideQuestionnaireServices(): Provider {
    return [
        QuestionnaireService,
        {
            provide: QUESTIONNAIRE_SERVICE,
            useExisting: QuestionnaireService,
        },
    ] satisfies Provider[];
}
