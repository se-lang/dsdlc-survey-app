import {
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChildren,
    model,
} from '@angular/core';
import { IconToggleButtonOptionDirective } from '../icon-toggle-button-option.directive';
import { IconDirective } from '../../icon/icon.directive';
import { NgTemplateOutlet } from '@angular/common';

@Component({
    selector: 'lla-icon-toggle-button, [llaIconToggleButton]',
    imports: [IconDirective, NgTemplateOutlet],
    templateUrl: './icon-toggle-button.component.html',
    styleUrl: './icon-toggle-button.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        type: 'button',
        class: 'lla-button lla-stacked-icon-button lla-stacked-icon-button--toggle',
        '(click)': 'switchSelected(unselectedOption())',
        '[style.--selected-index]': 'selectedIndex()',
    },
})
export class IconToggleButtonComponent {
    readonly selectedId = model.required<string>();
    readonly options = contentChildren(IconToggleButtonOptionDirective);
    protected readonly unselectedOption = computed(() => {
        const options = this.options();
        const currentOption = this.selectedId();
        const unselectedLanguage = options.find((l) => l.id() !== currentOption);
        if (unselectedLanguage == null) {
            throw new Error('There must be exactly two options for lla-icon-toggle-button');
        }
        return unselectedLanguage;
    });
    protected selectedIndex = computed(() => {
        const currentId = this.selectedId();
        return this.options().findIndex((l) => l.id() !== currentId);
    });

    protected switchSelected(option: IconToggleButtonOptionDirective) {
        this.selectedId.set(option.id());
    }
}
