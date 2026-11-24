import { lastValueFrom } from "rxjs";

(function () {
    'use strict';

    angular
        .module('ib-pmt-services-http-module')
        .factory('PmtCustomerDataProxy', PmtCustomerDataProxy);

    PmtCustomerDataProxy.$inject = ['PmtRxProxy'];
    function PmtCustomerDataProxy(PmtRxProxy) {
        var service = {
            getCustomerData: getCustomerData
        };

        return service;

        ////////////////
        function getCustomerData(url) {
            return lastValueFrom(PmtRxProxy.get(url))
            .then(response => response.data)
            .catch(response => Promise.reject({    
                data: response?.error,
                errorCode: response?.status
            }));
        }
    }
})();