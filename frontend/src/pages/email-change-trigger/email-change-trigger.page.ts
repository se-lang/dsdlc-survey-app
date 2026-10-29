import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { TriggerEmailChangeGQL } from '../../generated/graphql';
import { finalize } from 'rxjs';
import { DashboardPage } from '../dashboard/dashboard.page';
import { marker } from '@jsverse/transloco-keys-manager/marker';

@Component({
    selector: 'lla-email-change-trigger',
    imports: [TranslocoDirective],
    templateUrl: './email-change-trigger.page.html',
    styleUrl: './email-change-trigger.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailChangeTriggerPage {
    readonly #triggerEmailChangeGql = inject(TriggerEmailChangeGQL);

    protected readonly sending = signal(false);
    protected readonly error = signal(false);
    protected readonly success = signal(false);

    constructor() {
        inject(DashboardPage).title.set(marker('emailChange.triggerTitle'));
    }

    protected send() {
        if (this.sending()) {
            return;
        }
        this.error.set(false);
        this.success.set(false);
        this.sending.set(true);
        this.#triggerEmailChangeGql
            .mutate()
            .pipe(finalize(() => this.sending.set(false)))
            .subscribe({
                next: () => this.success.set(true),
                error: (err: unknown) => {
                    console.error('Failed to trigger email change', err);
                    this.error.set(true);
                },
            });
    }
}

export default EmailChangeTriggerPage;
