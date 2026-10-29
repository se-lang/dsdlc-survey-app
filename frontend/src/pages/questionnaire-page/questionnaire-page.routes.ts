import { CanDeactivateFn, Router, Routes } from '@angular/router';
import { inject } from '@angular/core';
import { ConfirmOptions, ConfirmService } from '../../services/confirm.service';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import QuestionnairePageComponent from './questionnaire-page.component';
import {
    QUESTIONNAIRE_PAGE_LEAVE_TEXT_OVERRIDE,
    QUESTIONNAIRE_PAGE_LEAVE_TEXT_OVERRIDE_CALENDAR,
    QUESTIONNAIRE_PAGE_SKIP_CONFIRMATION,
} from './questionnaire-page-routing-constants';
import { walkRouteTree } from '../../util/walk-route-tree';

const defaultConfirmOptions: ConfirmOptions = {
    title: marker('questionnaire.leaveQuestionTitle'),
    question: marker('questionnaire.leaveQuestion'),
    yes: marker('questionnaire.leaveQuestionYes'),
    no: marker('questionnaire.leaveQuestionNo'),
};
const calendarConfirmOptions: ConfirmOptions = {
    title: marker('questionnaire.leaveQuestionTitle'),
    question: marker('questionnaire.leaveQuestionCalendar'),
    yes: marker('questionnaire.leaveQuestionYes'),
    no: marker('questionnaire.leaveQuestionNo'),
};

const routes: Routes = [
    {
        path: ':id',
        component: QuestionnairePageComponent,
        canDeactivate: [
            ((component: QuestionnairePageComponent, _r, _s, nextState) => {
                const navigation = inject(Router).getCurrentNavigation();
                const navigationInfo = navigation?.extras.info;
                let confirmationType: 'none' | 'calendar' | 'default';
                if (
                    (navigationInfo == null ||
                        typeof navigationInfo !== 'object' ||
                        !(QUESTIONNAIRE_PAGE_SKIP_CONFIRMATION in navigationInfo)) &&
                    (confirmationType = component.service.leaveConfirmationType()) !== 'none'
                ) {
                    const dataKey =
                        confirmationType === 'calendar'
                            ? QUESTIONNAIRE_PAGE_LEAVE_TEXT_OVERRIDE_CALENDAR
                            : QUESTIONNAIRE_PAGE_LEAVE_TEXT_OVERRIDE;
                    const overrides: Array<Partial<ConfirmOptions>> = [];
                    walkRouteTree(nextState.root, (nextSnapshot) => {
                        const override = nextSnapshot.data[dataKey] as
                            | Partial<ConfirmOptions>
                            | null
                            | undefined;
                        if (override != null) {
                            overrides.push(override);
                        }
                    });
                    const baseOptions =
                        confirmationType === 'calendar'
                            ? calendarConfirmOptions
                            : defaultConfirmOptions;

                    return inject(ConfirmService).showConfirmPopup(
                        Object.assign({}, baseOptions, ...overrides) as ConfirmOptions,
                    );
                } else {
                    return true;
                }
            }) satisfies CanDeactivateFn<QuestionnairePageComponent>,
        ],
    },
];

export default routes;
