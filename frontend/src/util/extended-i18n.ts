import { checkNotNull } from './checks';

export type TaggedI18nHandler<T> = (tag: string, content: string) => T;

export interface PlainTextPart {
    type: 'text';
    content: string;
}

export function parseTaggedI18n<T>(
    text: string,
    handler: TaggedI18nHandler<T | null | undefined>,
): Array<T | PlainTextPart> {
    const regex = /\[\[(?<tag>\w+):(?<content>.+?)]]/g;
    const result: Array<T | PlainTextPart> = [];
    let currentIndex = 0;
    let match = regex.exec(text);
    while (match) {
        if (match.index !== currentIndex) {
            result.push({ type: 'text', content: text.substring(currentIndex, match.index) });
        }
        const groups = checkNotNull(match.groups);
        const item = handler(groups['tag'], groups['content']);
        if (item != null) {
            result.push(item);
        }
        currentIndex = match.index + match[0].length;
        match = regex.exec(text);
    }
    const rest = text.substring(currentIndex);
    if (rest !== '') {
        result.push({ type: 'text', content: rest });
    }
    return result;
}
