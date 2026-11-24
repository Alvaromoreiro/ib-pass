(function () {
    'use strict';

    angular
        .module('ib-pmt-services-http-module')
        .service('PmtCountriesListService', PmtCountriesListService);

    PmtCountriesListService.$inject = ['$q', 'localStorageService', 'PmtCountriesListProxy', 'PmtConstants', 'PmtHttpErrorFilter'];
    function PmtCountriesListService($q, localStorageService, PmtCountriesListProxy, PmtConstants, PmtHttpErrorFilter) {

        var self = this;
        self.getCountriesList = getCountriesList;
        self.defer;
        self.numberAttemps = 0;

        ////////////////

        /**
         * Gets the Countries list from the service and returns it. If there was and error in the http call, 
         * this method treats these http error code and returns the object to show an error in the view.
         * @returns {Object.<Promise>} - returns a promise. When the promise resolves, it returns received data.
         *  When the promise rejects, it returns an object with the error data to show in the view
         */
        function getCountriesList(serviceURI) {
            var endPoint = serviceURI + PmtConstants.ENDPOINTS.DEFAULT.countriesListURI;
            self.defer = self.defer || $q.defer();
            PmtCountriesListProxy.getCountriesList(endPoint).then(getCountriesListSuccess, getCountriesListError);
            return self.defer.promise;

            function getCountriesListSuccess(CountriesList) {
                localStorageService.set('countriesList', CountriesList.data);
                self.defer.resolve(CountriesList.data);
                self.defer = null;
                self.numberAttemps = 0;
            }

            function getCountriesListError(error) {
                var errorObject = {
                    'actualAttemps': self.numberAttemps,
                    'paymentMethodCallback': getCountriesListCallback,
                    'response': error,
                    url: endPoint
                };
                returnProcessedError(PmtHttpErrorFilter.handlePaymentInitDataError(error.errorCode, errorObject));

                function getCountriesListCallback() {
                    self.numberAttemps++;
                    getCountriesList(serviceURI);
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