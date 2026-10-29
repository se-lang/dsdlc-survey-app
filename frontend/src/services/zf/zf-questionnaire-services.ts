import { Provider } from '@angular/core';
import { ZfEpisodeService } from './zf-episode.service';
import { ZF_EPISODE_SERVICE } from './zf-episode.interface';

/**
 * Provide any services necessary for using Zofar in a questionnaire.
 */
export function provideZofarQuestionnaireServices(): Provider {
    return [
        ZfEpisodeService,
        {
            provide: ZF_EPISODE_SERVICE,
            useExisting: ZfEpisodeService,
        },
    ] satisfies Provider[];
}
