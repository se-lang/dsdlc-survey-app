import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, share, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class IconService {
    readonly #http = inject(HttpClient);
    readonly #cache = new Map<string, Observable<SVGElement | undefined>>();

    getIcon(name: string): Observable<SVGElement | undefined> {
        let data = this.#cache.get(name);
        if (data == null) {
            data = this.#loadIcon(name).pipe(
                catchError((err) => {
                    console.error('Failed to load icon', name, err);
                    return of(undefined);
                }),
                tap((svg) => this.#cache.set(name, of(svg))),
                share(),
            );
            this.#cache.set(name, data);
        }
        return data.pipe(map((svg) => svg?.cloneNode(true) as SVGElement | undefined));
    }

    #loadIcon(name: string): Observable<SVGElement> {
        return this.#http
            .get(`/assets/icons/${name}.svg`, { responseType: 'text' })
            .pipe(map((svgText) => this.#parseIcon(svgText)));
    }

    #parseIcon(data: string): SVGElement {
        const tpl = document.createElement('template');
        tpl.innerHTML = data;
        const svg = tpl.content.querySelector('svg');
        if (svg == null) {
            throw new Error('Failed to parse SVG icon, SVG tag not found.');
        }
        return svg;
    }
}
