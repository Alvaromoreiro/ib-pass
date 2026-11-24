(function () {
    'use strict';

    angular
        .module('ib-pmt-services-http-module')
        .service('PmtCo2CalcServiceHttp', PmtCo2CalcServiceHttp);

    PmtCo2CalcServiceHttp.$inject = ['$q', 'PmtCo2CalcProxy', 'PmtConstants'];
    function PmtCo2CalcServiceHttp($q, PmtCo2CalcProxy, PmtConstants) {

        var self = this;
        self.getCo2Calc = getCo2Calc;
        self.defer;

        ////////////////
        /**
         * Gets the CO2 price calculations data  and returns it. If there was and error in the http call, 
         * this method treats these http error code and returns the object to show an error in the view.
         * @returns {Object.<Promise>} - returns a promise. When the promise resolves, it returns received data.
         *  When the promise rejects, it returns an object with the error data to show in the view
         */
        function getCo2Calc(requestData, serviceURI) {
            var endpoint = serviceURI + PmtConstants.ENDPOINTS.DEFAULT.co2CalculateURI;
            self.defer = self.defer || $q.defer();
            PmtCo2CalcProxy.getCo2Calc(endpoint, requestData).then(getCo2CalcSuccess, getCo2CalcError);
            return self.defer.promise;

            function getCo2CalcSuccess(data) {
                self.defer.resolve(data);
                self.defer = null;
            };
            
            /**
             * If there is a response error object as input, the function rejects the service promise and initialize service attributes
             * @param {Object} responseError - the processed http response error. It could be undefined or null
             */
            function getCo2CalcError(responseError) {
                if (responseError) {
                    self.defer.reject(responseError);
                    self.defer = null;
                }
            };  
        };      
    }
})();