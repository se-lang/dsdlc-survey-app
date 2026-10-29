import { effect } from '@angular/core';

export function bindElementClass(element: Element, classComputation: () => string) {
    effect((onCleanup) => {
        const cls = classComputation();
        element.classList.add(cls);
        onCleanup(() => element.classList.remove(cls));
    });
}
