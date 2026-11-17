(function () {
    'use strict';
    angular
        .module('ib-checkin-flights-des-invoice-module')
        .service('FlightsDesInvoiceModel', FlightsDesInvoiceModel);

    function FlightsDesInvoiceModel() {
        var self = this;
        self.conditions;
        self.segmentsPassengersInfo;
        self.initializeModel = initializeModel

        ////////////////

        function initializeModel() {
            self.conditions = false;
            self.segmentsPassengersInfo = [];
        }

    }
})();