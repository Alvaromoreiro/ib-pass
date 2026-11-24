import { lastValueFrom } from "rxjs";

(function () {
    'use strict';

    angular
        .module('ib-pmt-services-http-module')
        .factory('CheckoutPayPalInfoProxy', CheckoutPayPalInfoProxy);

    CheckoutPayPalInfoProxy.$inject = ['PmtRxProxy'];
    function CheckoutPayPalInfoProxy(PmtRxProxy) {
        var service = {
            getCheckoutInfo: getCheckoutInfo,
            getCheckoutInfoAvios: getCheckoutInfoAvios
        };

        return service;

        ////////////////
        /**
         * Calls HTTP GET method to the obtain paypal checkout info for the purchase
         * @param {string} url - the http url of the get checkout paypal info rest service
         * @returns {Object.<Promise>} - returns the http promise. When the promise resolves, it returns an object with the response data and the response status.
         *  When the promise rejects, it returns an object with the response error data and the response error code.
         */
        function getCheckoutInfo(url) {
            return lastValueFrom(PmtRxProxy.get(url)).catch(handleError);
        }

        function getCheckoutInfoAvios(url, requestData) {
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