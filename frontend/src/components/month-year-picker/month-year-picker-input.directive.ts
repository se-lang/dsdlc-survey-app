import {
    DestroyRef,
    Directive,
    effect,
    ElementRef,
    forwardRef,
    inject,
    Injector,
    input,
    signal,
    ViewContainerRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MonthYearPickerButtonComponent } from './month-year-picker-button/month-year-picker-button.component';
import { MonthYearPickerComponent } from './month-year-picker/month-year-picker.component';
import { parseDate } from '../../util/date';
import { DateTime } from '../../util/luxon';
import { formatDateComputed } from '../../locale/date-formats';

@Directive({
    selector: 'input[llaMonthYearPickerInput]',
    host: {
        class: 'lla-month-year-picker',
        '(blur)': 'onTouched?.()',
        '[readonly]': 'true',
        '[value]': 'formattedDate()',
    },
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: forwardRef(() => MonthYearPickerInputDirective),
        },
    ],
    exportAs: 'llaMonthYearPickerInput',
})
export class MonthYearPickerInputDirective implements ControlValueAccessor {
    readonly min = input(undefined, {
        transform: parseDate,
    });
    readonly max = input(undefined, {
        transform: parseDate,
    });
    readonly initialDate = input(undefined, {
        transform: parseDate,
    });

    readonly disabled = signal(false);
    readonly date = signal<DateTime | null>(null);
    readonly formattedDate = formatDateComputed(this.date, 'longMonthYear');

    readonly #vcr = inject(ViewContainerRef);
    readonly #host = inject<ElementRef<HTMLInputElement>>(ElementRef);

    onChange?: (value: string | null) => void;
    onTouched?: () => void;

    constructor() {
        const wrapper = inject(MonthYearPickerComponent, {
            host: true,
            optional: true,
        });
        if (wrapper == null) {
            throw new Error('monthYearPickerInput must be wrapped in MonthYearPickerComponent');
        }
        this.#vcr.createComponent(MonthYearPickerButtonComponent, {
            injector: Injector.create({
                providers: [
                    {
                        provide: MonthYearPickerInputDirective,
                        useValue: this,
                    },
                ],
                parent: inject(Injector),
            }),
        });

        const updateDisabled = () => {
            this.disabled.set(this.#host.nativeElement.disabled);
        };

        const observer = new MutationObserver(updateDisabled);
        observer.observe(this.#host.nativeElement, {
            attributes: true,
            attributeFilter: ['disabled'],
        });
        inject(DestroyRef).onDestroy(() => observer.disconnect());
        updateDisabled();

        effect(() => {
            const date = this.date();
            this.onChange?.(date?.toISODate() ?? null);
        });
    }

    writeValue(obj: unknown): void {
        let parsed: null | DateTime;
        try {
            parsed = obj == null || obj === '' ? null : parseDate(obj);
        } catch (e) {
            console.warn('Failed to parse value as month picker data', obj, e);
            parsed = null;
        }
        this.date.set(parsed);
    }

    registerOnChange(fn: (value: string | null) => void): void {
        this.onChange = fn;
    }
    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }
    setDisabledState?(isDisabled: boolean): void {
        this.#host.nativeElement.disabled = isDisabled;
    }
}
