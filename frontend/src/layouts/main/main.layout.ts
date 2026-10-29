import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Data, RouterOutlet } from '@angular/router';
import { TopMenuComponent } from '../../components/top-menu/top-menu.component';
import { bindElementClass } from '../../util/element-class-binding';

export type RootBackgroundStyle = 'plain' | 'icons' | 'icons-dark';

const ROOT_BACKGROUND_STYLE = 'lla-root-bg-style';

export function rootBackgroundStyle(style: RootBackgroundStyle): Data {
    return {
        [ROOT_BACKGROUND_STYLE]: style,
    };
}

@Component({
    selector: 'lla-main',
    imports: [RouterOutlet, TopMenuComponent],
    templateUrl: './main.layout.html',
    styleUrl: './main.layout.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayout {
    readonly bgStyle = input<RootBackgroundStyle>(undefined, {
        // // this is expected to be set from the route data, so the alias makes sense
        // // we have to copy-paste the value of ROOT_BACKGROUND_STYLE here, because alias
        // // must be "statically analyzable"
        // // eslint-disable-next-line @angular-eslint/no-input-rename
        // alias: 'lla-root-bg-style',
    });

    constructor() {
        bindElementClass(document.documentElement, () => {
            return `lla-root-bg-style--${this.bgStyle() ?? 'plain'}`;
        });
    }
}
