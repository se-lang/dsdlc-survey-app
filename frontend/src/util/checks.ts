export function checkNotNull<T>(value: T): NonNullable<T> {
    if (value == null) throw new Error();
    return value;
}
