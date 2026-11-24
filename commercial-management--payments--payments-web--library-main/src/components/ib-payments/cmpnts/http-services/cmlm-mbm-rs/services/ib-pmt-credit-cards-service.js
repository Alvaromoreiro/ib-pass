(function () {
    'use strict';

    angular
        .module('ib-pmt-services-http-module')
        .service('PmtOnBCreditCardsService', PmtOnBCreditCardsService);

    PmtOnBCreditCardsService.$inject = ['PmtOnBCreditCardsProxy', 'PmtConstants', '$q', 'localStorageService', 'PmtOnBCreditCardsTransformer'];
    function PmtOnBCreditCardsService(PmtOnBCreditCardsProxy, PmtConstants, $q, localStorageService, PmtOnBCreditCardsTransformer) {

        var self = this;

        self.getCustomerCreditCardsInfo = getCustomerCreditCardsInfo;
        self.saveCustomerCreditCard = saveCustomerCreditCard;
        self.defer;
        self.numberAttemps = 0;

        /**
         * Gets the customer credit cards from the service and returns it. If there was and error in the http call, 
         * this method treats these http error code and returns the object to show an error in the view.
         * @returns {Object.<Promise>} - returns a promise. When the promise resolves, it returns received data.
         *  When the promise rejects, it returns an object with the error data to show in the view
         */

        function getCustomerCreditCardsInfo(serviceURI) {
            var endpoint = serviceURI + PmtConstants.ENDPOINTS.DEFAULT.onBusinessCreditCardDataURI + '/assigned';
            self.defer = self.defer || $q.defer();
            PmtOnBCreditCardsProxy.getCustomerCreditCardsInfo(endpoint).then(getCreditCardsInfoSuccess, function () {
                getCreditCardsInfoSuccess([]);
            });

            return self.defer.promise;

            function getCreditCardsInfoSuccess(customerCreditCardsData) {
                var creditCardsInfo = PmtOnBCreditCardsTransformer.AddedInfoProvider(customerCreditCardsData);
                localStorageService.set('customerCreditCardsData', creditCardsInfo);
                self.defer.resolve(creditCardsInfo);
                self.defer = null;
                self.numberAttemps = 0;
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
        };

        /**
         * Save the customer credit card into the service. If there was and error in the http call, 
         * this method treats these http error code and returns the object to show an error in the view.
         * @param {Object} customerCreditCardData Object request to save information in service cust-cust
         * @returns {Object.<Promise>} - returns a promise. When the promise resolves, it returns received data.
         *  When the promise rejects, it returns an object with the error data to show in the view
         */
        function saveCustomerCreditCard(customerCreditCardData, serviceURI) {
            var endpoint = serviceURI + PmtConstants.ENDPOINTS.DEFAULT.onBusinessCreditCardDataURI;
            self.defer = self.defer || $q.defer();
            PmtOnBCreditCardsProxy.saveCustomerCreditCard(endpoint, customerCreditCardData).then(saveCustomerCreditCardSuccess, saveCustomerCreditCardError);

            return self.defer.promise;

            function saveCustomerCreditCardSuccess(customerCreditCardsData) {
                self.defer.resolve(customerCreditCardsData);
                self.defer = null;
                self.numberAttemps = 0;
            };

            function saveCustomerCreditCardError(error) {
                returnProcessedError(error);
            }

        }
    }
})();