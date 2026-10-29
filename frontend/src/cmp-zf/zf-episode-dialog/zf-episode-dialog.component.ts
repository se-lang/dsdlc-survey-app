import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    ElementRef,
    inject,
    input,
    NO_ERRORS_SCHEMA,
    output,
    signal,
    Signal,
    viewChild,
} from '@angular/core';
import { DialogHeaderComponent } from '../../components/dialog/dialog-header/dialog-header.component';
import { formatDateComputed } from '../../locale/date-formats';
import { DialogContentComponent } from '../../components/dialog/dialog-content/dialog-content.component';
import { uniqueComponentId } from '../../util/unique-component-id';
import { DialogCloseDirective } from '../../components/dialog/dialog/dialog-close.directive';
import {
    AbstractControl,
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
    combineLatest,
    distinctUntilChanged,
    finalize,
    map,
    Observable,
    startWith,
    switchMap,
} from 'rxjs';
import { checkNotNull } from '../../util/checks';
import {
    ZfEpisodeCategoryFragment,
    ZfEpisodeEntryFragment,
    ZfEpisodesBaseFragment,
    ZfEpisodeTypeFragment,
} from '../../generated/graphql';
import { MonthYearPickerInputDirective } from '../../components/month-year-picker/month-year-picker-input.directive';
import { MonthYearPickerComponent } from '../../components/month-year-picker/month-year-picker/month-year-picker.component';
import { ZfEpisodeColorStylesDirective } from '../zf-episode-color-styles.directive';
import { DialogFooterComponent } from '../../components/dialog/dialog-footer/dialog-footer.component';
import { TranslocoDirective } from '@jsverse/transloco';
import { IconDirective } from '../../components/icon/icon.directive';
import { canSubmitForm } from '../../util/form-submit';
// https://youtrack.jetbrains.com/issue/WEB-73818/Import-can-be-shortened-is-problematic-for-imports-with-side-effects
import { DateTime } from '../../util/luxon';
import { ZF_EPISODE_SERVICE } from '../../services/zf/zf-episode.interface';
import { zofarEpisodeBadges } from '../../data/zf-episode-badges';
import { i18nCompute } from '../../services/i18n/i18n.utils';
import { ValidationErrorDirective, ValidationErrorsComponent } from 'ngx-valdemort';
import { TourHighlightElementDirective } from '../../components/tour/tour-highlight-element.directive';
import { marker } from '@jsverse/transloco-keys-manager/marker';

type FormGroupType = FormGroup<{
    start: FormControl<string | null>;
    end: FormControl<string | null>;
}>;

const startEndValidator: ValidatorFn = (fg: AbstractControl) => {
    const form = fg as FormGroupType;
    if (form.controls.start.disabled || form.controls.end.disabled) {
        return null;
    }
    const startValue = form.controls.start.value;
    const endValue = form.controls.end.value;
    if (startValue == null || endValue == null) {
        return null;
    }
    try {
        const startDate = DateTime.fromISO(startValue);
        const endDate = DateTime.fromISO(endValue);
        if (startDate > endDate) {
            return {
                startEndMismatch: true,
            };
        }
        return null;
    } catch {
        return null;
    }
};

@Component({
    selector: 'lla-zf-episode-dialog',
    imports: [
        DialogHeaderComponent,
        DialogContentComponent,
        DialogCloseDirective,
        ReactiveFormsModule,
        MonthYearPickerInputDirective,
        MonthYearPickerComponent,
        ZfEpisodeColorStylesDirective,
        DialogFooterComponent,
        TranslocoDirective,
        IconDirective,
        ValidationErrorsComponent,
        ValidationErrorDirective,
        TourHighlightElementDirective,
    ],
    templateUrl: './zf-episode-dialog.component.html',
    styleUrl: './zf-episode-dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    schemas: [NO_ERRORS_SCHEMA],
})
export class ZfEpisodeDialogComponent {
    readonly element = input.required<ZfEpisodesBaseFragment>();
    readonly calendarZoom = input.required<number | null>();
    readonly editEpisode = input<ZfEpisodeEntryFragment | null>();
    readonly newEpisodePrefill = input<Partial<ZfEpisodeEntryFragment> | null>();
    readonly selectedEpisodeTypeCategory = input<ZfEpisodeCategoryFragment | null>(null);
    readonly closeDialog = output();

