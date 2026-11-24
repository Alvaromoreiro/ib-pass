import { lastValueFrom } from "rxjs";

(function () {
    'use strict';

    angular
        .module('ib-pmt-services-http-module')
        .factory('PmtMethodsProxy', PmtMethodsProxy);

    PmtMethodsProxy.$inject = ['PmtRxProxy'];
    function PmtMethodsProxy(PmtRxProxy) {
        var service = {
            getPaymentMethods: getPaymentMethods,
            getPaymentAdditionalFields: getPaymentAdditionalFields,
            updatePaymentAdditionalFields: updatePaymentAdditionalFields,
            updatePaymentsInfo: updatePaymentsInfo
        };

        return service;

        ////////////////
        /**
         * Calls HTTP GET method to the obtain the available payment methods for a booking purchase
         * @param {string} url - the http url of the get payment methods rest service
         * @returns {Object.<Promise>} - returns the http promise. When the promise resolves, it returns an object with the response data and the response status.
         *  When the promise rejects, it returns an object with the response error data and the response error code.
         */
        function getPaymentMethods(url) {
            return lastValueFrom(PmtRxProxy.get(url)).catch(handleError);
        }

        ////////////////
        /**
         * Calls HTTP GET method to the obtain the additional payment fields for a booking purchase
         * @param {string} url - the http url of the get payment additional fields rest service
         * @returns {Object.<Promise>} - returns the http promise. When the promise resolves, it returns an object with the response data and the response status.
         *  When the promise rejects, it returns an object with the response error data and the response error code.
         */
        function getPaymentAdditionalFields(url) {
            return lastValueFrom(PmtRxProxy.get(url)).catch(handleError);
        }

        ////////////////
        /**
         * Calls HTTP POST method to uodate the additional payment fields for a booking purchase
         * @param {string} url - the http url of the get payment additional fields rest service
         * @param {Object} requestData - the request form data to call the webservice with the update Request Body.
         * @returns {Object.<Promise>} - returns the http promise. When the promise resolves, it returns an object with the response data and the response status.
         *  When the promise rejects, it returns an object with the response error data and the response error code.
         */
        function updatePaymentAdditionalFields(url, requestData) {
            return lastValueFrom(PmtRxProxy.post(url, requestData)).catch(handleError);
        }

        ////////////////
        /**
         * Calls HTTP POST method to uodate the additional payment fields for a booking purchase
         * @param {string} url - the http url of the get payment additional fields rest service
         * @param {string} checkinId - the checkinId of the session
         * @param {Object} requestData - the request form data to call the webservice with the update Request Body.
         * @returns {Object.<Promise>} - returns the http promise. When the promise resolves, it returns an object with the response data and the response status.
         *  When the promise rejects, it returns an object with the response error data and the response error code.
         */
        function updatePaymentsInfo(url, checkinId, requestData) {
            return lastValueFrom(
                PmtRxProxy.post(`${url}${checkinId}/ancillaries/pay-and-issue`, requestData)
            )
            .then(response => response.data)
            .catch(handleError);
        }

        function handleError(response) {
            return Promise.reject({
                data: response?.error,
                errorCode: response?.status
            });
        }
    }
})();
