import { ActivatedRouteSnapshot } from '@angular/router';

export function walkRouteTree(
    tree: ActivatedRouteSnapshot,
    fn: (element: ActivatedRouteSnapshot) => void,
): void {
    fn(tree);
    for (const child of tree.children) {
        walkRouteTree(child, fn);
    }
}
