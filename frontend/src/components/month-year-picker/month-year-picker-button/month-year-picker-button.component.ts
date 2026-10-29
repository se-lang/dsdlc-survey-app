import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { IconDirective } from '../../icon/icon.directive';
import { ArrowPopoverComponent } from '../../arrow-popover/arrow-popover.component';
import { PopoverDirective } from '../../popover/popover.directive';
import { TriggerPopoverDirective } from '../../popover/trigger-popover.directive';
import { MonthYearPickerContentComponent } from '../month-year-picker-content/month-year-picker-content.component';
import { MonthYearPickerInputDirective } from '../month-year-picker-input.directive';

@Component({
    selector: 'lla-month-year-picker-button',
    imports: [
        IconDirective,
        ArrowPopoverComponent,
        PopoverDirective,
        TriggerPopoverDirective,
        MonthYearPickerContentComponent,
    ],
    templateUrl: './month-year-picker-button.component.html',
    styleUrl: './month-year-picker-button.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonthYearPickerButtonComponent {
    protected readonly directive = inject(MonthYearPickerInputDirective);
}
