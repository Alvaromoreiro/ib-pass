(function () {
    'use strict';

    angular
        .module('ib-pmt-gift-cards-confirmation-module')
        .factory('GiftCardsConfirmationService', GiftCardsConfirmationService);

        GiftCardsConfirmationService.$inject = ['$rootScope', '$q','$cookies', 'localStorageService'];
    function GiftCardsConfirmationService($rootScope, $q, $cookies, localStorageService) {

        return {
            isUserLogged: isUserLogged,
            updateFollowCode: updateFollowCode
        }

        function updateFollowCode (quadrigam) {
            const codigoSeguimientoOld = localStorageService.get('TrackingCode');
            const codigoSeguimientoSplit = codigoSeguimientoOld.split('/')[2] = quadrigam;
            const codigoSeguimientoNew = codigoSeguimientoOld.split('/')[0] + '/' + codigoSeguimientoOld.split('/')[1] + '/' + codigoSeguimientoSplit;

            return codigoSeguimientoNew;
        }

         /**
         * check if the current user is logged or not
         * @return true if the user is logged in the app
         */
        function isUserLogged  () {
            if (!localStorageService.get('userLogged')) {
                $cookies.remove('userLogged');
            }
            else {
                $cookies.put('userLogged', 'true');
            }
            return localStorageService.get('userLogged');
        }
    }
})();