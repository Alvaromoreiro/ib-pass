import * as angular from 'angular';

@Service(
    'ib-content-parser-module',
    ['$sce'],
    []
)
export class ContentParserUtilsService {
    constructor (
        private $sce: ng.ISCEService) {}

    ////////////////
    /**
     * 
     */

    isExternalLink = (attributes)  => {
        return attributes.href && attributes.href.search(/^#/) === -1;
    };

    isInternalLink = (attributes)  => {
        return attributes.href && attributes.href !== '#' && attributes.href.search(/^#/) !== -1;
    };

    isModalLink = (attributes) => {
        return !attributes.href;
    };

    searchModalContent = (info, contentId) => {
        var returnedInfo = {}, infoIndex = 0, foundedInfo = false;
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