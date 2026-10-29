import {
    afterRenderEffect,
    ChangeDetectionStrategy,
    Component,
    effect,
    ElementRef,
    inject,
    input,
    signal,
    TemplateRef,
    untracked,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { autoUpdate, computePosition, flip, shift } from '@floating-ui/dom';
import { PopoverDirective } from './popover.directive';
import { filter, fromEvent } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'lla-popover-fallback',
    imports: [NgTemplateOutlet],
    template: ` <ng-container *ngTemplateOutlet="showContent() ? template() : null" /> `,
    styles: `
        :host {
            position: absolute;
            z-index: 10000;
            inset: auto;
            display: none;

            &.popover-open {
                display: block;
            }

            &.mouse-pos {
                transform: translateX(-50%);
            }
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.popover-open]': '!!openOrigin()',
        '[class.mouse-pos]': 'directive.horizontalPosition() === "mouse"',
        '[style]': 'hostStyles()',
        '[class]': 'hostClasses()',
        '(transitionend)': 'transitionEnd()',
        '(transitioncancel)': 'transitionEnd()',
    },
})
export class PopoverFallbackComponent {
    readonly #hostEl = inject<ElementRef<HTMLElement>>(ElementRef);
    readonly openOrigin = input<HTMLElement | null | undefined>(null);
    readonly xOffset = input(0);
    readonly template = input.required<TemplateRef<unknown>>();

    protected readonly showContent = signal(false);
    protected readonly hostStyles = signal<Partial<unknown>>({});
    protected readonly hostClasses = signal('');
    protected readonly directive = inject(PopoverDirective);

    constructor() {
        // detect clicks outside the popover to dismiss it
        // disabled buttons prevent click events from firing in any way
        // therefor use pointerup
        fromEvent(document.documentElement, 'pointerup', { capture: true })
            .pipe(
                filter((evt) => {
                    return (
                        !!untracked(this.openOrigin) &&
                        evt.target instanceof Node &&
                        !this.#hostEl.nativeElement.contains(evt.target)
                    );
                }),
                takeUntilDestroyed(),
            )
            .subscribe((evt) => {
                evt.preventDefault();
                evt.stopPropagation();
                evt.stopImmediatePropagation();
                this.directive.close();
            });

        // this is necessary, because we have to keep the DOM around so we can transition out:/
        effect(() => {
            if (this.openOrigin()) {
                this.showContent.set(true);
            }
        });

        afterRenderEffect({
            read: (onCleanup) => {
                const origin = this.openOrigin();
                if (origin == null) {
                    return;
                }
                const horizontalPosition = this.directive.horizontalPosition();
                const xOffset = horizontalPosition === 'mouse' ? this.xOffset() : 0;
                const placement = horizontalPosition === 'mouse' ? 'bottom-start' : 'bottom';
                const autoUpdateCleanup = autoUpdate(origin, this.#hostEl.nativeElement, () => {
                    void computePosition(origin, this.#hostEl.nativeElement, {
                        placement,
                        middleware: [shift(), flip({ crossAxis: false })],
                    }).then(({ placement, x, y }) => {
                        this.directive.placementWritable.set(
                            placement.includes('top') ? 'top' : 'bottom',
                        );
                        this.hostStyles.set({
                            left: `${String(x + xOffset)}px`,
                            top: `${String(y)}px`,
                            '--x-offset': String(xOffset),
                        });
                    });
                });
                onCleanup(autoUpdateCleanup);
            },
        });
    }

    protected transitionEnd() {
        if (!this.openOrigin()) {
            this.showContent.set(false);
        }
    }
}
