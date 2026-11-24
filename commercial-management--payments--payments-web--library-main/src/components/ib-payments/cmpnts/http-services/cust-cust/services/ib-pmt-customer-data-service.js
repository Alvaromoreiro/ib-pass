(function () {
    'use strict';

    angular
        .module('ib-pmt-services-http-module')
        .service('PmtCustomerDataService', PmtCustomerDataService);

    PmtCustomerDataService.$inject = ['$q', 'PmtConstants', 'PmtHttpErrorManagement', 'localStorageService', 'PmtUtilsService', 'CurrencyService', '$rootScope', 'DatalayerUtilsService', 'IbCCustomerDataService'];
    function PmtCustomerDataService($q, PmtConstants, PmtHttpErrorManagement, localStorageService, PmtUtilsService, CurrencyService, $rootScope, DatalayerUtilsService, IbCCustomerDataService) {
        var self = this;
        self.getCustomerData = getCustomerData;
        self.numberAttemps = 0;
        self.defer;


        ////////////////
        //Get singleton breakdown list
        function getCustomerData() {
            self.defer = self.defer || $q.defer();
            IbCCustomerDataService.getCustomerData().then(getCustomerDataSuccess, getCustomerDataError);

            return self.defer.promise;

            function getCustomerDataSuccess(data) {
                data.generalInfo['aviosTransformed'] = localStorageService.get('commercialData') && localStorageService.get('commercialData').currency && localStorageService.get('commercialData').currency.groupingSeparator ? CurrencyService.formatAvios(localStorageService.get('commercialData').currency.groupingSeparator, data.generalInfo.avios) : data.generalInfo.avios;
                $rootScope.customerData = data;
                localStorageService.set('customerData', data);
                DatalayerUtilsService.updateLoggedDatalayer(data.generalInfo);
                self.defer.resolve(data);
                self.defer = null;
            }

            function getCustomerDataError(responseError) {
                if (responseError) {
                    self.defer.reject(responseError);
                    self.defer = null;
                    self.numberAttemps = 0;
                }
            }
        }
    }
})();