(function () {
    'use strict';

    angular
        .module('ib-content-parser-module')
        .directive('ibLinkContentParser', ibLinkContentParser);

    ibLinkContentParser.$inject = ['$document', 'ContentParserUtilsService', '$anchorScroll', 'localStorageService', 'MmBModalService'];
    function ibLinkContentParser($document, ContentParserUtilsService, $anchorScroll, localStorageService, ModalService) {
        return {
            restrict: 'A',
            link: link
        };
        function link($scope, $element, $attrs) {
            if (ContentParserUtilsService.isExternalLink($attrs)) {
                angular.element($element).attr('target', '_blank');
            } else if (ContentParserUtilsService.isModalLink($attrs)) {
                angular.element($element).attr('href', 'javascript:void(0)');
            }
            angular.element($element).bind('click', function (event) {
                if (!ContentParserUtilsService.isExternalLink($attrs) && ContentParserUtilsService.isInternalLink($attrs)) {
                    event.preventDefault();
                    $anchorScroll($attrs.href.split('#')[1]);
                } else if (ContentParserUtilsService.isModalLink($attrs)) {
                    ModalService.showGenericModal(false, 'ib-generic-external-modal.html', { info: ContentParserUtilsService.searchModalContent(localStorageService.get($attrs.contentInfo).modals, $attrs.contentid) });
                }
            });
        }
    }
})();