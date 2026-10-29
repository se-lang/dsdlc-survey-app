import { ChangeDetectionStrategy, Component, input, Signal } from '@angular/core';
import { i18nCompute } from '../../../services/i18n/i18n.utils';
import { IconDirective } from '../../icon/icon.directive';
import { parseTaggedI18n } from '../../../util/extended-i18n';

interface TourStepContentPartText {
    type: 'text' | 'strong' | 'button';
    content: string;
}
interface TourStepContentPartIcon {
    type: 'icon';
    icon: string;
}

type TourStepContentPart = TourStepContentPartText | TourStepContentPartIcon;

@Component({
    selector: 'lla-simple-tour-step',
    imports: [IconDirective],
    templateUrl: './simple-tour-step.component.html',
    styleUrl: './simple-tour-step.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleTourStepComponent {
    readonly content = input.required<string>();

    protected readonly parsed: Signal<TourStepContentPart[]> = i18nCompute((t) => {
        return this.#parse(t.translate(this.content()));
    });

    #parse(text: string): TourStepContentPart[] {
        return parseTaggedI18n(text, (tag, content) => {
            if (tag === 'icon') {
                return { type: 'icon', icon: content };
            } else {
                return { type: tag as never, content: content };
            }
        });
    }
}
