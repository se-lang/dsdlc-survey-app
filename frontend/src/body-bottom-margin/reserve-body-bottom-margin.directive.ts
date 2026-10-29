import { computed, DestroyRef, Directive, ElementRef, inject, signal } from '@angular/core';
import { BodyBottomMarginService } from './body-bottom-margin.service';
import { ViewportService } from '../services/viewport.service';

@Directive({
    selector: '[llaReserveBodyBottomMargin]',
})
export class ReserveBodyBottomMarginDirective {
    constructor() {
        const viewportService = inject(ViewportService);
        const host = inject<ElementRef<Element>>(ElementRef);
        const height = signal(0);
        const updateHeight = () => {
            height.set(host.nativeElement.getBoundingClientRect().height + 16);
        };
        updateHeight();
        const observer = new ResizeObserver(updateHeight);
        observer.observe(host.nativeElement, {
            box: 'border-box',
        });
        const service = inject(BodyBottomMarginService);
        const unregister = service.register(
            computed(() => (viewportService.isMobile() ? 0 : height())),
        );
        inject(DestroyRef).onDestroy(() => {
            observer.disconnect();
            unregister();
        });
    }
}
