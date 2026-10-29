import { inject, InjectionToken, Signal } from '@angular/core';

export type PopoverPlacement = 'top' | 'bottom';

export interface PopoverHandle {
    readonly placement: Signal<PopoverPlacement>;
    close(): void;
}

export const POPOVER_HANDLE = new InjectionToken<PopoverHandle>('POPOVER_HANDLE');

export function popoverHandle(optional?: false): PopoverHandle;
export function popoverHandle(optional?: boolean): PopoverHandle | null;
export function popoverHandle(optional = false): PopoverHandle | null {
    return inject(POPOVER_HANDLE, { optional: optional });
}
