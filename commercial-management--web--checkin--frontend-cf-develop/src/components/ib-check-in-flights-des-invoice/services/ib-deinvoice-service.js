(function () {
    'use strict';

    angular
        .module('ib-checkin-flights-des-invoice-module')
        .factory('DeinvoicingService', DeinvoicingService);

    DeinvoicingService.$inject = ['$q', 'DeletePassengerService', 'DesInvoincingTransformer'];
    function DeinvoicingService($q, DeletePassengerService, DesInvoincingTransformer) {

        return {
            deinvoicingFlights: deinvoicingFlights
        };

        function deinvoicingFlights(segmentPassengerData, checkinId) {
            var deferred = $q.defer();
            DeletePassengerService.deletePassenger(segmentPassengerData, checkinId).then(deletePassengerSuccess, deletePassengerError);
            return deferred.promise;

            function deletePassengerSuccess(deinvoicingData) {
                var transformedData = DesInvoincingTransformer.transformSegmentsPassengersInfo(deinvoicingData);
                deferred.resolve(transformedData);
            }

            function deletePassengerError(error) {
                deferred.reject(error);
            }
        }
    }
})();