(function () {
    'use strict';

    angular
        .module('ib-pmt-services-http-module')
        .service('PmtCreditCardsService', PmtCreditCardsService);

    PmtCreditCardsService.$inject = ['PmtCreditCardsProxy', 'PmtConstants', '$q', 'localStorageService', 'PmtHttpErrorFilter', 'PmtCreditCardsTransformer'];
    function PmtCreditCardsService(PmtCreditCardsProxy, PmtConstants, $q, localStorageService, PmtHttpErrorFilter, PmtCreditCardsTransformer) {

        var self = this;

        self.getCreditCardsImgs = getCreditCardsImgs;
        self.getCustomerCreditCardsInfo = getCustomerCreditCardsInfo;
        self.saveCustomerCreditCard = saveCustomerCreditCard;
        self.defer;
        self.numberAttemps = 0;

        ////////////////
        function getCreditCardsImgs() {
            var creditCards = localStorageService.get('creditCardsList'), defer = defer || $q.defer();
            if (creditCards == null) {
                PmtCreditCardsProxy.getCreditCardsImgs(PmtConstants.ROUTES.icons + PmtConstants.ROUTES.creditCardsJson)
                    .then(getCreditCardSuccess, getCreditCardsError)['catch'](getCreditCardsError);
            } else {
                defer.resolve(creditCards);
            }

            return defer.promise;

            function getCreditCardSuccess(data) {
                localStorageService.set('creditCardsList', data);
                defer.resolve(data);
                defer = null;
            }

            function getCreditCardsError(error) {
                defer.resolve({});
                defer = null;
            }
        }

        ////////////////
        /**
         * Gets the customer credit cards from the service and returns it. If there was and error in the http call, 
         * this method treats these http error code and returns the object to show an error in the view.
         * @returns {Object.<Promise>} - returns a promise. When the promise resolves, it returns received data.
         *  When the promise rejects, it returns an object with the error data to show in the view
         */

        function getCustomerCreditCardsInfo(serviceURI) {
            var endpoint = serviceURI + PmtConstants.ENDPOINTS.DEFAULT.customerCreditCardDataURI, defer = self.defer || $q.defer();
            if (localStorageService.get('customerCreditCardsData') && localStorageService.get('selectedAvios')) {
                defer.resolve(localStorageService.get('customerCreditCardsData'));
            } else {
                PmtCreditCardsProxy.getCustomerCreditCardsInfo(endpoint).then(getCreditCardsInfoSuccess, function () {
                    getCreditCardsInfoSuccess([]);
                });
            }

            return defer.promise;

            function getCreditCardsInfoSuccess(customerCreditCardsData) {
                var creditCardsInfo = PmtCreditCardsTransformer.AddedInfoProvider(customerCreditCardsData);
                localStorageService.set('customerCreditCardsData', creditCardsInfo);
                defer.resolve(creditCardsInfo);
                defer = null;
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
            var endpoint = serviceURI + PmtConstants.ENDPOINTS.DEFAULT.customerCreditCardDataURI;
            self.defer = self.defer || $q.defer();
            PmtCreditCardsProxy.saveCustomerCreditCard(endpoint, customerCreditCardData).then(saveCustomerCreditCardSuccess, saveCustomerCreditCardError);

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