import {
    ApplicationRef,
    ComponentRef,
    createComponent,
    DestroyRef,
    Directive,
    forwardRef,
    inject,
    InjectionToken,
    Injector,
    input,
    signal,
    Signal,
    TemplateRef,
    ViewContainerRef,
} from '@angular/core';
import { NativePopoverContentComponent } from './native-popover-content.component';
import { useNativePopover } from './popover-supported';
import { POPOVER_HANDLE, PopoverHandle, PopoverPlacement } from './popover.interface';
import { PopoverFallbackComponent } from './popover-fallback.component';
import { PopoverService } from './popover.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

export const POPOVER_CONTAINER_ELEMENT = new InjectionToken<Node>('POPOVER_CONTAINER_ELEMENT', {
    providedIn: 'root',
    factory: () => document.body,
});

export type PopoverHorizontalPosition = 'center' | 'mouse';
export type PopoverAction = 'hide' | 'show' | 'toggle';

@Directive({
    selector: '[llaPopover]',
    exportAs: 'llaPopover',
    providers: [
        {
            provide: POPOVER_HANDLE,
            useExisting: forwardRef(() => PopoverDirective),
        },
    ],
})
export class PopoverDirective implements PopoverHandle {
    readonly horizontalPosition = input<PopoverHorizontalPosition>('center');

    readonly placementWritable = signal<PopoverPlacement>('bottom');
    get placement() {
        return this.placementWritable;
    }

    #nativeContentComponentRef: ComponentRef<NativePopoverContentComponent> | null;
    #fallbackContentComponentRef: ComponentRef<PopoverFallbackComponent> | null;
    #service = inject(PopoverService);

    constructor() {
        const template = inject(TemplateRef);

        const contentCmpInjector = Injector.create({
            providers: [
                {
                    provide: PopoverDirective,
                    useValue: this,
                },
            ],
            parent: inject(Injector),
        });

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (useNativePopover) {
            this.#nativeContentComponentRef = inject(ViewContainerRef).createComponent(
                NativePopoverContentComponent,
                {
                    injector: contentCmpInjector,
                },
            );
            this.#fallbackContentComponentRef = null;
            this.#nativeContentComponentRef.setInput('template', template);
        } else {
            // If we're in a dialog, we have to inject into the dialog, otherwise the dialog (in the top layer)
            // appears above the popover
            const targetElement = inject(POPOVER_CONTAINER_ELEMENT);
            this.#nativeContentComponentRef = null;
            const appRef = inject(ApplicationRef);
            this.#fallbackContentComponentRef = createComponent(PopoverFallbackComponent, {
                environmentInjector: appRef.injector,
                elementInjector: contentCmpInjector,
            });
            this.#fallbackContentComponentRef.setInput('template', template);
            targetElement.appendChild(this.#fallbackContentComponentRef.location.nativeElement);
            appRef.attachView(this.#fallbackContentComponentRef.hostView);
        }

        this.#service.closePopovers$
            .pipe(
                filter((except) => except !== this),
                takeUntilDestroyed(),
            )
            .subscribe(() => {
                this.close();
            });

        inject(DestroyRef).onDestroy(() => {
            this.#fallbackContentComponentRef?.destroy();
            this.#fallbackContentComponentRef = null;
            this.#nativeContentComponentRef = null;
        });
    }

    bindToButton(button: HTMLButtonElement, action: Signal<PopoverAction>): () => void {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (useNativePopover) {
            const element = (this.#nativeContentComponentRef?.location.nativeElement ??
                null) as Element | null;
            button.popoverTargetElement = element;
            const clickListener = (event: MouseEvent) => {
                this.#nativeContentComponentRef?.setInput('xOffset', event.offsetX);
            };
            button.addEventListener('click', clickListener);
            return () => {
                button.popoverTargetElement = null;
                button.removeEventListener('click', clickListener);
            };
        } else {
            const listener = (event: MouseEvent) => {
                this.#service.closePopovers(this);
                const contentCmp = this.#fallbackContentComponentRef;
                if (!contentCmp) {
                    return;
                }
                contentCmp.setInput('xOffset', event.offsetX);
                let newValue: HTMLButtonElement | null;
                switch (action()) {
                    case 'hide':
                        newValue = null;
                        break;
                    case 'show':
                        newValue = button;
                        break;
                    case 'toggle':
                        newValue = contentCmp.instance.openOrigin() == null ? button : null;
                        break;
                }
                contentCmp.setInput('openOrigin', newValue);
            };
            button.addEventListener('click', listener);
            return () => button.removeEventListener('click', listener);
        }
    }

    close(): void {
        const nativeElement = this.#nativeContentComponentRef?.location.nativeElement as
            | HTMLElement
            | undefined;
        nativeElement?.hidePopover();
        this.#fallbackContentComponentRef?.setInput('openOrigin', null);
    }
}
