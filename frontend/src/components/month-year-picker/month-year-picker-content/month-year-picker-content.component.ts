import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { i18nCompute } from '../../../services/i18n/i18n.utils';
import { DateTime, Info } from 'luxon';
import { IconDirective } from '../../icon/icon.directive';
import { DatePipe } from '../../../locale/date.pipe';
import { MonthYearPickerInputDirective } from '../month-year-picker-input.directive';
import { popoverHandle } from '../../popover/popover.interface';

@Component({
    selector: 'lla-month-year-picker-content',
    imports: [IconDirective, DatePipe],
    templateUrl: './month-year-picker-content.component.html',
    styleUrl: './month-year-picker-content.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonthYearPickerContentComponent {
    protected readonly directive = inject(MonthYearPickerInputDirective);
    readonly #popover = popoverHandle();
    readonly date = computed(() => {
        const date = this.directive.date();
        if (date != null) {
            return date;
        }
        const initial = this.directive.initialDate();
        const min = this.directive.min();
        const max = this.directive.max();
        if (initial != null) {
            let result = initial;
            if (min != null && initial < min) {
                result = min;
            }
            if (max != null && initial > max) {
                result = max;
            }
            return result;
        }
        return min ?? max ?? DateTime.now();
    });
    readonly year = computed(() => this.date().year);
    readonly month = computed(() => this.date().month);
    readonly months = i18nCompute((t) =>
        Info.months('short', {
            locale: t.getActiveLang(),
        }),
    );

    protected prevYearDisabled = computed<boolean>(() => {
        const min = this.directive.min();
        return min != null && min.year >= this.year();
    });

    protected nextYearDisabled = computed<boolean>(() => {
        const max = this.directive.max();
        return max != null && max.year <= this.year();
    });

    protected minMonth = computed(() => {
        const min = this.directive.min();
        return min != null && this.year() === min.year ? min.month : 1;
    });

    protected maxMonth = computed(() => {
        const max = this.directive.max();
        return max != null && this.year() === max.year ? max.month : 12;
    });

    setMonth(month: number) {
        this.#update((d) => d.set({ month }));
        this.#popover.close();
    }

    updateYear(diff: number) {
        this.#update((d) => d.plus({ years: diff }));
    }

    #update(updateFn: (d: DateTime) => DateTime) {
        const date = this.date();
        const newDate = updateFn(date);
        this.directive.date.set(newDate);
        this.directive.onChange?.(newDate.toISODate());
        this.directive.writeValue(newDate);
    }
}
