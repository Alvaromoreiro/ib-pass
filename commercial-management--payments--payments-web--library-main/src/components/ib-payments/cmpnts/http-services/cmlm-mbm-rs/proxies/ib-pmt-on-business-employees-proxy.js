import { lastValueFrom } from "rxjs";

(function () {
    'use strict';

    angular
        .module('ib-pmt-services-http-module')
        .factory('PmtOnBusinessEmployeesProxy', PmtOnBusinessEmployeesProxy);

    PmtOnBusinessEmployeesProxy.$inject = ['PmtRxProxy'];
    function PmtOnBusinessEmployeesProxy(PmtRxProxy) {
        var service = {
            getOnBusinessEmployees: getOnBusinessEmployees
        };

        return service;

        ////////////////
        function getOnBusinessEmployees(url) {
            return lastValueFrom(PmtRxProxy.get(url))
                .then(response => response.data)
                .catch(response => Promise.reject({    
                    data: response?.error,
                    errorCode: response?.status
                }));
        }
    }
})();