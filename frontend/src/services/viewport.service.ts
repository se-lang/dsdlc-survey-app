import { isPlatformBrowser } from '@angular/common';
import { computed, inject, Injectable, PLATFORM_ID, Signal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { fromEvent, map } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ViewportService {
    readonly isDesktop: Signal<boolean>;
    readonly isMobile: Signal<boolean>;

    constructor() {
        if (isPlatformBrowser(inject(PLATFORM_ID))) {
            // Warning: When changing this, also change style/_variables.scss
            const desktopQuery = `(min-width: 768px)`;
            const mql = window.matchMedia(desktopQuery);
            this.isDesktop = toSignal(
                fromEvent<MediaQueryListEvent>(mql, 'change').pipe(map((e) => e.matches)),
                { initialValue: mql.matches },
            );
        } else {
            // Fallback Unit-Tests
            this.isDesktop = signal(true);
        }
        this.isMobile = computed(() => !this.isDesktop());
    }
}
