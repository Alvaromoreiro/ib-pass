(function () {
    'use strict';
    angular
        .module('ib-pmt-services-http-module')
        .service('PmtFullAviosService', PmtFullAviosService);
    PmtFullAviosService.$inject = ['$q', 'PmtFullAviosProxy', 'PmtConstants', 'PmtHttpErrorFilter','$window'];
    function PmtFullAviosService($q, PmtFullAviosProxy, PmtConstants, PmtHttpErrorFilter,$window) {
        var self = this;
        self.getFullAvios = getFullAvios;
        self.aviosErrorCallback = aviosErrorCallback;
        self.defer;
        self.numberAttemps = 0;
        ////////////////
        /**
         * POST full avios .
         * @param {Object} requestData - object with the request to get information about full avios selected
         * @returns {Object.<Promise>} - returns a promise. When the promise resolves, it returns received data.
         *  When the promise rejects, it returns an object with the error data to show in the view
         */
        function getFullAvios(orderId, paymentId, serviceURI, requestData) {
            var endpoint = serviceURI + PmtConstants.ENDPOINTS.DEFAULT.fullAviosURI;
            self.defer = self.defer || $q.defer();
            PmtFullAviosProxy.getFullAvios(endpoint + orderId + '/avios/' + paymentId, requestData)
                .then(getFullAviosSuccess, function (error) {
                aviosCheckError(error, aviosErrorCallback, endpoint);
            });
            return self.defer.promise;
            function getFullAviosSuccess(fullAvios) {
                self.defer.resolve(fullAvios.data);
                self.defer = null;
            }
            ;
        }
        ;
        function aviosErrorCallback(orderId, paymentId,serviceURI, requestData) {
            var endpoint = serviceURI + PmtConstants.ENDPOINTS.DEFAULT.fullAviosURI;
            self.numberAttemps++;
            self.getFullAvios(endpoint + orderId + '/avios/' + paymentId, requestData);
        }
        function aviosCheckError(error, callback, endpoint) {
            var errorObject = {
                'actualAttemps': self.numberAttemps,
                'paymentMethodCallback': callback,
                'response': error,
                url: endpoint + orderId + '/avios/' + paymentId
            };
            if (self.numberAttemps >= 5) {
                returnProcessedError(PmtHttpErrorFilter.errorHandlerFactory(error.errorCode, errorObject));
            }
            else {
                self.aviosErrorCallback();
            }
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
    }
})();
