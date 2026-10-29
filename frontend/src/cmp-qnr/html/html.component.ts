import {
    afterRenderEffect,
    ApplicationRef,
    ChangeDetectionStrategy,
    Component,
    computed,
    createComponent,
    ElementRef,
    inject,
    input,
    Signal,
} from '@angular/core';
import { QnrHtmlElementFragment } from '../../generated/graphql';
import {
    CreatePlaceholderOpts,
    QNR_HTML_SPECIALS,
    QnrHtmlPlaceholder,
    QnrHtmlSpecialsContext,
} from './specials';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface HtmlReplaceResult {
    readonly html: SafeHtml;
    readonly placeholders: QnrHtmlPlaceholder[];
}

@Component({
    selector: 'lla-qnr-html',
    imports: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: ``,
    styles: [
        `
            @use '../../style/variables' as v;

            :host {
                display: block;
                font-size: var(--lla-text-flow-font-size);
            }

            :host.lla-html-kind--question {
                font-weight: var(--lla-bold-font-weight);
            }

            :host.lla-html-kind--question,
            :host.lla-html-kind--introduction,
            :host.lla-html-kind--generic {
                margin-block-end: var(--lla-question-space);
            }

            :host ::ng-deep .zo-warning {
                color: var(--lla-clr-text-form-error);
            }

            :host ::ng-deep {
                img,
                picture {
                    max-width: 100%;
                }
            }
        `,
    ],
    host: {
        '[innerHTML]': 'replacedHtml().html',
        '[class]': '"lla-html-kind--" + element().kind.toLowerCase()',
    },
})
export class HtmlComponent {
    readonly #sanitizer = inject(DomSanitizer);
    readonly #specials = inject(QNR_HTML_SPECIALS, { optional: true }) ?? [];

    readonly element = input.required<QnrHtmlElementFragment>();

    protected readonly replacedHtml: Signal<HtmlReplaceResult> = computed(() => {
        let unsanitizedHtml: string;
        const inputHtml = this.element().html;
        const placeholders: QnrHtmlPlaceholder[] = [];
        if (this.#specials.length !== 0) {
            let index = 0;
            const context: QnrHtmlSpecialsContext = {
                createPlaceholder: (opts: CreatePlaceholderOpts): QnrHtmlPlaceholder => {
                    const nodeIdentifier = `${index++}`;
                    const node = document.createElement(opts.elementTag);
                    node.setAttribute('data-lla-placeholder', nodeIdentifier);
                    const placeholder: QnrHtmlPlaceholder = {
                        node,
                        component: opts.component,
                        selector: `[data-lla-placeholder="${nodeIdentifier}"]`,
                        bindings: opts.bindings,
                    };
                    placeholders.push(placeholder);
                    return placeholder;
                },
            };
            const templateElement = document.createElement('template');
            templateElement.innerHTML = inputHtml;
            for (const special of this.#specials) {
                special.replaceSpecial(templateElement.content, context);
            }
            unsanitizedHtml = templateElement.innerHTML;
        } else {
            unsanitizedHtml = inputHtml;
        }
        return {
            html: this.#sanitizer.bypassSecurityTrustHtml(unsanitizedHtml),
            placeholders,
        };
    });

    constructor() {
        const appRef = inject(ApplicationRef);
        const hostElement = inject<ElementRef<HTMLElement>>(ElementRef);
        afterRenderEffect({
            write: (onCleanup) => {
                const placeholders = this.replacedHtml().placeholders;
                for (const placeholder of placeholders) {
                    const elementNode = hostElement.nativeElement.querySelector(
                        placeholder.selector,
                    );
                    if (elementNode == null) {
                        console.error('Placeholder element not found for QNR HTML special.');
                    } else {
                        const compRef = createComponent(placeholder.component, {
                            environmentInjector: appRef.injector,
                            bindings: placeholder.bindings,
                            hostElement: elementNode,
                        });
                        appRef.attachView(compRef.hostView);
                        onCleanup(() => compRef.destroy());
                    }
                }
            },
        });
    }
}
