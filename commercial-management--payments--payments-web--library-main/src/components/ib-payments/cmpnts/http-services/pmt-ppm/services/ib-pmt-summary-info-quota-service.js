(function () {
    'use strict';

    angular
        .module('ib-pmt-services-http-module')
        .service('PmtSummaryInfoQuotaService', PmtSummaryInfoQuotaService);

    PmtSummaryInfoQuotaService.$inject = ['$q', 'PmtSummaryInfoQuotaProxy', 'PmtConstants'];
    function PmtSummaryInfoQuotaService($q, PmtSummaryInfoQuotaProxy, PmtConstants) {
        var self = this;
        self.getSummaryInfoQuota = getSummaryInfoQuota;
        self.getIberiaPayQuotaOptions = getIberiaPayQuotaOptions;
        self.defer;
        self.numberAttemps = 0;

        ////////////////
        /**
         * Get quota summary info .
         * @param {Object} requestData - object with the request to get information about quota selected 
         * @returns {Object.<Promise>} - returns a promise. When the promise resolves, it returns received data.
         *  When the promise rejects, it returns an object with the error data to show in the view
         */
        function getSummaryInfoQuota(serviceURI, requestData) {
            var endpoint = serviceURI + PmtConstants.ENDPOINTS.DEFAULT.summaryInfoQuotaURI;
            self.defer = self.defer || $q.defer();
            PmtSummaryInfoQuotaProxy.getSummaryInfoQuota(endpoint, requestData)
                .then(getSummaryInfoQuotaSuccess, returnProcessedError);

            return self.defer.promise;

            function getSummaryInfoQuotaSuccess(infoQuota) {
                self.defer.resolve(infoQuota.data);
                self.defer = null;
            };
        };
        /**
         * Get available grace months .
         * @param {Object} requestData - object with the request to get information about available grace months
         * @returns {Object.<Promise>} - returns a promise. When the promise resolves, it returns received data.
         *  When the promise rejects, it returns an object with the error data to show in the view
         */
        function getIberiaPayQuotaOptions(serviceURI, requestData) {
            var endpoint = serviceURI + PmtConstants.ENDPOINTS.DEFAULT.iberiaPayQuotaOptionsURI;
            self.defer = self.defer || $q.defer();
            PmtSummaryInfoQuotaProxy.getIberiaPayQuotaOptions(endpoint, requestData)
                .then(getIberiaPayQuotaOptionsSuccess, returnProcessedError);

            return self.defer.promise;

            function getIberiaPayQuotaOptionsSuccess(infoQuota) {
                self.defer.resolve(infoQuota.data);
                self.defer = null;
            };
        };

        /**
         * If there is a response error object as input, the function rejects the service promise and initialize service attributes
         * @param {Object} responseError - the processed http response error. It could be undefined or null
         */
        function returnProcessedError(responseError) {
            if (responseError) {
                self.defer.reject(responseError);
                self.defer = null;
                self.numberAttemps = 0;
            }
        }
    }
})();