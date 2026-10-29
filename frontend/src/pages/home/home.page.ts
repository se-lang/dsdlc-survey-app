import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { LoginStateService } from '../../services/login/login-state.service';

@Component({
    selector: 'lla-home',
    imports: [RouterLink],
    templateUrl: './home.page.html',
    styleUrl: './home.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
    readonly user = toSignal(inject(LoginStateService).currentUser());
    readonly email = computed(() => {
        const user = this.user();
        if (user?.__typename === 'User') {
            return user.email;
        } else {
            return '';
        }
    });
}
