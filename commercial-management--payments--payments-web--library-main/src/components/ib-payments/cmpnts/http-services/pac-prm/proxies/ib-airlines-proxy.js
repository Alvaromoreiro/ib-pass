import { lastValueFrom } from "rxjs";

(function () {
    'use strict';

    angular
        .module('ib-pmt-services-http-module')
        .factory('AirlinesProxy', AirlinesProxy);

    AirlinesProxy.$inject = ['PmtRxProxy'];
    function AirlinesProxy(PmtRxProxy) {
        var service = {
            getAirlines: getAirlines
        };

        return service;

        ////////////////
        function getAirlines(url) {
            return lastValueFrom(PmtRxProxy.get(url))
            .then(response => response.data)
            .catch(response => Promise.reject({    
                data: response?.error,
                errorCode: response?.status
            }));
        }
    }
})();