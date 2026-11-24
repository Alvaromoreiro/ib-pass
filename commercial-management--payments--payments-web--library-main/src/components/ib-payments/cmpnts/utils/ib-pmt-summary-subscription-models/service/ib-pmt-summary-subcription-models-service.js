(function () {
    'use strict';

    angular.module('ib-pmt-utils-module')
        .factory('pmtSummarySubscriptionModelsService', pmtSummarySubscriptionModelsService);

    pmtSummarySubscriptionModelsService.$inject = ['$q', '$window', 'CommonsHttpUtilsErrorService', '$rootScope', 'DatalayerUtilsService', 'pmtSummarySubscriptionModelsProxy', 'PmtConstants'];
    function pmtSummarySubscriptionModelsService ($q, $window, CommonsHttpUtilsErrorService, $rootScope, DatalayerUtilsService, pmtSummarySubscriptionModelsProxy, PmtConstants) {

        const service = {
            getSummary: getSummary
        };

        return service;
        ////////////////
        /**
         * Gets the phone information by type (code) from the service and returns it. If there was and error in the http call,
         * this method treats these http error code and returns the object to show an error in the view.
         * @returns {Object.<Promise>} - returns a promise. When the promise resolves, it returns received data.
         *  When the promise rejects, it returns an object with the error data to show in the view
         */
        function getSummary (flowId) {

            let defer, endpoint, numberAttemps;
            defer = defer || $q.defer();
            endpoint = PmtConstants.ENDPOINTS.DEFAULT.getSubscriptionModelsSummaryURI;
            endpoint = endpoint.replace('{flowId}', flowId);
            pmtSummarySubscriptionModelsProxy.getSummary(endpoint).then(getSummarySucces, getSummaryError);
            return defer.promise;

            function getSummarySucces (data) {
                defer.resolve(data);
                defer = null;
                numberAttemps = 0;
            }

            function getSummaryError (error) {
                DatalayerUtilsService.sendDatalayerErrorEvent(error);
                switch (error.errorCode) {
                        case 408: CommonsHttpUtilsErrorService.returnProcessedError(CommonsHttpUtilsErrorService.timeOutError(numberAttemps, getSummaryCallback, error)); break;
                        case 401: CommonsHttpUtilsErrorService.returnProcessedError(CommonsHttpUtilsErrorService.unauthorizedError(numberAttemps, getSummaryCallback, error)); break;
                        default: CommonsHttpUtilsErrorService.returnProcessedError(CommonsHttpUtilsErrorService.processGeneralError(error));
                }

                function getSummaryCallback () {
                    getSummary(flowId);
                    numberAttemps++;
                }
            }
        }
    }
})();