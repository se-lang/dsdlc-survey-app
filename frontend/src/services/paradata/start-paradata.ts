import {
    EnvironmentProviders,
    inject,
    Injector,
    provideAppInitializer,
    runInInjectionContext,
} from '@angular/core';
import { replaceParadataSink } from './barebones';

export function provideParadata(): EnvironmentProviders {
    return provideAppInitializer(() => {
        const injector = inject(Injector);
        import('./paradata-bundle').then(
            ({ BrowserParadataService, ParadataService }) => {
                runInInjectionContext(injector, () => {
                    const paradataService = inject(ParadataService);
                    replaceParadataSink((stored) => paradataService.replaceParadataSink(stored));

                    const browserParadataService = inject(BrowserParadataService);
                    browserParadataService.start();
                });
            },
            (err: unknown) => console.error('Failed to load paradata bundle', err),
        );
    });
}
