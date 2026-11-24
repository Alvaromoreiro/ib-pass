import { lastValueFrom } from "rxjs";

(function () {
    'use strict';

    angular
        .module('ib-pmt-services-http-module')
        .factory('PmtFullAviosProxy', PmtFullAviosProxy);

    PmtFullAviosProxy.$inject = ['PmtRxProxy'];
    function PmtFullAviosProxy(PmtRxProxy) {
        var service = {
            getFullAvios: getFullAvios
        };

        return service;

        ////////////////
        /**
         * Calls HTTP POST method to Validates if cash and avios option selected means a complete avios payment. If true, a boolean true flag is stored en cache, else it will store a boolean false flag
         * @param {string} url - the http url of the post full avios rest service
         * @returns {Object.<Promise>} - returns the http promise. When the promise resolves, it returns an object with the response data and the response status.
         *  When the promise rejects, it returns an object with the response error data and the response error code.
         */
        function getFullAvios(url, requestData) {
            return lastValueFrom(PmtRxProxy.post(url, requestData)).catch(response => Promise.reject({    
                data: response?.error,
                errorCode: response?.status
            }));
        }
    }
})();