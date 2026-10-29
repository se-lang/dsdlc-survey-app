import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    Injector,
    input,
} from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { qnrComponentLookup } from '../../services/qnr/qnr-components';
import { QnrRenderErrorComponent } from '../qnr-render-error/qnr-render-error.component';
import { QUESTIONNAIRE_SERVICE } from '../../services/qnr/questionnaire-service-interface';

@Component({
    selector: 'lla-qnr-element',
    imports: [NgComponentOutlet, QnrRenderErrorComponent],
    templateUrl: './qnr-element.component.html',
    styleUrl: './qnr-element.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[attr.data-zf-element-type]': 'element()?.__typename',
        '[attr.data-zf-element-id]': 'elementId()',
    },
})
export class QnrElementComponent {
    readonly elementId = input.required<string>();
    readonly overrideInjector = input<Injector | null | undefined>();

    readonly #service = inject(QUESTIONNAIRE_SERVICE);
    readonly #qnrComponents = qnrComponentLookup();

    readonly element = computed(() => {
        return this.#service.context()?.element(this.elementId());
    });

    protected readonly component = computed(() => {
        const element = this.element();
        if (element == null) {
            return null;
        }
        return this.#qnrComponents.getComponent(element);
    });

    protected readonly inputs = computed(() => {
        const context = this.#service.context();
        if (context == null) return null;
        const element = this.element();
        if (element == null) return null;

        const componentDef = this.component();
        return componentDef?.inputsFactory(element, context);
    });
}
