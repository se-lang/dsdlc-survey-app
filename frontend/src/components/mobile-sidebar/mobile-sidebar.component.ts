import {
    ChangeDetectionStrategy,
    Component,
    effect,
    ElementRef,
    model,
    viewChild,
} from '@angular/core';

@Component({
    selector: 'lla-mobile-sidebar',
    imports: [],
    templateUrl: './mobile-sidebar.component.html',
    styleUrl: './mobile-sidebar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileSidebarComponent {
    readonly open = model<boolean>(false);

    protected readonly mobileSidebar =
        viewChild.required<ElementRef<HTMLDialogElement>>('mobileSidebarRef');

    public clickSidebar(event: Event) {
        if (event.target instanceof HTMLDialogElement) {
            this.mobileSidebar().nativeElement.close();
        }
    }

    public show() {
        this.open.set(true);
    }

    public close() {
        this.open.set(false);
    }

    constructor() {
        effect(() => {
            if (this.open()) {
                this.mobileSidebar().nativeElement.showModal();
            } else {
                this.mobileSidebar().nativeElement.close();
            }
        });
    }
}
