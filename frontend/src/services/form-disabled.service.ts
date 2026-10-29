import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class FormDisabledService {
    handleLabelDisabledTrigger() {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'disabled') {
                    const element = mutation.target;
                    if (element instanceof Element && element.id) {
                        const labels = document.querySelectorAll(`label[for="${element.id}"]`);
                        const disabled = 'disabled' in element && Boolean(element.disabled);
                        for (const label of labels) {
                            label.classList.toggle('lla-form-label--disabled', disabled);
                        }
                    }
                }
            }
        });
        observer.observe(document.body, {
            subtree: true,
            attributes: true,
            attributeFilter: ['disabled'],
        });
    }
}
