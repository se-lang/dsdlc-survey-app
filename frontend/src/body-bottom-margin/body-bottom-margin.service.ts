import { computed, Injectable, signal, Signal } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class BodyBottomMarginService {
    #registered = signal<ReadonlyArray<Signal<number>>>([]);

    readonly bodyBottomMargin = computed(() => this.#registered().reduce((acc, h) => acc + h(), 0));

    register(height: Signal<number>): () => void {
        this.#registered.update((v) => [...v, height]);
        return () => this.unregister(height);
    }

    unregister(height: Signal<number>) {
        this.#registered.update((v) => {
            const idx = v.findIndex(height);
            if (idx !== -1) {
                const n = Array.from(v);
                n.splice(idx, 1);
                return n;
            } else {
                return v;
            }
        });
    }
}
