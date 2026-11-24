(function () {
    'use strict';

    angular.module('ib-pmt-utils-module')
        .factory('pmtConditionsGiftCardsService', pmtConditionsGiftCardsService);

    pmtConditionsGiftCardsService.$inject = ['$q', '$window', 'CommonsHttpUtilsErrorService', '$rootScope', 'DatalayerUtilsService', 'pmtConditionsGiftCardsProxy', 'PmtConstants'];
    function pmtConditionsGiftCardsService($q, $window, CommonsHttpUtilsErrorService, $rootScope, DatalayerUtilsService, pmtConditionsGiftCardsProxy, PmtConstants) {
        
        var service = {
            getTermnsAndConditions: getTermnsAndConditions
        };

        return service;
        ////////////////
        /**
         * Gets the phone information by type (code) from the service and returns it. If there was and error in the http call, 
         * this method treats these http error code and returns the object to show an error in the view.
         * @returns {Object.<Promise>} - returns a promise. When the promise resolves, it returns received data.
         *  When the promise rejects, it returns an object with the error data to show in the view
         */
        function getTermnsAndConditions() {
            var defer, endpoint, numberAttemps;
            defer = defer || $q.defer();
            endpoint = $window.location.origin + PmtConstants.WEB_CENTER_REDIRECT.TERMS_CONDITIONS_GIFT_CARDS + '&market=' + $rootScope.appMarket + '&locale=' + $rootScope.appLang;
            pmtConditionsGiftCardsProxy.getConditions(endpoint).then(getTermnsAndConditionsSucces, getTermnsAndConditionsError);
            return defer.promise;

            function getTermnsAndConditionsSucces(data) {
                defer.resolve(data);
                defer = null;
                numberAttemps = 0;
            }

            function getTermnsAndConditionsError(error) {
                DatalayerUtilsService.sendDatalayerErrorEvent(error);
                switch (error.errorCode) {
                    case 408: CommonsHttpUtilsErrorService.returnProcessedError(CommonsHttpUtilsErrorService.timeOutError(numberAttemps, getTermnsAndConditionsCallback, error)); break;
                    case 401: CommonsHttpUtilsErrorService.returnProcessedError(CommonsHttpUtilsErrorService.unauthorizedError(numberAttemps, getTermnsAndConditionsCallback, error)); break;
                    default: CommonsHttpUtilsErrorService.returnProcessedError(CommonsHttpUtilsErrorService.processGeneralError(error));
                }

                function getTermnsAndConditionsCallback() {
                    getTermnsAndConditions(code);
                    numberAttemps++;
                }
            }
        };
    }
})();