    protected readonly componentId = uniqueComponentId();
    protected readonly episodeService = inject(ZF_EPISODE_SERVICE);

    readonly #fb = new FormBuilder().nonNullable;
    readonly formGroup = this.#fb.group(
        {
            name: this.#fb.control(''),
            type: this.#fb.control<string | null>(null, Validators.required),
            start: this.#fb.control<string | null>(null, Validators.required),
            end: this.#fb.control<string | null>(null, Validators.required),
            beforeStart: this.#fb.control(false),
            afterEnd: this.#fb.control(false),
            event: this.#fb.control(false),
            badge: this.#fb.control<string | null>(null, Validators.required),
        },
        {
            validators: [startEndValidator],
        },
    );

    readonly selectedType: Signal<ZfEpisodeTypeFragment | null>;
    readonly selectedBadge: Signal<string | null>;
    readonly allowEvents: Signal<boolean>;
    readonly eventSelected: Signal<boolean>;

    readonly availableElementTypes = computed(() => {
        let typeCategory: ZfEpisodeCategoryFragment | null | undefined =
            this.selectedEpisodeTypeCategory();
        if (typeCategory == null) {
            const edit = this.editEpisode();
            if (edit != null) {
                typeCategory = this.element().episodeCategories.find((c) =>
                    c.typeIds.includes(edit.episodeTypeId),
                );
            }
        }
        if (typeCategory != null) {
            const tc = typeCategory;
            return this.element().episodeTypes.filter((e) => tc.typeIds.includes(e.id));
        } else {
            return this.element().episodeTypes;
        }
    });

    readonly #formattedMinDate = formatDateComputed(() => this.element().minDate, 'longMonthYear');

    readonly #formattedMaxDate = formatDateComputed(() => this.element().maxDate, 'longMonthYear');

    readonly subtitle = computed(() => {
        return `${this.#formattedMinDate()} bis ${this.#formattedMaxDate()}`;
    });

    readonly #fallbackTitle = i18nCompute((t) =>
        t.translate(marker('episodeDialog.newEpisodeTitle')),
    );

    readonly title = computed(() => {
        return this.editEpisode()?.label ?? this.#fallbackTitle();
    });

    readonly formattedAfterEndLabel = computed(() => {
        return this.element().afterEndFieldLabel.replace('{{date}}', this.#formattedMaxDate());
    });
    readonly formattedBeforeStartLabel = computed(() => {
        return this.element().beforeStartFieldLabel.replace('{{date}}', this.#formattedMinDate());
    });

    protected readonly submitting = signal(false);

    protected readonly translatedBadges = i18nCompute((t) => {
        const mapped = zofarEpisodeBadges.map(([id, key]) => ({
            id,
            label: t.translate(key),
        }));
        const comparator = new Intl.Collator(t.getActiveLang(), {
            sensitivity: 'base',
        });
        mapped.sort((a, b) => {
            return comparator.compare(a.label, b.label);
        });
        return mapped;
    });

    private readonly form = viewChild.required<unknown, ElementRef<HTMLFormElement>>(
        'formElement',
        { read: ElementRef },
    );

    constructor() {
        effect(() => {
            const prefill = this.editEpisode() ?? this.newEpisodePrefill();
            if (prefill != null) {
                this.formGroup.setValue({
                    name: prefill.label ?? '',
                    type: prefill.episodeTypeId ?? null,
                    start:
                        prefill.startDate == null
                            ? null
                            : DateTime.fromISO(prefill.startDate).toISODate().substring(0, 7),
                    end:
                        prefill.endDate == null
                            ? null
                            : DateTime.fromISO(prefill.endDate).toISODate().substring(0, 7),
                    afterEnd: !!prefill.flags?.includes('AFTER_END'),
                    beforeStart: !!prefill.flags?.includes('BEFORE_START'),
                    event: prefill.event ?? false,
                    badge: prefill.badge ?? null,
                });
            }
        });

        const episodeTypes$ = toObservable(this.element).pipe(
            map((element) => element.episodeTypes),
        );
        combineLatest({
            beforeStart: this.#controlValue$(this.formGroup.controls.beforeStart),
            afterEnd: this.#controlValue$(this.formGroup.controls.afterEnd),
            event: this.#controlValue$(this.formGroup.controls.event),
            episodeType: this.#controlValue$(this.formGroup.controls.type).pipe(
                switchMap((typeId) =>
                    episodeTypes$.pipe(map((types) => types.find((t) => t.id === typeId))),
                ),
            ),
        }).subscribe(({ event, episodeType, afterEnd, beforeStart }) => {
            const hasEventSelected = event && !!episodeType?.allowEvents;
            this.#setEnabledState(this.formGroup.controls.event, !!episodeType?.allowEvents);
            this.#setEnabledState(this.formGroup.controls.end, !afterEnd && !hasEventSelected);
            this.#setEnabledState(this.formGroup.controls.afterEnd, !hasEventSelected);

            this.#setEnabledState(this.formGroup.controls.beforeStart, !hasEventSelected);
            this.#setEnabledState(this.formGroup.controls.start, !beforeStart || hasEventSelected);
            this.#setEnabledState(this.formGroup.controls.badge, hasEventSelected);
        });

        const eventEnabled = toSignal(this.formGroup.controls.event.valueChanges, {
            initialValue: this.formGroup.controls.event.value,
        });

        const type = toSignal(this.formGroup.controls.type.valueChanges, {
            initialValue: this.formGroup.controls.type.value,
        });
        this.selectedType = computed(() => {
            const typeId = type();
            return this.element().episodeTypes.find((e) => e.id === typeId) ?? null;
        });

        this.selectedBadge = toSignal(this.formGroup.controls.badge.valueChanges, {
            initialValue: this.formGroup.controls.badge.value,
        });

        this.allowEvents = computed(() => {
            const type = this.selectedType();
            return !!type?.allowEvents;
        });
        this.eventSelected = computed(() => {
            return this.allowEvents() && eventEnabled();
        });
    }

    #controlValue$<T>(control: FormControl<T>): Observable<T> {
        return control.valueChanges.pipe(startWith(control.value), distinctUntilChanged());
    }

    #setEnabledState(control: AbstractControl<unknown>, enabled: boolean) {
        if (enabled) {
            control.enable();
        } else {
            control.disable();
        }
    }

    submit(event: SubmitEvent) {
        if (this.submitting()) {
            return;
        }
        if (canSubmitForm(this.formGroup)) {
            let start: string | null;
            if (!this.formGroup.controls.event.value && this.formGroup.controls.beforeStart.value) {
                start = null;
            } else {
                start = DateTime.fromISO(checkNotNull(this.formGroup.controls.start.value))
                    .startOf('month')
                    .toISODate();
            }
            let end: string | null;
            if (this.formGroup.controls.event.value || this.formGroup.controls.afterEnd.value) {
                end = null;
            } else {
                end = DateTime.fromISO(checkNotNull(this.formGroup.controls.end.value))
                    .endOf('month')
                    .toISODate();
            }

            const continueToDetails = !!event.submitter?.hasAttribute('data-continue-to-details');
            this.submitting.set(true);
            this.episodeService
                .saveEpisode({
                    continueToDetails,
                    data: {
                        existingId: this.editEpisode()?.id ?? null,
                        name: this.formGroup.controls.name.value,
                        start: start,
                        end: end,
                        type: checkNotNull(this.formGroup.controls.type.value),
                        event: this.formGroup.controls.event.value,
                        badge: this.formGroup.controls.badge.value,
                        calendarZoom: this.calendarZoom(),
                    },
                })
                .pipe(finalize(() => this.submitting.set(false)))
                .subscribe({
                    next: () => {
                        this.closeDialog.emit();
                    },
                    error: (err: unknown) => {
                        // TODO: Show error
                        console.error('Error during episode save', err);
                    },
                });
        } else {
            console.error(
                'form error!"',
                this.formGroup.errors,
                Object.fromEntries(
                    Object.entries(this.formGroup.controls).map(([k, v]) => [k, v.errors]),
                ),
            );
            this.formGroup.markAllAsTouched();
            this.form().nativeElement.querySelector<HTMLElement>('.ng-invalid')?.focus();
        }
    }
}
