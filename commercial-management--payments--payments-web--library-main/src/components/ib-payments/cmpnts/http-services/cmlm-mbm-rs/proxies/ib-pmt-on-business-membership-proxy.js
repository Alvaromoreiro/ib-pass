import { lastValueFrom } from "rxjs";

(function () {
    'use strict';

    angular
        .module('ib-pmt-services-http-module')
        .factory('PmtOnBusinessMembershipProxy', PmtOnBusinessMembershipProxy);

    PmtOnBusinessMembershipProxy.$inject = ['PmtRxProxy'];
    function PmtOnBusinessMembershipProxy(PmtRxProxy) {
        var service = {
            getOnBusinessMembership: getOnBusinessMembership
        };

        return service;

        ////////////////
        function getOnBusinessMembership(url) {
            return lastValueFrom(PmtRxProxy.get(url))
                .then(response => response.data)
                .catch(response => Promise.reject({    
                    data: response?.error,
                    errorCode: response?.status
                }));
        }
    }
})();