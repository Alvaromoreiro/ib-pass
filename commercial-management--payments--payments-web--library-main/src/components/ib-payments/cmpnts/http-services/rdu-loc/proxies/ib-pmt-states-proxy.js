import { lastValueFrom } from "rxjs";

(function () {
    'use strict';

    angular
        .module('ib-pmt-services-http-module')
        .factory('PmtStatesListProxy', PmtStatesListProxy);

    PmtStatesListProxy.$inject = ['PmtRxProxy'];
    function PmtStatesListProxy(PmtRxProxy) {
        var service = {
            getStatesList: getStatesList,
        };

        return service;

        ////////////////
        /**
         * Calls HTTP GET method on the get states list service
         * @param {string} url - the http url of the get states list rest service
         * @returns {Object.<Promise>} - returns the http promise. When the promise resolves, it returns an object with the response data and the response status.
         *  When the promise rejects, it returns an object with the response error data and the response error code.
         */
        function getStatesList(url) {
            return lastValueFrom(PmtRxProxy.get(url)).catch(response => Promise.reject({    
                data: response?.error,
                errorCode: response?.status
            }));
        }
    }
})();