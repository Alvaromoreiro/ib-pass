(function () {
    'use strict';

    angular
        .module('ib-content-parser-module')
        .service('ContentParserUtilsService', ContentParserUtilsService);

    ContentParserUtilsService.$inject = ['$sce'];
    function ContentParserUtilsService($sce) {

        var vm = this;
        vm.isExternalLink = isExternalLink;
        vm.isInternalLink = isInternalLink;
        vm.isModalLink = isModalLink;
        vm.searchModalContent = searchModalContent;

        ////////////////
        function isExternalLink(attributes) {
            return attributes.href && attributes.href.search(/^#/) === -1;
        };

        function isInternalLink(attributes) {
            return attributes.href && attributes.href !== '#' && attributes.href.search(/^#/) !== -1;
        };

        function isModalLink(attributes) {
            return !attributes.href;
        }

        function searchModalContent(info, contentId) {
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
        }


    }
})();