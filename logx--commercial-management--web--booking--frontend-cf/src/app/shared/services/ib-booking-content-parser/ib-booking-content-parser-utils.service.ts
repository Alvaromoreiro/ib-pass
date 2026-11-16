import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class IbBookingContentParserUtilsService {

    constructor () { }

    public isExternalLink = (attributes) => {
        return attributes.href && attributes.href.textContent.search(/^#/) === -1 ? true : false;
    };

    public isInternalLink = (attributes) => {
        return attributes.href && attributes.href.textContent !== '#' && attributes.href.textContent.search(/^#/) !== -1 ? true : false;
    };

    public isModalLink = (attributes) => {
        return !attributes.href;
    };

    public isModalWithHref = (attributes) => {
        return attributes.href.textContent === 'javascript:void(0)';
    };

    public searchModalContent = (info, contentId) => {
        let returnedInfo = {}, infoIndex = 0, foundedInfo = false;
        if (info && contentId) {
            while (!foundedInfo && infoIndex < info.length) {
                if (contentId === info[infoIndex].code) {
                    returnedInfo = info[infoIndex];
                    foundedInfo = true;
                }
                infoIndex++;
            }
        } else if (info) {
            returnedInfo = info[0];
        }
        return returnedInfo;
        
    };
}
