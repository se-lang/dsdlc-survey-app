import { computed, inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { ViewportService } from './viewport.service';
import { filter, finalize, map, mergeWith, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationStart, Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class SideMenuService {
    readonly #viewport = inject(ViewportService);
    readonly #router = inject(Router);

    readonly #open$ = new Subject<void>();
    readonly #sideMenuCounter = signal(0);

    readonly hasSideMenu = computed(() => this.#sideMenuCounter() > 0);

    get useSideMenu(): Signal<boolean> {
        return this.#viewport.isMobile;
    }

    readonly showSideMenuButton = computed(() => this.useSideMenu() && this.hasSideMenu());

    open() {
        this.#open$.next();
    }

    bindToSignal(open: WritableSignal<boolean>) {
        this.#sideMenuCounter.update((v) => v + 1);
        this.#open$
            .pipe(
                map(() => true),
                mergeWith(
                    this.#router.events.pipe(
                        filter((event) => event instanceof NavigationStart),
                        map(() => false),
                    ),
                ),
                takeUntilDestroyed(),
                finalize(() => this.#sideMenuCounter.update((v) => v - 1)),
            )
            .subscribe((state) => {
                open.set(state);
            });
    }
}
