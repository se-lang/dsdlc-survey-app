const ID_PREFIX = 'lla-';
let idCounter = 0;

export function uniqueComponentId(prefix = ''): string {
    return ID_PREFIX + prefix + String(idCounter++);
}
