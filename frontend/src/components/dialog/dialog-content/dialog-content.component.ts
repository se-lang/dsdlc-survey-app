import {
    afterNextRender,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    inject,
    input,
} from '@angular/core';

@Component({
    selector: 'lla-dialog-content',
    imports: [],
    templateUrl: './dialog-content.component.html',
    styleUrl: './dialog-content.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.lla-dialog-content--space]': 'spacing()',
    },
})
export class DialogContentComponent {
    readonly spacing = input(true);
    constructor() {
        // Workaround for Firefox behavior (arguably a bug...) where it preserves scroll position across
        // entirely separate DOM elements across separate Dialog openings (DOM is destroyed and recreated, but
        // scroll position is preserved)
        const element = inject<ElementRef<HTMLElement>>(ElementRef);
        afterNextRender({
            write: () => {
                element.nativeElement.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: 'instant',
                });
            },
        });
    }
}
