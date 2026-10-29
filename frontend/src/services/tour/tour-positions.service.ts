import {
    afterRenderEffect,
    computed,
    DestroyRef,
    effect,
    inject,
    Injectable,
    Injector,
    linkedSignal,
    signal,
} from '@angular/core';
import { TourControllerService } from './tour-controller.service';
import { fromEvent } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
    autoUpdate,
    ClientRectObject,
    computePosition,
    Middleware,
    ReferenceElement,
    shift,
    VirtualElement,
} from '@floating-ui/dom';

interface Viewport {
    width: number;
    height: number;
}

interface HighlightedBounds {
    readonly cx: number;
    readonly cy: number;
    readonly r: number;
    readonly hidden: boolean;
}

interface BoundedElement extends HighlightedBounds {
    readonly element: Element;
    readonly bounds: DOMRectReadOnly;
}

export interface DialogPosition {
    readonly inset: string;
    readonly margin: string;
}

function px(v: number): string {
    return `${v.toFixed(5)}px`;
}

function addOffset(val: string, offset: string | null | undefined): string {
    if (offset) {
        return `calc((${val}) - (${offset}))`;
    } else {
        return val;
    }
}

@Injectable()
export class TourPositionsService {
    readonly controller = inject(TourControllerService);
    readonly viewport = signal<Viewport>(this.#getViewport());

    protected readonly boundedElementMap = signal<ReadonlyMap<Element, BoundedElement>>(new Map());
    protected readonly boundedElements = computed(() =>
        Array.from(this.boundedElementMap().values()),
    );

    readonly mainElement = linkedSignal<readonly HighlightedBounds[], HighlightedBounds>({
        source: this.boundedElements,
        computation: (source, previous) => {
            const mainElement = source.at(0);
            if (mainElement != null) {
                return mainElement;
            } else {
                const viewport = this.viewport();
                return {
                    cx: viewport.width / 2,
                    cy: viewport.height / 2,
                    r: 0,
                    hidden: false,
                } satisfies HighlightedBounds;
            }
        },
    });
    readonly extraElements = computed(() => this.boundedElements().slice(1));

    constructor() {
        const resizeObserver = new ResizeObserver((entries) => {
            const elements = new Set<Element>();
            for (const e of entries) {
                elements.add(e.target);
            }
            this.#recomputeBounds(elements);
        });
        inject(DestroyRef).onDestroy(() => resizeObserver.disconnect());

        effect((onCleanup) => {
            const elements = this.controller.highlightedElements();
            for (const element of elements) {
                resizeObserver.observe(element, {
                    box: 'border-box',
                });
            }
            onCleanup(() => {
                for (const element of elements) {
                    resizeObserver.unobserve(element);
                }
            });
        });

        afterRenderEffect({
            read: () => {
                const elements = this.controller.highlightedElements();
                this.#recomputeBounds(elements, true);
            },
        });

        fromEvent(window, 'resize')
            .pipe(takeUntilDestroyed())
            .subscribe(() => {
                this.#recomputeBounds(this.controller.highlightedElements(), true);
                this.viewport.set(this.#getViewport());
            });
    }

    startUpdate(dialogElement: HTMLElement, injector: Injector) {
        afterRenderEffect(
            {
                mixedReadWrite: (onCleanup) => {
                    const step = this.controller.currentStep();
                    const positioning =
                        typeof step.dialogPosition === 'function'
                            ? step.dialogPosition()
                            : step.dialogPosition;
                    const config = (typeof step.computePosition === 'function'
                        ? step.computePosition()
                        : step.computePosition) ?? {
                        placement: 'right',
                    };
                    const mainElement = this.controller.highlightedElements().at(0);
                    if (mainElement == null) {
                        dialogElement.style.inset = '0 0 0 0';
                        dialogElement.style.margin = 'auto';
                    } else if (positioning?.type === 'fixed') {
                        dialogElement.style.inset = positioning.inset;
                        dialogElement.style.margin = positioning.margin ?? '0';
                    } else {
                        const middleware: Middleware[] = [
                            shift({ mainAxis: true, crossAxis: true }),
                        ];
                        let referenceElement: ReferenceElement;
                        if (
                            positioning == null ||
                            (positioning.type === 'relative' &&
                                (positioning.mode ?? 'circle') === 'circle')
                        ) {
                            referenceElement = {
                                contextElement: mainElement,
                                getBoundingClientRect: (): ClientRectObject => {
                                    const bounds = mainElement.getBoundingClientRect();
                                    const cx = bounds.left + bounds.width / 2;
                                    const cy = bounds.top + bounds.height / 2;
                                    const r =
                                        Math.sqrt(
                                            (bounds.width + 8) ** 2 + (bounds.height + 8) ** 2,
                                        ) / 2;
                                    const x = cx - r;
                                    const y = cy - r;
                                    return {
                                        x,
                                        y,
                                        width: r * 2,
                                        height: r * 2,
                                        left: x,
                                        top: y,
                                        right: x + r * 2,
                                        bottom: y + r * 2,
                                    };
                                },
                            } satisfies VirtualElement;
                        } else {
                            referenceElement = mainElement;
                        }
                        let cleanedUp = false;
                        const cleanup = autoUpdate(
                            referenceElement,
                            dialogElement,
                            () => {
                                computePosition(referenceElement, dialogElement, {
                                    strategy: 'fixed',
                                    middleware,
                                    ...config,
                                }).then(
                                    ({ x, y }) => {
                                        if (!cleanedUp) {
                                            dialogElement.style.inset = `${y}px auto auto ${x}px`;
                                            dialogElement.style.margin = '0px';
                                        }
                                    },
                                    (err: unknown) => {
                                        console.error(
                                            'Failed to compute dialog position for tour',
                                            err,
                                        );
                                    },
                                );
                            },
                            {},
                        );
                        onCleanup(() => {
                            cleanedUp = true;
                            cleanup();
                        });
                    }
                },
            },
            { injector: injector },
        );
    }

    #recomputeBounds(elements: Iterable<Element>, clear = false) {
        this.boundedElementMap.update((map) => {
            const newMap = clear ? new Map<Element, BoundedElement>() : new Map(map);
            for (const element of elements) {
                if (clear || newMap.has(element)) {
                    const bounds = element.getBoundingClientRect();
                    newMap.set(element, {
                        element,
                        bounds,
                        cx: bounds.left + bounds.width / 2,
                        cy: bounds.top + bounds.height / 2,
                        // calculate the encompassing circle and add 8px of padding
                        r: Math.sqrt((bounds.width + 8) ** 2 + (bounds.height + 8) ** 2) / 2,
                        hidden: false,
                    } satisfies BoundedElement);
                }
            }
            return newMap;
        });
    }

    #getViewport(): Viewport {
        return {
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight,
        };
    }
}
