import { DestroyRef, Directive, inject, signal } from '@angular/core';
import { LoginService } from '../services/login/login.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { delay, finalize, ignoreElements, mergeWith, of, startWith, switchMap } from 'rxjs';

@Directive({
    selector: 'button[llaLogoutTrigger]',
    exportAs: 'llaLogoutTrigger',
    host: {
        '(click)': 'logout()',
        '[disabled]': 'loadingDelayedWritable()',
    },
})
export class LogoutTriggerDirective {
    readonly #loginService = inject(LoginService);
    readonly #destroyRef = inject(DestroyRef);
    readonly #router = inject(Router);

    protected readonly loadingWritable = signal(false);
    protected readonly loadingDelayedWritable = signal(false);
    readonly loading = this.loadingDelayedWritable.asReadonly();

    protected logout() {
        if (this.loadingWritable()) {
            return;
        }
        this.#loginService
            .logout()
            .pipe(
                switchMap(() => this.#router.navigate(['/'], { onSameUrlNavigation: 'reload' })),
                ignoreElements(),
                mergeWith(of({ loading: true, delayed: true }).pipe(delay(150))),
                startWith({ loading: true, delayed: false }),
                takeUntilDestroyed(this.#destroyRef),
                finalize(() => {
                    this.loadingWritable.set(false);
                    this.loadingDelayedWritable.set(false);
                }),
            )
            .subscribe({
                next: ({ loading, delayed }) => {
                    this.loadingWritable.set(loading);
                    this.loadingDelayedWritable.set(delayed);
                },
                error: (err: unknown) => console.error('Failed to log out', err),
            });
    }
}
