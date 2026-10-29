import {
    afterNextRender,
    afterRenderEffect,
    ChangeDetectionStrategy,
    Component,
    computed,
    ElementRef,
    inject,
    Injector,
    input,
    model,
    signal,
    Signal,
    viewChildren,
} from '@angular/core';
import { CalendarViewMode, calendarViewModes, ZfCalendarService } from '../zf-calendar.service';
import { Duration } from 'luxon';
import { currentLanguage, i18nCompute } from '../../../services/i18n/i18n.utils';
import { IconDirective } from '../../../components/icon/icon.directive';
import { TranslocoDirective } from '@jsverse/transloco';

interface ResolvedViewMode {
    readonly vm: CalendarViewMode;
    readonly label: string;
}

@Component({
    selector: 'lla-zf-calendar-view-mode-selector',
    imports: [IconDirective, TranslocoDirective],
    templateUrl: './zf-calendar-view-mode-selector.component.html',
    styleUrl: './zf-calendar-view-mode-selector.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[style.--_zf-active-marker-position]': 'activeMarkerOffset()',
        '[style.--_zf-active-marker-width]': 'activeMarkerWidth()',
    },
})
export class ZfCalendarViewModeSelectorComponent {
    readonly months = input.required<number>();

    mobileTitlesHidden = model.required<boolean>();

    protected readonly service = inject(ZfCalendarService);
    readonly #hostElement = inject<ElementRef<HTMLElement>>(ElementRef);
    readonly #currentLanguage = currentLanguage();
    readonly #durationFormatter: Signal<(dur: Intl.Duration) => string> = computed(() => {
        const language = this.#currentLanguage();
        if (Intl.DurationFormat) {
            const df = new Intl.DurationFormat(language, {
                style: 'long',
            });
            return Intl.DurationFormat.prototype.format.bind(df);
        } else {
            return (duration) => Duration.fromObject(duration).toHuman();
        }
    });

    protected readonly buttons: Signal<ReadonlyArray<ElementRef<HTMLButtonElement>>> = viewChildren(
        'btn',
        { read: ElementRef },
    );

    protected readonly resolvedViewModes: Signal<readonly ResolvedViewMode[]> = i18nCompute((t) => {
        const formatter = this.#durationFormatter();
        const months = this.months();
        return calendarViewModes
            .filter((vm) => months >= vm.minMonths)
            .map((vm) => {
                if ('label' in vm) {
                    return { vm: vm, label: t.translate(vm.label) };
                } else {
                    return {
                        vm: vm,
                        label: formatter(vm.duration),
                    };
                }
            });
    });

    protected readonly activeMarkerButton = computed(() => {
        const mode = this.service.viewMode();
        const buttons = this.buttons();
        const viewModes = this.resolvedViewModes();

        const index = viewModes.findIndex((vm) => vm.vm === mode);
        return index === -1 ? null : buttons[index]?.nativeElement;
    });

    constructor() {
        const injector = inject(Injector);
        afterRenderEffect({
            read: (onCleanup) => {
                const button = this.activeMarkerButton();
                if (button != null) {
                    const rect = button.getBoundingClientRect();
                    const selfRect = this.#hostElement.nativeElement.getBoundingClientRect();
                    const offset = rect.left - selfRect.left;
                    this.activeMarkerOffset.set(`${String(offset)}px`);
                    this.activeMarkerWidth.set(`${String(button.offsetWidth)}px`);

                    const anr = afterNextRender(
                        {
                            write: () => this.markerReady.set(true),
                        },
                        { injector },
                    );
                    onCleanup(() => anr.destroy());
                } else {
                    this.activeMarkerOffset.set(null);
                    this.activeMarkerWidth.set(null);
                }
            },
        });
    }

    protected readonly activeMarkerOffset = signal<string | null>(null);
    protected readonly activeMarkerWidth = signal<string | null>(null);
    protected readonly markerReady = signal(false);
}
