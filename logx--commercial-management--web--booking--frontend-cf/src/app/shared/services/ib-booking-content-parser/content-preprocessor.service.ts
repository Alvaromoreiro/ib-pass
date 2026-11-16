import { Injectable, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { downgradeToAJSService } from 'ib-web-commons/utils';


interface TextOrLink {
    type: 'text' | 'link';
    value: string;
    attrs?: { [key: string]: string };
}

@Injectable({
    providedIn: 'root'
})
export class ContentPreprocessorService {

    constructor (
        private sanitizer: DomSanitizer
    ) { }

    public processContent = (prevContent, info) => {
        let proccesedContent = this.processLinks(prevContent, info);
        let trustedProccesedContent = this.sanitizer.sanitize(SecurityContext.HTML, this.sanitizer.bypassSecurityTrustHtml(proccesedContent));
        return trustedProccesedContent;
    };

    private processLinks = (prevContent, info) => {
        let content = prevContent.replace(/href="#"/g, '');
        content = content.replace(/target="_blank"/g, '');
        // TODO fix selectors here and in directive
        return content.replace(/<a\b/g, '<a ib-booking-link-content-parser ' + (info ? 'data-content-info="' + info + '"' : ''));
    };

    parseTextWithLinks (text: string): TextOrLink[] {
        const regex = /<a([^>]*?)>(.*?)<\/a>/gi;
        let result: TextOrLink[] = [];
        let lastIndex = 0;
        let match: RegExpExecArray | null;
    
        while ((match = regex.exec(text)) !== null) {
            if (match.index > lastIndex) {
                result.push({ type: 'text', value: text.substring(lastIndex, match.index) });
            }
    
            const attrString = match[1];
            const innerText = match[2];
            const attrs: { [key: string]: string } = {};
    
            attrString.replace(/([\w-]+)\s*=\s*"([^"]*)"/g, (_, key, val) => {
                attrs[key] = val;
                return '';
            });
    
            if (!attrs['href']) {
                result.push({ type: 'text', value: innerText });
            } else {
                result.push({ type: 'link', value: innerText, attrs });
            }
            lastIndex = regex.lastIndex;
        }

        if (lastIndex < text.length) {
            result.push({ type: 'text', value: text.substring(lastIndex) });
        }
        return result;
    }
}

downgradeToAJSService('ContentPreprocessorService', ContentPreprocessorService, 'ib-booking-services-module');
