import { Provider } from '@angular/core';
import { provideTourQuestionnaireServices } from './questionnaire-tour-services';
import { TourControllerService } from './tour-controller.service';
import {
    GLOBAL_DIALOG_CONFIG,
    GlobalDialogConfig,
} from '../../components/dialog/dialog/dialog.component';
import { APP_TOUR_STATE } from './tour-state';
import { TourPositionsService } from './tour-positions.service';

export function provideTourServices(): Provider {
    return [
        provideTourQuestionnaireServices(),
        TourControllerService,
        {
            provide: GLOBAL_DIALOG_CONFIG,
            useValue: { enableFakeModalMode: true } satisfies GlobalDialogConfig,
        } satisfies Provider,
        {
            provide: APP_TOUR_STATE,
            useExisting: TourControllerService,
        } satisfies Provider,
        TourPositionsService,
    ];
}
