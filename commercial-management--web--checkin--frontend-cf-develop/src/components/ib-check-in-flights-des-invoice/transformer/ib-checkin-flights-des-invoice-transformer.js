(function () {
    'use strict';

    angular
        .module('ib-checkin-flights-des-invoice-module')
        .factory('DesInvoincingTransformer', DesInvoincingTransformer);

    DesInvoincingTransformer.$inject = ['CheckinAppConstants', 'localStorageService'];
    function DesInvoincingTransformer(CheckinAppConstants, localStorageService) {
        var service = {
            transformSegmentsPassengersInfo: transformSegmentsPassengersInfo
        };
        return service;

        ////////////////

        function transformSegmentsPassengersInfo(deinvoicingData) {
            var returnedFlightsPassengersInfo = deinvoicingData;
            return returnedFlightsPassengersInfo;
        }
    }
})();