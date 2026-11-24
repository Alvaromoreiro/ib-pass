import { lastValueFrom } from "rxjs";

(function () {
    'use strict';

    angular
        .module('ib-pmt-services-http-module')
        .factory('PmtDonationsProxy', PmtDonationsProxy);

    PmtDonationsProxy.$inject = ['PmtRxProxy'];
    function PmtDonationsProxy(PmtRxProxy) {
        var service = {
            getAvailableDonations: getAvailableDonations
        };

        return service;

        ////////////////
        /**
         * Calls HTTP GET method to the obtain the available payment donations for a booking purchase
         * @param {string} url - the http url of the get payment donaations rest service
         * @returns {Object.<Promise>} - returns the http promise. When the promise resolves, it returns an object with the response data and the response status.
         *  When the promise rejects, it returns an object with the response error data and the response error code.
         */
        function getAvailableDonations(url) {
            return lastValueFrom(PmtRxProxy.get(url)).catch(response => Promise.reject({    
                data: response?.error,
                errorCode: response?.status
            }));
        }
    }
})();