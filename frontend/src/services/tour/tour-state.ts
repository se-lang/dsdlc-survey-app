import { InjectionToken, Signal } from '@angular/core';
import type { TourStep } from './tour-controller.service';

export interface AppTourState {
    readonly currentStep?: Signal<TourStep>;
    readonly registerHighlight?: (name: string, element: Element) => () => void;
}

export const APP_TOUR_STATE = new InjectionToken<AppTourState>('APP_TOUR_STATE', {
    providedIn: 'root',
    factory: () => ({}) satisfies AppTourState,
});
