(function () {
    'use strict';
    //Service used to managed logic into flight now view, initialize its data
    angular
        .module('ib-flight-now-module')
        .factory('FlightNowService', FlightNowService);

    FlightNowService.$inject = ['$q', '$location', 'localStorageService', 'ModalService', 'GetAvailabilityFlightNowService', 'FlightNowTransformer', 'GetAirlinesService'];
    function FlightNowService($q, $location, localStorageService, ModalService, GetAvailabilityFlightNowService, FlightNowTransformer, GetAirlinesService) {

        return {
            getAvailabilityFlightNow: getAvailabilityFlightNow
        };

        ////////////////

        //initilize view  data and transform it 
        function getAvailabilityFlightNow() {
            var deferred = $q.defer();
            var flightNowTransformedData;
            var flyNowRequest = FlightNowTransformer.createFlyNowRequest(localStorageService.get('selectedBlockPa'), localStorageService.get('flowId'));
            ModalService.isWaiting();

            GetAvailabilityFlightNowService.getAvailabilityFlightNow(flyNowRequest).then(function (flightNowData) {
                localStorageService.set('flightNowData', flightNowData);
                GetAirlinesService.getAirlines().then(getAirlinesSuccess, getAirlinesSuccess);

            }, function (error) {
                ModalService.isNotWaiting();
                ModalService.setErrorMessage(error.message);
                ModalService.setErrorCode(error.internalErrorCode);
                ModalService.isError(error).result.then(goToIbcoac, goToIbcoac);
                deferred.reject(error);
            });

            return deferred.promise;

            function getAirlinesSuccess() {
                flightNowTransformedData = FlightNowTransformer.transformFlightNowInfo(localStorageService.get('flightNowData'));
                ModalService.isNotWaiting();
                deferred.resolve(flightNowTransformedData);
            }

            function goToIbcoac() {
                $location.path('/ibcoac')
            }
        }

    }
})();