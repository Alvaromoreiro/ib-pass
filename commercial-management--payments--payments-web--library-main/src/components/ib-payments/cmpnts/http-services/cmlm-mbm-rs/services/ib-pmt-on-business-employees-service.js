(function () {
    'use strict';

    angular
        .module('ib-pmt-services-http-module')
        .service('PmtOnBusinessEmployeesService', PmtOnBusinessEmployeesService);

    PmtOnBusinessEmployeesService.$inject = ['PmtOnBusinessEmployeesProxy', '$q', 'PmtConstants', 'PmtHttpErrorManagement', 'localStorageService', '$rootScope'];
    function PmtOnBusinessEmployeesService(PmtOnBusinessEmployeesProxy, $q, PmtConstants, PmtHttpErrorManagement, localStorageService, $rootScope) {
        var self = this;
        self.getOnBusinessEmployees = getOnBusinessEmployees;
        self.numberAttemps = 0;
        self.defer;


        ////////////////
        //Get singleton breakdown list
        function getOnBusinessEmployees() {
            var endpoint = PmtConstants.ENDPOINTS.DEFAULT.onBusinessEmployeesURI;
            self.defer = self.defer || $q.defer();
            PmtOnBusinessEmployeesProxy.getOnBusinessEmployees(endpoint).then(getOnBusinessEmployeesSuccess, getOnBusinessEmployeesError);

            return self.defer.promise;

            function getOnBusinessEmployeesSuccess(data) {
                $rootScope.membershipData['employees'] = data;
                localStorageService.set('membershipData', $rootScope.membershipData);
                self.defer.resolve(data);
                self.defer = null;
            }

            function getOnBusinessEmployeesError(error) {
                switch (error.errorCode) {
                    case 408:
                    case 504: returnProcessedError(PmtHttpErrorManagement.timeOutError(self.numberAttemps, getOnBusinessEmployeesCallback, error)); break;
                    case 401: returnProcessedError(PmtHttpErrorManagement.unauthorizedError(self.numberAttemps, getOnBusinessEmployeesCallback, error)); break;
                    default: returnProcessedError(PmtHttpErrorManagement.processGeneralError(error));
                }

                function getOnBusinessEmployeesCallback() {
                    self.numberAttemps++;
                    getOnBusinessEmployees();
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