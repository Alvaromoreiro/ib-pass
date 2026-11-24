(function () {
    'use strict';

    angular
        .module('ib-pmt-subscription-models-confirmation-module')
        .factory('SubscriptionModelsConfirmationService', SubscriptionModelsConfirmationService);

    SubscriptionModelsConfirmationService.$inject = ['$rootScope', '$q','$cookies', 'localStorageService'];
    function SubscriptionModelsConfirmationService ($rootScope, $q, $cookies, localStorageService) {

        return {
            isUserLogged: isUserLogged
        };
        /**
         * check if the current user is logged or not
         * @return true if the user is logged in the app
         */
        function isUserLogged  () {
            if (!localStorageService.get('userLogged')) {
                $cookies.remove('userLogged');
            } else {
                $cookies.put('userLogged', 'true');
            }
            return localStorageService.get('userLogged');
        }
    }
})();