import { lastValueFrom } from "rxjs";

(function () {
    'use strict';

    angular
        .module('ib-pmt-services-http-module')
        .factory('PmtSummaryInfoQuotaProxy', PmtSummaryInfoQuotaProxy);

    PmtSummaryInfoQuotaProxy.$inject = ['PmtRxProxy'];
    function PmtSummaryInfoQuotaProxy(PmtRxProxy) {
        var service = {
            getSummaryInfoQuota: getSummaryInfoQuota,
            getIberiaPayQuotaOptions: getIberiaPayQuotaOptions
        };

        return service;

        ////////////////
        /**
         * Calls HTTP GET method to the obtain the available payment donations for a booking purchase
         * @param {string} url - the http url of the get payment donaations rest service
         * @returns {Object.<Promise>} - returns the http promise. When the promise resolves, it returns an object with the response data and the response status.
         *  When the promise rejects, it returns an object with the response error data and the response error code.
         */
        function getSummaryInfoQuota(url, requestData) {
            return lastValueFrom(PmtRxProxy.post(url, requestData)).catch(handleError);
        }
        function getIberiaPayQuotaOptions(url, requestData) {
            return lastValueFrom(PmtRxProxy.post(url, requestData)).catch(handleError);
        }
        function handleError(response) {
            return Promise.reject({
                data: response?.error,
                errorCode: response?.status
            });
        }
    }
})();