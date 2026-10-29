import { Directive, inject, input, TemplateRef } from '@angular/core';

export interface IconToggleButtonOptionTemplateContext {
    selected: boolean;
}

@Directive({
    selector: '[llaIconToggleButtonOption]',
})
export class IconToggleButtonOptionDirective {
    readonly id = input.required<string>({ alias: 'llaIconToggleButtonOption' });
    readonly icon = input.required<string>();
    readonly template = inject<TemplateRef<unknown>>(TemplateRef);

    static ngTemplateContextGuard(
        dir: IconToggleButtonOptionDirective,
        ctx: unknown,
    ): ctx is IconToggleButtonOptionTemplateContext {
        return true;
    }
}
