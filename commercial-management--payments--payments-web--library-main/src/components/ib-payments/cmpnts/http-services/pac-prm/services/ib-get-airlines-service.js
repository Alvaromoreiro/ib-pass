(function () {
    'use strict';

    angular
        .module('ib-pmt-services-http-module')
        .factory('GetAirlinesService', GetAirlinesService);

    GetAirlinesService.$inject = ['AirlinesProxy', 'PmtConstants', '$q', '$filter', 'localStorageService'];
    function GetAirlinesService(AirlinesProxy, PmtConstants, $q, $filter, localStorageService) {

        return {
            getAirlines: getAirlines
        };

        ////////////////

        //Singleton airlines data, if it is in localstorage return it, else call rest service and storage locally
        function getAirlines() {
            var deferred = $q.defer();
            var airlines = localStorageService.get('airlinesList');

            if (airlines === null) {
                AirlinesProxy.getAirlines(PmtConstants.ROUTES.airlinesJsonRoute)
                    .then(getAirlinesSuccess, getAirlinesError)['catch'](getAirlinesError);
            } else {
                deferred.resolve(airlines);
            }

            return deferred.promise;

            function getAirlinesSuccess(data) {
                localStorageService.set('airlinesList', data);
                deferred.resolve(data);
            }

            function getAirlinesError(error) {
                deferred.reject($filter('translate')('REST_SERVICE_ERROR_GENERAL'));
            }
        }
    }
})();