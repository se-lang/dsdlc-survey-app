import { computed, Directive, input } from '@angular/core';
import {
    ZfEpisodeCategoryFragment,
    ZfEpisodeEntryFragment,
    ZfEpisodeTypeFragment,
} from '../generated/graphql';
import { checkNotNull } from '../util/checks';

// fallback colors are the classic pink/black checkerboard error texture colors
// these stand out if the color may be missing
const suffixes = [
    ['', '#ff00dc'],
    ['-fg', '#000'],
    ['-stripe', '#000'],
] as const;

/**
 * Applies --lla-zf-episode-clr, --lla-zf-episode-clr-fg and --lla-zf-episode-clr-stripe
 * styles based on the provided episode type or episode type category.
 */
@Directive({
    selector: '[llaZfEpisodeColorStyles]',
    host: {
        '[style]': 'styles()',
    },
})
export class ZfEpisodeColorStylesDirective {
    readonly inputValue = input.required<
        ZfEpisodeEntryFragment | ZfEpisodeTypeFragment | ZfEpisodeCategoryFragment | string | null
    >({
        alias: 'llaZfEpisodeColorStyles',
    });

    protected readonly styles = computed(() => {
        const rawValue = this.inputValue();
        let episodeType: string | null;
        if (typeof rawValue === 'string' || rawValue == null) {
            episodeType = rawValue;
        } else if (rawValue.__typename === 'ZfEpisodeEntry') {
            episodeType = rawValue.episodeTypeId;
        } else if (rawValue.__typename === 'ZfEpisodeType') {
            episodeType = rawValue.id;
        } else {
            episodeType = checkNotNull(rawValue.typeIds[0]);
        }
        if (episodeType == null) {
            return null;
        } else {
            return suffixes
                .map(([suffix, def]) => {
                    return `--lla-zf-episode-clr${suffix}: var(--lla-clr-episode-${episodeType}${suffix}, ${def});`;
                })
                .join('');
        }
    });
}
