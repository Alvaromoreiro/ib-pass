import { lastValueFrom } from "rxjs";

(function () {
    'use strict';

    angular
        .module('ib-pmt-services-http-module')
        .factory('PmtCo2InfoProxy', PmtCo2InfoProxy);

    PmtCo2InfoProxy.$inject = ['PmtRxProxy'];
    function PmtCo2InfoProxy(PmtRxProxy) {
        var service = {
            getCo2Info: getCo2Info
        };

        return service;

        ////////////////
        /**
         * Calls the http GET method for co2 mark information (description, total,  etc) depending on the trip.
         * @param {string} url - the http url of get commercial information by market rest service
         * @param {Object} requestData - the co2 rest service request info
         * @returns {Object.<Promise>} - returns the http promise. When the promise resolves, it returns an object with the response data and the response status.
         *  When the promise rejects, it returns an object with the response error data and the response error code.
         */
        function getCo2Info(url, requestData) {
            return lastValueFrom(PmtRxProxy.post(url, requestData))
            .then(response => response.data)
            .catch(response => Promise.reject({    
                data: response?.error,
                errorCode: response?.status
            }));
        }
    }
})();