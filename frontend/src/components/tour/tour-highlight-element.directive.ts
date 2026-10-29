import { Directive, effect, ElementRef, inject, input, untracked } from '@angular/core';
import { APP_TOUR_STATE } from '../../services/tour/tour-state';
import { injectFromCurrentQnr } from '../../services/qnr/global-qnr-access';

@Directive({
    selector: '[llaTourHighlightElement]',
})
export class TourHighlightElementDirective {
    readonly identifier = input<string | null | undefined>(undefined, {
        alias: 'llaTourHighlightElement',
    });

    constructor() {
        const host = inject<ElementRef<Element>>(ElementRef).nativeElement;
        const tourState = injectFromCurrentQnr(APP_TOUR_STATE);
        effect((onCleanup) => {
            const registerHighlight = tourState()?.registerHighlight;
            if (registerHighlight) {
                const identifier = this.identifier();
                if (identifier != null) {
                    const cleanup = untracked(() => registerHighlight(identifier, host));
                    onCleanup(cleanup);
                }
            }
        });
    }
}
