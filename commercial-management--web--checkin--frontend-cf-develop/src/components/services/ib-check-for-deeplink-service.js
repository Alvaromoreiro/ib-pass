(function () {
    'use strict';
    //Service to check if booking information has deep link information showing it in a modal
    angular
        .module('ib-checkin-services-module')
        .factory('CheckForDeepLink', CheckForDeepLink);

    CheckForDeepLink.$inject = ['CheckinRouterConstants', '$q', '$uibModal'];
    function CheckForDeepLink (CheckinRouterConstants, $q, $uibModal) {
        const service = {
            checkDeepLink: checkDeepLink
        };

        return service;

        ////////////////

        function checkDeepLink(deepLinkData) {
            const isValidDeepLink = isDeepLinkValid(deepLinkData);

            if (!isValidDeepLink) {
                return $q.when();
            }

            return openDeepLinkModal(deepLinkData);
        }

        function isDeepLinkValid (deepLinkData) {
            return deepLinkData?.externalCompany &&
                deepLinkData?.externalMobileUrl &&
                deepLinkData?.externalUrl &&
                deepLinkData?.message;
        }

        function openDeepLinkModal(deepLinkData) {
            const modalInstance = $uibModal.open({
                controller: 'IbcoseModalDeepController',
                controllerAs: 'modalCtrl',
                templateUrl: `${CheckinRouterConstants.templatesRoute}ibcose.modal-mensaje-deep.html`,
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                object: () => deepLinkData
                }
            });

            return modalInstance.result.catch(() => {}).then(() => {});
        }
    }
})();