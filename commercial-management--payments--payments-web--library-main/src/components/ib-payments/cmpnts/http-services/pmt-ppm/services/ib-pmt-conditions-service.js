(function () {
    'use strict';

    angular
        .module('ib-pmt-services-http-module')
        .service('PmtConditionsService', PmtConditionsService);

    PmtConditionsService.$inject = ['$q', 'PmtConditionsProxy', 'PmtConstants', 'PmtHttpErrorFilter'];
    function PmtConditionsService($q, PmtConditionsProxy, PmtConstants, PmtHttpErrorFilter) {
        var self = this;
        self.getPaymentConditions = getPaymentConditions;
        self.defer;

        ////////////////
        /**
         * Gets the available Pmt conditions for a booking purchase. If there was and error in the http call, 
         * this method treats these http error code and returns the object to show an error in the view.
         * @param {String} orderId - the bookig order id to make the conditions
         * @returns {Object.<Promise>} - returns a promise. When the promise resolves, it returns received data.
         *  When the promise rejects, it returns an object with the error data to show in the view
         */
        function getPaymentConditions(orderId, servicesURI) {
            var endpoint = servicesURI + PmtConstants.ENDPOINTS.DEFAULT.paymentMethodsServiceURI;
            self.defer = self.defer || $q.defer();
            PmtConditionsProxy.getPaymentConditions(endpoint + orderId + '/payment-conditions')
                .then(getPaymentConditionsSuccess, getPaymentConditionsError);
            return self.defer.promise;

            function getPaymentConditionsSuccess(conditionsData) {
                self.defer.resolve(conditionsData.data);
                self.defer = null;
            }

            function getPaymentConditionsError(responseError) {
                self.defer.reject(responseError);
                self.defer = null;
            }
        };
    }
})();