import { lastValueFrom } from "rxjs";

(function () {
    'use strict';

    angular
        .module('ib-pmt-services-http-module')
        .factory('CheckVoucherCodeProxy', CheckVoucherCodeProxy);

    CheckVoucherCodeProxy.$inject = ['PmtRxProxy'];
    function CheckVoucherCodeProxy(PmtRxProxy) {
        var service = {
            checkVoucherCode: checkVoucherCode,
            deleteVoucherCode: deleteVoucherCode
        };

        return service;

        ////////////////
        /**
         * Calls HTTP GET method to check voucher code rest service
         * @param {string} url - the http url of check voucher code rest service
         * @returns {Object.<Promise>} - returns the http promise. When the promise resolves, it returns an object with the response data and the response status.
         *  When the promise rejects, it returns an object with the response error data and the response error code.
         */
        function checkVoucherCode(url) {
            return lastValueFrom(PmtRxProxy.get(url)).catch(handleError);
        }

        ////////////////
        /**
         * Calls HTTP DELETE method to delete voucher code rest service
         * @param {string} url - the http url of check voucher code rest service
         * @returns {Object.<Promise>} - returns the http promise. When the promise resolves, it returns an object with the response data and the response status.
         *  When the promise rejects, it returns an object with the response error data and the response error code.
         */
        function deleteVoucherCode(url) {
            return lastValueFrom(PmtRxProxy.delete(url)).catch(handleError);
        }

        function handleError(response) {
            return Promise.reject({
                data: response?.error,
                errorCode: response?.status
            });
        }
    }
})();