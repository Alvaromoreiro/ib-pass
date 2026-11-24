import { lastValueFrom } from "rxjs";

(function () {
    'use strict';

    angular
        .module('ib-pmt-services-http-module')
        .factory('PmtOnHoldOrderProxy', PmtOnHoldOrderProxy);

    PmtOnHoldOrderProxy.$inject = ['PmtRxProxy'];
    function PmtOnHoldOrderProxy(PmtRxProxy) {
        var service = {
            onHoldOrder: onHoldOrder,
            onHoldInfoBy3dsPay: onHoldInfoBy3dsPay
        };

        return service;

        ////////////////
        /**
         * Calls HTTP POST method on the on hold order rest service with the request data with the payment information
         * @param {string} url - the http url of on hold order rest service
         * @param {Object} requestData - the request form data to call the webservice with the orderId, orderItemsId, paymentId and paymentMethod
         * @returns {Object.<Promise>} - returns the http promise. When the promise resolves, it returns an object with the response data and the response status.
         *  When the promise rejects, it returns an object with the response error data and the response error code.
         */
        function onHoldOrder(url, requestData, isRecall) {
             const request = isRecall 
                ? PmtRxProxy.put(url, requestData)
                : PmtRxProxy.post(url, requestData);
            return lastValueFrom(request).catch(handleError);
        }

        /**
         * Calls HTTP GET method to the obtain the onHold info for a on-hold purchase
         * @param {string} url - the http url of the onHold info rest service
         * @returns {Object.<Promise>} - returns the http promise. When the promise resolves, it returns an object with the response data and the response status.
         *  When the promise rejects, it returns an object with the response error data and the response error code.
         */
        function onHoldInfoBy3dsPay(url) {
            return lastValueFrom(PmtRxProxy.get(url)).catch(handleError);
        }

        function handleError(response) {
            return Promise.reject({
                data: response?.error,
                errorCode: response?.status
            });
        }
    }
})();