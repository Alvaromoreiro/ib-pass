(function () {
    'use strict';

    angular
        .module('ib-pmt-services-http-module')
        .service('PmtOnBusinessMembershipService', PmtOnBusinessMembershipService);

    PmtOnBusinessMembershipService.$inject = ['PmtOnBusinessMembershipProxy', '$q', 'PmtConstants', 'PmtHttpErrorManagement', 'localStorageService', '$rootScope', 'DatalayerUtilsService', 'CurrencyService'];
    function PmtOnBusinessMembershipService(PmtOnBusinessMembershipProxy, $q, PmtConstants, PmtHttpErrorManagement, localStorageService, $rootScope, DatalayerUtilsService, CurrencyService) {
        var self = this;
        self.getOnBusinessMembership = getOnBusinessMembership;
        self.numberAttemps = 0;
        self.defer;


        ////////////////
        //Get singleton breakdown list
        function getOnBusinessMembership() {
            var endpoint = PmtConstants.ENDPOINTS.DEFAULT.onBusinessMembershipURI;
            self.defer = self.defer || $q.defer();
            PmtOnBusinessMembershipProxy.getOnBusinessMembership(endpoint).then(getOnBusinessMembershipSuccess, getOnBusinessMembershipError);

            return self.defer.promise;

            function getOnBusinessMembershipSuccess(data) {
                $rootScope.membershipData = data;
                data.pointsTransformed = localStorageService.get('commercialData') && localStorageService.get('commercialData').currency && localStorageService.get('commercialData').currency.groupingSeparator ? CurrencyService.formatAvios(localStorageService.get('commercialData').currency.groupingSeparator, data.memberBalance) : data.memberBalance;
                localStorageService.set('membershipData', data);
                DatalayerUtilsService.updateLoggedDatalayer(data.userInfo);
                self.defer.resolve(data);
                self.defer = null;
            }

            function getOnBusinessMembershipError(error) {
                switch (error.errorCode) {
                    case 408:
                    case 504: returnProcessedError(PmtHttpErrorManagement.timeOutError(self.numberAttemps, getOnBusinessMembershipCallback, error)); break;
                    case 401: returnProcessedError(PmtHttpErrorManagement.unauthorizedError(self.numberAttemps, getOnBusinessMembershipCallback, error)); break;
                    default: returnProcessedError(PmtHttpErrorManagement.processGeneralError(error));
                }

                function getOnBusinessMembershipCallback() {
                    self.numberAttemps++;
                    getOnBusinessMembership();
                }

                function returnProcessedError(responseError) {
                    if (responseError) {
                        self.defer.reject(responseError);
                        self.defer = null;
                        self.numberAttemps = 0;
                    }
                }
            }
        }
    }
})();