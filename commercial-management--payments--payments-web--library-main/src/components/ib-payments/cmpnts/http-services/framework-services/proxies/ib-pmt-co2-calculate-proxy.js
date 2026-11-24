import { lastValueFrom } from "rxjs";

(function () {
    'use strict';

    angular
        .module('ib-pmt-services-http-module')
        .factory('PmtCo2CalcProxy', PmtCo2CalcProxy);

    PmtCo2CalcProxy.$inject = ['PmtRxProxy'];
    function PmtCo2CalcProxy(PmtRxProxy) {
        var service = {
            getCo2Calc: getCo2Calc
        };

        return service;

        ////////////////
        /**
         * Calls the http POST method for CO2 price calculations information (price, description, total,  etc) depending on the trip.
         * @param {string} url - the http url of get CO2 price calculations by CO2 rest service
         * @param {Object} requestData - the CO2 rest service request info
         * @returns {Object.<Promise>} - returns the http promise. When the promise resolves, it returns an object with the response data and the response status.
         *  When the promise rejects, it returns an object with the response error data and the response error code.
         */
        function getCo2Calc(url, requestData) {
            return lastValueFrom(PmtRxProxy.post(url, requestData))
            .then(response => response.data)
            .catch(response => Promise.reject({    
                data: response?.error,
                errorCode: response?.status
            }));
        }
    }
})();