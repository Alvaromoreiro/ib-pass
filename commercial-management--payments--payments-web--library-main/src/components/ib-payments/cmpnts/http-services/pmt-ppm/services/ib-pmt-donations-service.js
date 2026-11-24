(function () {
    'use strict';

    angular
        .module('ib-pmt-services-http-module')
        .service('PmtDonationsService', PmtDonationsService);

    PmtDonationsService.$inject = ['$q', 'PmtDonationsProxy', 'PmtConstants', 'PmtHttpErrorFilter'];
    function PmtDonationsService($q, PmtDonationsProxy, PmtConstants, PmtHttpErrorFilter) {
        var self = this;
        self.getAvailableDonations = getAvailableDonations;
        self.defer;

        ////////////////
        /**
         * Gets the available Pmt donations for a booking purchase. If there was and error in the http call, 
         * this method treats these http error code and returns the object to show an error in the view.
         * @param {String} orderId - the bookig order id to make the donation
         * @param {String} paymentId - the payment id to make the donation
         * @returns {Object.<Promise>} - returns a promise. When the promise resolves, it returns received data.
         *  When the promise rejects, it returns an object with the error data to show in the view
         */
        function getAvailableDonations(servicesURI, orderId, paymentId) {
            var endpoint = servicesURI + PmtConstants.ENDPOINTS.DEFAULT.paymentDonationsServiceURI;
            self.defer = self.defer || $q.defer();
            PmtDonationsProxy.getAvailableDonations(endpoint + orderId + '/available-donations/' + paymentId)
                .then(getAvailableDonationsSuccess, getAvailableDonationsError);
            return self.defer.promise;

            function getAvailableDonationsSuccess(donationsData) {
                self.defer.resolve(donationsData.data);
                self.defer = null;
            }

            function getAvailableDonationsError() {
                self.defer.resolve();
                self.defer = null;
            }
        };
    }
})();