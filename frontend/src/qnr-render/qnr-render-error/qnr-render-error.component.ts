import { ChangeDetectionStrategy, Component, computed, input, Type } from '@angular/core';
import { AnyQnrElementFragment } from '../../generated/graphql';

@Component({
    selector: 'lla-qnr-render-error',
    imports: [],
    template: `
        <div style="color: red" [title]="elementTitle()">
            @switch (errorType()) {
                @case ('ref') {
                    <strong>!REF!: {{ elementDisplay() }}</strong>
                }
                @case ('render') {
                    <strong>!NO_RENDER!: {{ elementDisplay() }}</strong>
                }
                @case ('unknown') {
                    <strong>!ERR!: {{ elementDisplay() }}</strong>
                }
            }
        </div>
    `,
    styles: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QnrRenderErrorComponent {
    readonly elementId = input.required<string>();
    readonly element = input.required<AnyQnrElementFragment | null | undefined>();
    readonly render = input.required<Type<unknown> | null | undefined>();
    protected readonly elementDisplay = computed(() => {
        const parts: string[] = [];
        const element = this.element();
        if (element) {
            parts.push(`type=${element.__typename}`);
        }
        parts.push(`id=${this.elementId()}`);
        return `[${parts.join(', ')}]`;
    });

    protected readonly elementTitle = computed(() => {
        return this.element()?.types.join(', ') ?? null;
    });

    protected readonly errorType = computed(() => {
        if (this.element() == null) {
            return 'ref' as const;
        } else if (this.render() == null) {
            return 'render' as const;
        } else {
            return 'unknown' as const;
        }
    });
}
