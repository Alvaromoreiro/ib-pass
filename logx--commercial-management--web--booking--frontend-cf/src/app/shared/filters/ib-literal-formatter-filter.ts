import angular from 'angular';

angular
    .module('ib-booking-filters-module')
    .filter('literalFormatter', LiteralFormatter);

export type TagsInfo = {
    [key: string]: {
        tag: string;
        class?: string | string[];
        [property: string]: any;
    }
};

type TagInfo = TagsInfo[string];

const defaultTagsInfo: TagsInfo = {
    bold: {
        tag: 'span',
        class: 'ib-text ib-text--bold'
    },
    under: {
        tag: 'span',
        class: 'ib-text ib-text--underline'
    }
};

function LiteralFormatter () {
    return formatLiteral;

    function formatLiteral (input: string, tagsInfo: TagsInfo = {}): string {
        if (!input) return '';

        const mergedTagsInfo = mergeWithDefaults(tagsInfo);
        normalizeClasses(mergedTagsInfo);

        return formatLiteral2(input, mergedTagsInfo);
    }

    function mergeWithDefaults (tagsInfo: TagsInfo): TagsInfo {
        const merged: TagsInfo = { ...defaultTagsInfo };
        for (const key in tagsInfo) {
            merged[key] = { ...(defaultTagsInfo[key] ?? {}), ...tagsInfo[key] };
        }
        return merged;
    }

    function normalizeClasses (tagsInfo: TagsInfo): void {
        for (const key in tagsInfo) {
            const tagInfo = tagsInfo[key];
            if (tagInfo.class && !Array.isArray(tagInfo.class)) {
                tagInfo.class = (tagInfo.class as string).split(' ');
            }
        }
    }

    function formatLiteral2 (input: string, tagsInfo: TagsInfo): string {
        const matches = getMatches(input);

        for (let i = matches.length - 1; i >= 0; i--) {
            const match = matches[i];
            const before = input.substring(0, match.index);
            const after = input.substring(match.index + match[0].length);

            if (!after.includes('$$')) continue;

            const key = match[1];
            const otherKeys = match[2] ? match[2].substring(1).split('+') : [];
            const { tagOpen, tagClose } = buildTags(key, otherKeys, tagsInfo);

            input = before + tagOpen + after.replace('$$', tagClose);
        }

        return input;
    }

    function buildTags (key: string, otherKeys: string[], tagsInfo: TagsInfo): { tagOpen: string; tagClose: string } {
        const tagInfo = tagsInfo[key];
        if (!tagInfo?.tag) return { tagOpen: '', tagClose: '' };

        const classSet: string[] = [];
        addClassToSet(classSet, tagInfo);
        otherKeys.forEach(otherKey => addClassToSet(classSet, tagsInfo[otherKey]));

        const attrs = Object.entries(tagInfo)
            .filter(([prop]) => prop !== 'tag' && prop !== 'class')
            .map(([prop, value]) => value !== '' ? `${prop}="${String(value)}"` : prop)
            .join(' ');

        const classAttr = classSet.length ? ` class="${classSet.join(' ')}"` : '';
        const attrsStr = attrs ? ` ${attrs}` : '';

        return {
            tagOpen: `<${tagInfo.tag}${attrsStr}${classAttr}>`,
            tagClose: `</${tagInfo.tag}>`
        };
    }

    function getMatches (input: string): RegExpExecArray[] {
        const expRegOpen = /\$\$([a-zA-Z\d]+)((?:\+[a-zA-Z\d]+)*)\$/g;
        const matches: RegExpExecArray[] = [];
        let match: RegExpExecArray | null;

        // String.prototype.matchAll not used because some browser and test dont support
        while ((match = expRegOpen.exec(input)) !== null) {
            matches.push(match);
        }

        return matches;
    }

    // Use an Array and not a Set because some browser and test dont support.
    function addClassToSet (classSet: string[], tagInfo: TagInfo | undefined): void {
        const classes = tagInfo?.class;
        if (!Array.isArray(classes)) return;

        for (const cls of classes as string[]) {
            const classStr = (cls || '').trim();
            if (classStr && !classSet.includes(classStr)) {
                classSet.push(classStr);
            }
        }
    }
}
