import {
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChild,
    effect,
    ElementRef,
    inject,
    InjectionToken,
    input,
    model,
    signal,
    TemplateRef,
    Type,
} from '@angular/core';
import { NgComponentOutlet, NgTemplateOutlet } from '@angular/common';
import { POPOVER_CONTAINER_ELEMENT } from '../../popover/popover.directive';

export type DialogSize = 'default' | 'login' | 'zf-episode' | 'questionnaire-box' | 'tour';

export interface GlobalDialogConfig {
    enableFakeModalMode?: boolean;
}

export const GLOBAL_DIALOG_CONFIG = new InjectionToken<GlobalDialogConfig>('GLOBAL_DIALOG_CONFIG', {
    providedIn: 'root',
    factory: () => ({}) satisfies GlobalDialogConfig,
});

@Component({
    selector: 'dialog[llaDialog], lla-dialog',
    imports: [NgTemplateOutlet, NgComponentOutlet],
    templateUrl: './dialog.component.html',
    styleUrl: './dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class]': '"lla-dialog lla-dialog--size-" + size()',
        '[class.fake-modal-mode]': '!!globalConfig.enableFakeModalMode',
        '(cancel)': 'cancel($event)',
        '(close)': 'open.set(false)',
        '(click)': 'click($event)',
    },
    providers: [
        {
            provide: POPOVER_CONTAINER_ELEMENT,
            useFactory: () => {
                const host = inject<ElementRef<Node>>(ElementRef);
                if (host.nativeElement instanceof HTMLDialogElement) {
                    return host.nativeElement;
                } else {
                    return inject(POPOVER_CONTAINER_ELEMENT, {
                        skipSelf: true,
                    });
                }
            },
        },
    ],
})
export class DialogComponent {
    readonly size = input<DialogSize>('default');
    readonly template = input<TemplateRef<unknown> | undefined>();
    readonly component = input<Type<unknown> | undefined>();

    readonly backdropClose = input(true);
    readonly allowCancel = input(true);
    readonly open = model(false);

    protected readonly globalConfig = inject(GLOBAL_DIALOG_CONFIG);

    protected readonly templateChild = contentChild(TemplateRef);
    protected readonly resolvedTemplate = computed(() => {
        return this.template() ?? this.templateChild();
    });
    protected readonly renderContents = signal(false);

    readonly safeToDestroy = computed(() => !this.renderContents());

    readonly isRealDialog: boolean;

    constructor() {
        const host: unknown = inject(ElementRef).nativeElement;
        if (host instanceof HTMLDialogElement) {
            this.isRealDialog = true;
            effect((onCleanup) => {
                const open = this.open();
                if (open) {
                    this.renderContents.set(true);
                    if (this.globalConfig.enableFakeModalMode) {
                        host.show();
                    } else {
                        host.showModal();
                    }
                } else {
                    host.close();
                    const closeAnim = host.getAnimations().find((a) => {
                        return a instanceof CSSTransition && a.transitionProperty === 'display';
                    });
                    if (closeAnim == null) {
                        this.renderContents.set(false);
                    } else {
                        let cancelled = false;
                        onCleanup(() => (cancelled = true));
                        void closeAnim.finished
                            .catch(() => null)
                            .then(() => {
                                if (!cancelled) {
                                    this.renderContents.set(false);
                                }
                            });
                    }
                }
            });
        } else {
            this.isRealDialog = false;
        }
    }

    close() {
        this.open.set(false);
    }

    protected cancel(event: Event) {
        if (this.globalConfig.enableFakeModalMode || !this.allowCancel()) {
            event.preventDefault();
        }
    }

    protected click(event: MouseEvent) {
        // Content wrapper div makes sure that only clicks on the backdrop have the Dialog element
        // as their target
        if (
            !this.globalConfig.enableFakeModalMode &&
            this.backdropClose() &&
            event.target instanceof HTMLDialogElement
        ) {
            event.target.close();
        }
    }
}
