import { Provider } from '@angular/core';
import { provideQnrComponent } from '../services/qnr/qnr-components';
import { ZfCalendarComponent } from './zf-calendar/zf-calendar/zf-calendar.component';
import { ZfEpisodeTableComponent } from './zf-episode-table/zf-episode-table/zf-episode-table.component';
import { provideQnrHtmlSpecial } from '../cmp-qnr/html/specials';
import { ZfCreateAccountHtmlSpecial } from './zf-account-link-html-special';

/**
 * Provide registrations for any questionnaire components specific to the Zofar system.
 */
export function provideZofarComponents(): Provider {
    return [
        provideQnrComponent('ZfEpisodesCalendarElement', ZfCalendarComponent),
        provideQnrComponent('ZfEpisodesTableElement', ZfEpisodeTableComponent),
        provideQnrHtmlSpecial({ useClass: ZfCreateAccountHtmlSpecial }),
    ] satisfies Provider[];
}
