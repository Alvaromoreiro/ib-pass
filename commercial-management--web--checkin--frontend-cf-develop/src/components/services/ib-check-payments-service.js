(function () {
    'use strict';

    angular
        .module('ib-checkin-services-module')
        .factory('CheckPaymentsService', CheckPaymentsService);

    CheckPaymentsService.$inject = ['IbCConditionsService', 'localStorageService', '$location', 'ModalService'];
    function CheckPaymentsService (IbCConditionsService, localStorageService, $location, ModalService) {
        var service = {
            checkPayments: checkPayments
        };

        return service;

        ////////////////
        function checkPayments () {
            IbCConditionsService.getPaymentConditions(localStorageService.get('flowId')).then(function (paymentsInfo) {
                localStorageService.set('paymentsInfo', paymentsInfo);
                $location.path('/ibpurc');
                ModalService.isNotWaiting();
            }, function (response) {
                ModalService.showGenericError(response, true).result.then(goToIbcose, goToIbcose);
            });
        }
        function goToIbcose () {
            $location.path('/ibcose');
        }
    }
})();