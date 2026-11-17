(function () {
    'use strict';

    angular
        .module('ib-content-parser-module')
        .directive('ibLinkContentParser', ibLinkContentParser);

    ibLinkContentParser.$inject = ['$document', 'ContentParserUtilsService', '$anchorScroll', 'localStorageService', 'ModalService'];
    function ibLinkContentParser ($document, ContentParserUtilsService, $anchorScroll, localStorageService, ModalService) {
        return {
            restrict: 'A',
            link: link
        };
        function link ($scope, $element, $attrs) {
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
                    const typeGdpr = localStorageService.get('userLogged') ? 'IBPRIVACIBP' : 'IBPRIVAC';
                    if ($attrs.contentInfo === 'gdprInfo') $attrs.contentInfo = `${$attrs.contentInfo}${typeGdpr}`;
                    $attrs['template'] = 'ib-generic-external-modal.html';
                    const dataGdpr = localStorageService.get($attrs.contentInfo).modals;
                    if(!$attrs.contentInfo === 'gdprInfoIBPRIVAC'){
                        ModalService.showGenericModal({ info: ContentParserUtilsService.searchModalContent(dataGdpr, $attrs.contentid) }, false, 'ib-generic-external-modal');
                    }

                }
            });
        }
    }
})();
