export type JsonSerializable = string | number | boolean | null | JsonObject | JsonArray;

// Must use an interface because of recursive nature
// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
interface JsonObject {
    [member: string]: JsonSerializable;
}
type JsonArray = JsonSerializable[];
