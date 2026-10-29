import { Provider } from '@angular/core';
import { QUESTIONNAIRE_SERVICE } from '../qnr/questionnaire-service-interface';
import { QuestionnaireTourService } from './questionnaire-tour.service';
import { ZfEpisodeTourService } from './zf-episode-tour.service';
import { ZF_EPISODE_SERVICE } from '../zf/zf-episode.interface';

export function provideTourQuestionnaireServices(): Provider {
    return [
        QuestionnaireTourService,
        {
            provide: QUESTIONNAIRE_SERVICE,
            useExisting: QuestionnaireTourService,
        },
        ZfEpisodeTourService,
        {
            provide: ZF_EPISODE_SERVICE,
            useExisting: ZfEpisodeTourService,
        },
    ] satisfies Provider[];
}
