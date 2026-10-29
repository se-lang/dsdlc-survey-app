import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { type PopoverDirective } from './popover.directive';

@Injectable({
    providedIn: 'root',
})
export class PopoverService {
    readonly #closePopovers$ = new Subject<PopoverDirective | null>();

    constructor() {
        const listener = () => {
            this.#closePopovers$.next(null);
        };
        document.addEventListener('scroll', listener, {
            passive: true,
            capture: true,
        });
    }

    get closePopovers$(): Observable<PopoverDirective | null> {
        return this.#closePopovers$;
    }

    closePopovers(except: PopoverDirective | null = null) {
        this.#closePopovers$.next(except);
    }
}
