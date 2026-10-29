import { ZfCreateAccountLinkComponent } from './zf-create-account-link/zf-create-account-link.component';
import { Injectable, inputBinding } from '@angular/core';
import { QnrHtmlSpecial, QnrHtmlSpecialsContext } from '../cmp-qnr/html/specials';

/**
 * Implements `<a href="Account" target="_app">Account anlegen</a>` replacement in Zofar HTML.
 */
@Injectable()
export class ZfCreateAccountHtmlSpecial implements QnrHtmlSpecial {
    replaceSpecial(content: DocumentFragment, context: QnrHtmlSpecialsContext): void {
        const links = Array.from(content.querySelectorAll('a[href="Account"][target="_app"]'));
        for (const link of links) {
            const linkHtml = link.innerHTML;
            const placeholder = context.createPlaceholder({
                component: ZfCreateAccountLinkComponent,
                elementTag: 'lla-zf-create-account-link',
                bindings: [inputBinding('htmlContents', () => linkHtml)],
            });
            link.replaceWith(placeholder.node);
        }
    }
}
