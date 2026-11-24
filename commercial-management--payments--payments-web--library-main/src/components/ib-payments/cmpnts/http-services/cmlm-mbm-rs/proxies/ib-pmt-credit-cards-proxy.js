import { lastValueFrom } from "rxjs";

(function () {
    'use strict';

    angular
        .module('ib-pmt-services-http-module')
        .factory('PmtOnBCreditCardsProxy', PmtOnBCreditCardsProxy);

    PmtOnBCreditCardsProxy.$inject = ['PmtRxProxy'];
    function PmtOnBCreditCardsProxy(PmtRxProxy) {
        var service = {
            getCustomerCreditCardsInfo: getCustomerCreditCardsInfo,
            saveCustomerCreditCard: saveCustomerCreditCard
        };

        return service;

        /**
        * Calls HTTP GET method to save credit card Info with rest service
        * @param {string} uri - the http url of rest service
        * @returns {Object.<Promise>} - returns the http promise. When the promise resolves, it returns an object with the response data and the response status.
        *  When the promise rejects, it returns an object with the response error data and the response error code.
        */
        function getCustomerCreditCardsInfo(uri) {
            return lastValueFrom(PmtRxProxy.get(uri))
                .then(response => response.data)
                .catch(handleError);
        }


        /**
         *  Calls HTTP PUT method to save credit card Info with rest service
         * @param {string} uri the http url of rest service
         * @param {Object} requestData Object with customer credit card information
         * @returns {Object.<Promise>} - returns the http promise. When the promise resolves, it returns an object with the response data and the response status.
         * When the promise rejects, it returns an object with the response error data and the response error code.
         */
        function saveCustomerCreditCard(uri, requestData) {
            return lastValueFrom(PmtRxProxy.post(uri, requestData))
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