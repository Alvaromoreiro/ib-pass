(function () {
    'use strict';

    angular
        .module('ib-pmt-services-http-module')
        .service('CheckoutPayPalInfoService', CheckoutPayPalInfoService);

    CheckoutPayPalInfoService.$inject = ['$q', 'CheckoutPayPalInfoProxy', 'PmtConstants', 'PmtHttpErrorFilter', 'localStorageService', 'PmtUtilsTransformers'];
    function CheckoutPayPalInfoService($q, CheckoutPayPalInfoProxy, PmtConstants, PmtHttpErrorFilter, localStorageService, PmtUtilsTransformers) {
        var self = this;
        self.getCheckoutInfo = getCheckoutInfo;
        self.defer;
        self.numberAttemps = 0;

        ////////////////
        /**
         * Gets the Checkout Info for a booking purchase. If there was and error in the http call, 
         * this method treats these http error code and returns the object to show an error in the view.
         * @param {String} paymentId - the payment id to make the purchase
         * @returns {Object.<Promise>} - returns a promise. When the promise resolves, it returns received data.
         *  When the promise rejects, it returns an object with the error data to show in the view
         */
        function getCheckoutInfo(paymentId, orderId, serviceURI) {
            var endpoint = serviceURI + PmtConstants.ENDPOINTS.DEFAULT.paymentMethodsServiceURI;
            self.defer = self.defer || $q.defer();
            if (localStorageService.get('selectedAviosDisccount')) {
                CheckoutPayPalInfoProxy.getCheckoutInfoAvios(endpoint + orderId + '/payment/' + paymentId + '/paypal/checkout', PmtUtilsTransformers.getAviosPaypalInfo(localStorageService.get('selectedAviosDisccount')))
                    .then(getCheckoutInfoSuccess, getCheckoutInfoError);
            } else {
                CheckoutPayPalInfoProxy.getCheckoutInfo(endpoint + orderId + '/payment/' + paymentId + '/paypal/checkout')
                    .then(getCheckoutInfoSuccess, getCheckoutInfoError);
            }
            return self.defer.promise;

            function getCheckoutInfoSuccess(data) {
                self.defer.resolve(data.data);
                self.defer = null;
                self.numberAttemps = 0;
            }

            function getCheckoutInfoError(error) {
                var errorObject = {
                    'actualAttemps': self.numberAttemps,
                    'paymentMethodCallback': getCheckoutInfoCallback,
                    'response': error,
                    url: endpoint + orderId + '/payment/' + paymentId + '/paypal/checkout'
                }
                returnProcessedError(PmtHttpErrorFilter.errorHandlerFactory(error.errorCode, errorObject));

                function getCheckoutInfoCallback() {
                    self.numberAttemps++;
                    getCheckoutInfo(paymentId, orderId, serviceURI);
                }
            }
        };

        /**
         * If there is a response error object as input, the function rejects the service promise and initialize service attributes
         * @param {Object} responseError - the processed http response error. It could be undefined or null
         */
        function returnProcessedError(responseError) {
            if (responseError) {
                self.defer.reject(responseError);
                self.defer = null;
                self.numberAttemps = 0;
            }
        }


    }
})();