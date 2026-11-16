(function () {
    'use strict';

    angular
        .module('ib-MmB-manage-maximum-to-pay-info-module')
        .controller('MmBManageMaximumToPayInfoController', MmBManageMaximumToPayInfoController);

    MmBManageMaximumToPayInfoController.$inject = ['$timeout', '$filter', 'localStorageService', 'MmBModalService', 'ExternalAncillariesService', '$document', '$compile', 'MmBUtilsSharedService', '$scope', '$rootScope'];
    function MmBManageMaximumToPayInfoController($timeout, $filter, localStorageService, MmBModalService, ExternalAncillariesService, $document, $compile, MmBUtilsSharedService, $scope, $rootScope) {
        var vm = this, purchase;
        vm.$onInit = activate;
        vm.pendingPaymentIBV = pendingPaymentIBV;

        purchase = localStorageService.get('yourPurchase').pendingAmount;

        vm.popoverHolidays = [
            { 'text': $filter('translate')('IBCOAC_MMB_REQUEST_BILL_LINK_TITLE'), 'path': null },
            { 'text': $filter('translate')('MMB_VC_IB_VACIONES_YOUR_CAR'), 'path': null }
        ];

        function activate() {
            vm.model[0].pendingAmount = purchase;
        }

        function pendingPaymentIBV() {
            var requestData = { type: 'PAYMENT', payingPerson: localStorageService.get('paymentpassengerIdIBV'), holderTraveling: '', locator: localStorageService.get('PNR')}, flowId = localStorageService.get('flowId');
            if (requestData.payingPerson !== null) {
                if (requestData.payingPerson === 99) {
                    requestData.holderTraveling = 'no';
                } else {
                    requestData.holderTraveling = 'yes';
                }
                MmBModalService.showWaitingModal();
                ExternalAncillariesService.getExternalAncillaryUrl(flowId, null, requestData).then(function (redirectData) {
                    if (redirectData) {
                        localStorageService.remove('paymentpassengerIdIBV');
                        angular.element($document).find('body').append($compile(MmBUtilsSharedService.generateRedirectionFormCancel(redirectData))($scope));
                        $timeout(function () {
                            angular.element(angular.element($document).find('#submit_hidden_form')).trigger('click');
                        });
                    }
                }, function (error) {
                    MmBModalService.finishWaiting();
                    MmBModalService.showGenericError(error).result.then(angular.noop, angular.noop);
                });
            } else {
                $rootScope.$emit('IBVPayerNotSelected');
            }
        }

    }
})();
