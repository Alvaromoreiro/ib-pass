import { lastValueFrom } from "rxjs";

(function () {
    'use strict';

    angular
        .module('ib-pmt-services-http-module')
        .factory('PmtCachedInformationProxy', PmtCachedInformationProxy);

    PmtCachedInformationProxy.$inject = ['PmtRxProxy'];
    function PmtCachedInformationProxy(PmtRxProxy) {
        var service = {
            getCachedInformation: getCachedInformation
        };

        return service;

        ////////////////
        function getCachedInformation(uri, checkinId) {
            return lastValueFrom(PmtRxProxy.get(uri + checkinId + '/cached'))
            .then(response => response.data)
            .catch(response => Promise.reject({    
                data: response?.error,
                errorCode: response?.status
            }));
        }
    }
})();