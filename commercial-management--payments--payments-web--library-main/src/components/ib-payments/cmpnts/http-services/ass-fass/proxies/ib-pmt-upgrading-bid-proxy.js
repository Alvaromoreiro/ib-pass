import { lastValueFrom } from "rxjs";

(function () {
    'use strict';

    angular
        .module('ib-pmt-services-http-module')
        .factory('PmtUpgradingBidProxy', PmtUpgradingBidProxy);

    PmtUpgradingBidProxy.$inject = ['PmtRxProxy', 'localStorageService', 'CommonsCookiesService', 'CommonsLoginConstants'];

    function PmtUpgradingBidProxy (PmtRxProxy, localStorageService) {
        const service = {
            upgradingBidOrder: upgradingBidOrder,
            getUpgradingBidInfoBy3dsPay: getUpgradingBidInfoBy3dsPay
        };

        return service;

        ////////////////
        /**
         * Calls HTTP  method on the issue order rest service with the request data with the payment information
         * @param {string} url - the http url of issue order rest service
         * @param {Object} requestData - the request form data to call the webservice with the orderId, orderItemsId, paymentId and paymentMethod
         * @param {boolean} isRecall - param to determinate the kind of the call
         * @returns {Object.<Promise>} - returns the http promise. When the promise resolves, it returns an object with the response data and the response status.
         *  When the promise rejects, it returns an object with the response error data and the response error code.
         */
        function upgradingBidOrder (url, requestData, isRecall) {
            const request = isRecall && isRecall !== 'FULL_PAY_AVIOS' && isRecall !== 'COUPONS'
                ? PmtRxProxy.put(url, requestData)
                : PmtRxProxy.post(url, requestData);
            
            return lastValueFrom(request).catch(handleError);
        }

        /**
         * Calls HTTP GET method to the obtain the issue info for a booking purchase
         * @param {string} url - the http url of the issue info rest service
         * @returns {Object.<Promise>} - returns the http promise. When the promise resolves, it returns an object with the response data and the response status.
         *  When the promise rejects, it returns an object with the response error data and the response error code.
         */
        function getUpgradingBidInfoBy3dsPay (url) {
            return lastValueFrom(PmtRxProxy.get(url)).catch(handleError);
        }

        function handleError(response) {
            localStorageService.remove('redirectionPaymentCallback');
            return Promise.reject({
                data: response?.error,
                errorCode: response?.status
            });
        }
    }
})();
