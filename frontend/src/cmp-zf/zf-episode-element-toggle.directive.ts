import { computed, Directive, inject, linkedSignal } from '@angular/core';
import { EpisodeViewType, ZF_EPISODE_SERVICE } from '../services/zf/zf-episode.interface';

@Directive({
    selector: '[llaZfEpisodeElementToggle]',
    host: {
        '[attr.aria-hidden]': 'isHidden() ? "true" : null',
        class: 'lla-zf-toggled-element',
        '[class.lla-zf-toggled-element--was-hidden-once]': 'wasHiddenOnce()',
    },
})
export class ZfEpisodeElementToggleDirective {
    // unfortunately this cannot be an input, because this directive is designed to be used as a host directive,
    // and you cannot set inputs for them: https://github.com/angular/angular/issues/50510
    // Once that issue is fixed, replace with an input
    protected viewType: EpisodeViewType = 'calendar';
    protected readonly zfEpisodeService = inject(ZF_EPISODE_SERVICE);

    readonly isHidden = computed(
        () =>
            this.zfEpisodeService.showViewTypeSwitcher() &&
            this.zfEpisodeService.resolvedViewType() !== this.viewType,
    );

    protected readonly wasHiddenOnce = linkedSignal<boolean, boolean>({
        source: this.isHidden,
        computation: (isHidden, previous) => {
            return isHidden || !!previous?.source;
        },
    });

    static setViewType(viewType: EpisodeViewType) {
        inject(ZfEpisodeElementToggleDirective).viewType = viewType;
    }
}
