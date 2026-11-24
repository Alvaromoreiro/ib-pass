(function () {
    'use strict';

    angular
        .module('ib-pmt-services-http-module')
        .service('PmtCo2InfoService', PmtCo2InfoService);

    PmtCo2InfoService.$inject = ['$q', 'PmtCo2InfoProxy', 'PmtConstants'];
    function PmtCo2InfoService($q, PmtCo2InfoProxy, PmtConstants) {

        var self = this;
        self.getCo2Info = getCo2Info;
        self.defer;
        self.numberAttemps = 0;

        ////////////////
        /**
         * Gets the co2 mark information data  and returns it. If there was and error in the http call, 
         * this method treats these http error code and returns the object to show an error in the view.
         * @param {Object} requestData - the co2 rest service request info
         * @returns {Object.<Promise>} - returns a promise. When the promise resolves, it returns received data.
         *  When the promise rejects, it returns an object with the error data to show in the view
         */
        function getCo2Info(requestData, serviceURI) {
            var endpoint = serviceURI + PmtConstants.ENDPOINTS.DEFAULT.co2InfoURI;
            self.defer = self.defer || $q.defer();
            PmtCo2InfoProxy.getCo2Info(endpoint, requestData).then(getCo2InfoSuccess, getCo2InfoError);
            return self.defer.promise;

            function getCo2InfoSuccess(data) {
                self.defer.resolve(data);
                self.defer = null;
                self.numberAttemps = 0;
            };
        };

        /**
         * If there is a response error object as input, the function rejects the service promise and initialize service attributes
         * @param {Object} responseError - the processed http response error. It could be undefined or null
         */
        function getCo2InfoError(responseError) {
            if (responseError) {
                self.defer.reject(responseError);
                self.defer = null;
                self.numberAttemps = 0;
            }
        };
    }
})();