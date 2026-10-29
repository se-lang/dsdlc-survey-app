import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

/**
 * Add the Accept-Language header to any /api/ requests, to make sure the backend knows the language.
 */
export const apiLanguageHeaderInterceptor: HttpInterceptorFn = (req, next) => {
    if (req.url.startsWith('/api/')) {
        const transloco = inject(TranslocoService);
        return next(
            req.clone({
                setHeaders: {
                    'Accept-Language': transloco.getActiveLang(),
                },
            }),
        );
    }
    return next(req);
};
