import { lastValueFrom } from "rxjs";

(function () {
    'use strict';

    angular
        .module('ib-pmt-services-http-module')
        .factory('PmtCountriesListProxy', PmtCountriesListProxy);

    PmtCountriesListProxy.$inject = ['PmtRxProxy'];
    function PmtCountriesListProxy(PmtRxProxy) {
        var service = {
            getCountriesList: getCountriesList,
        };

        return service;

        ////////////////
        /**
         * Calls HTTP GET method on the get Countries list service
         * @param {string} url - the http url of the get Countries list rest service
         * @returns {Object.<Promise>} - returns the http promise. When the promise resolves, it returns an object with the response data and the response status.
         *  When the promise rejects, it returns an object with the response error data and the response error code.
         */
        function getCountriesList(url) {
            return lastValueFrom(PmtRxProxy.get(url)).catch(response => Promise.reject({    
                data: response?.error,
                errorCode: response?.status
            }));
        }
    }
})();