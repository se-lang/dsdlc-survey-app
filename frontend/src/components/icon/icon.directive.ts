import { Directive, effect, ElementRef, inject, input } from '@angular/core';
import { IconService } from './icon.service';
import { rxResource } from '@angular/core/rxjs-interop';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: 'lla-icon',
})
export class IconDirective {
    readonly name = input.required<string>();
    readonly shape = input<'square' | 'auto'>('square');
    readonly preserveAspectRatio = input<string>('xMidyMid');

    readonly #service = inject(IconService);
    readonly #icon = rxResource({
        params: this.name,
        stream: ({ params }) => this.#service.getIcon(params),
    });
    readonly #hostEl = inject<ElementRef<HTMLElement>>(ElementRef);

    constructor() {
        effect(() => {
            const svg = this.#icon.value();
            if (svg == null) {
                this.#hostEl.nativeElement.replaceChildren();
            } else {
                svg.removeAttribute('width');
                svg.removeAttribute('height');
                svg.setAttribute('preserveAspectRatio', this.preserveAspectRatio());
                switch (this.shape()) {
                    case 'square':
                        svg.style.aspectRatio = '1';
                        break;
                    case 'auto':
                        svg.style.aspectRatio = 'auto';
                        break;
                }
                this.#hostEl.nativeElement.replaceChildren(svg);
            }
        });
    }
}
