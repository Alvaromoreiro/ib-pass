import { lastValueFrom } from "rxjs";

(function () {
    'use strict';

    angular
        .module('ib-pmt-utils-module')
        .factory('pmtSummaryGiftCardsProxy', pmtSummaryGiftCardsProxy);

        pmtSummaryGiftCardsProxy.$inject = ['PmtRxProxy'];
    function pmtSummaryGiftCardsProxy(PmtRxProxy) {
        var service = {
            getSummary: getSummary,
        };

        return service;

        ////////////////
        /**
         * Calls HTTP GET method from wcs rest service
         * @param {string} url - the http url of the rest service
         * @returns {Object.<Promise>} - returns the http promise. When the promise resolves, it returns an object with the response data and the response status.
         *  When the promise rejects, it returns an object with the response error data and the response error code.
         */
        function getSummary(url) {
            return lastValueFrom(PmtRxProxy.get(url)).catch(response => Promise.reject({    
                data: response?.error,
                errorCode: response?.status
            }));
        }
    }
})();
