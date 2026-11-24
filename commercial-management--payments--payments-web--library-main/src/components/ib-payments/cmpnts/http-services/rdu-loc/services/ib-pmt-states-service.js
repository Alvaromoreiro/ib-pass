(function () {
    'use strict';

    angular
        .module('ib-pmt-services-http-module')
        .service('PmtStatesListService', PmtStatesListService);

    PmtStatesListService.$inject = ['$q', 'localStorageService', 'PmtStatesListProxy', 'PmtConstants', 'PmtHttpErrorFilter'];
    function PmtStatesListService($q, localStorageService, PmtStatesListProxy, PmtConstants, PmtHttpErrorFilter) {

        var self = this;
        self.getStatesList = getStatesList;
        self.defer;
        self.numberAttemps = 0;

        ////////////////

        /**
         * Gets the states list from the service and returns it. If there was and error in the http call, 
         * this method treats these http error code and returns the object to show an error in the view.
         * @returns {Object.<Promise>} - returns a promise. When the promise resolves, it returns received data.
         *  When the promise rejects, it returns an object with the error data to show in the view
         */
        function getStatesList(selectedCountry, serviceURI) {
            var endpoint;
            self.defer = self.defer || $q.defer();
            endpoint = serviceURI + PmtConstants.ENDPOINTS.DEFAULT.statesListServiceURI;
            endpoint = endpoint + (selectedCountry || PmtConstants.market) + '/states'
            if (localStorageService.get('statesList') && localStorageService.get('selectedAvios')) {
                self.defer.resolve(localStorageService.get('statesList'));
            } else {
                PmtStatesListProxy.getStatesList(endpoint).then(getStatesListSuccess, getStatesListError);
            }


            return self.defer.promise;

            function getStatesListSuccess(statesList) {
                localStorageService.set('statesList', statesList.data);
                self.defer.resolve(statesList.data);
                self.defer = null;
                self.numberAttemps = 0;
            }

            function getStatesListError(error) {
                var errorObject = {
                    'actualAttemps': self.numberAttemps,
                    'paymentMethodCallback': getStateListCallback,
                    'response': error,
                    url: endpoint
                };
                returnProcessedError(PmtHttpErrorFilter.handlePaymentInitDataError(error.errorCode, errorObject));

                function getStateListCallback() {
                    self.numberAttemps++;
                    getStatesList(selectedCountry, serviceURI);
                }
            };
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

    }
})();