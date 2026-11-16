import { Pipe, PipeTransform } from '@angular/core';
interface DefaultTagInfo {
    tag: string;
    class: string;
    href?: string;
    target?: string;
    title?: string;
}
interface DefaultTags {
    bold?: DefaultTagInfo;
    under?: DefaultTagInfo;
    link?: DefaultTagInfo;
}
@Pipe({
    name: 'literalFormatter'
})
export class LiteralFormatterPipe implements PipeTransform {
    constructor () {

    }

    transform ( input: string, tagsInfo = {} as DefaultTags ): string {
        let prop: any, tagInfo:any;
        let matchStr: any, before: any, after: any, key: any, otherKeys: any, tagOpen: any;
        let tagClose: any, properties: any, property: any, value: any, classSet: any;
        let tagInfoNew: any, match: any;
        const defaultTagsInfo: DefaultTags = {
            bold: {
                tag: 'span',
                class: 'text-bold'
            },
            under: {
                tag: 'span',
                class: 'text-underline'
            },
            link: {
                tag: 'a',
                class: 'link link-underline',
                title: '',
                href: '',
                target: '_blank'
            }
        };

        if (!input) {
            return '';
        }

        if (!tagsInfo) {
            tagsInfo = {} as DefaultTags;
        }
        tagsInfo = {...defaultTagsInfo, ...tagsInfo};

        for (prop in tagsInfo) {
            tagInfo = tagsInfo[prop];

            if (tagInfo.class && !Array.isArray(tagInfo.class)) {
                tagInfo.class = tagInfo.class.split(' ');
            }
        }
        const getMatches = ( input ) => {
            let match;
            const expRegOpen = /\$\$([a-zA-Z\d]+)((?:\+[a-zA-Z\d]+)*)\$/g;
            const matches = [];

            // String.prototype.matchAll not used because some browser and test dont support
            while ( ( match = expRegOpen.exec( input ) ) !== null ) {
                matches.push( match );
            }

            return matches;
        };

        // Use a Array and not a Set because some browser and test dont support.
        const addClassToSet = ( classSet, tagInfo ) => {
            let classStr;
            const trimExpReg = /^\s+|\s+$/g;

            if ( tagInfo.class && Array.isArray( tagInfo.class ) ) {

                for ( let i in tagInfo.class ) {
                    classStr = ( tagInfo.class[ i ] || '' ).replace( trimExpReg, '' );
                    if ( classStr && classSet.indexOf( classStr ) === -1 ) {
                        classSet.push( classStr );
                    }
                }
            }

        };

        const matches = getMatches(input);

        for (let i = matches.length - 1; i >= 0; i--) {
            match = matches[i];
            matchStr = match[0];
            before = input.substring(0, match.index);
            after = input.substring(match.index + matchStr.length);

            if (after.indexOf('$$') !== -1) {

                key = match[1];
                otherKeys = match[2] || null;
                if (otherKeys) {
                    otherKeys = otherKeys.substring(1).split('+');
                }

                tagOpen = '';
                tagClose = '';

                if (tagsInfo && tagsInfo[key] && tagsInfo[key].tag) {
                    tagInfoNew = tagsInfo[key];
                    tagClose = '</' + tagInfoNew.tag + '>';

                    classSet = [];
                    addClassToSet(classSet, tagInfoNew);
                    if (otherKeys) {
                        for (let j in otherKeys) {
                            addClassToSet(classSet, tagsInfo[otherKeys[j]]);
                        }
                    }

                    tagOpen = '<' + tagInfoNew.tag;
                    properties = Object.keys(tagInfoNew);
                    for (let j in properties) {
                        property = properties[j];
                        if (property.toLowerCase() !== 'tag' && property.toLowerCase() !== 'class') {
                            value = tagsInfo[key][property];

                            tagOpen = tagOpen + ' ' + property;
                            if (value !== '') {
                                tagOpen = tagOpen + '="' + value + '"';
                            }
                        }
                    }

                    if (classSet.length !== 0) {
                        tagOpen = tagOpen + ' class="' + classSet.join(' ') + '"';
                    }

                    tagOpen = tagOpen + '>';
                }

                after = after.replace('$$', tagClose);
                input = before + tagOpen + after;
            }

            return input;
        }
        return input;
    }
}
