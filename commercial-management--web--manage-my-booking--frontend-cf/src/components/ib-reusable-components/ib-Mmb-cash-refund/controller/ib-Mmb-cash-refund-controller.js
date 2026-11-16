(function () {
    'use strict';

    angular
        .module('ib-MmB-cash-refund-module')
        .controller('CashRefundController', CashRefundController);

    CashRefundController.$inject = ['MmBModalService', 'localStorageService', '$filter', '$scope', 'DisruptionDashboardConstants'];
    function CashRefundController(MmBModalService, localStorageService, $filter, $scope, DisruptionDashboardConstants) {
        var vm = this;
        vm.openSummary = openSummary;
        vm.$onInit = activate;

        function activate() {
            var channel = localStorageService.get('pnrChannel'), phoneLiteral = '';
            vm.phonesList = localStorageService.get('phonesList');
            if (vm.phonesList && vm.phonesList.RESERVAS) {
                vm.phoneListOjbject = {
                    'phoneNumber': vm.phonesList.RESERVAS.telephone,
                    'phonePrefix': vm.phonesList.RESERVAS.prefix,
                    'phoneLiteral': vm.phonesList.RESERVAS.prefix + vm.phonesList.RESERVAS.telephone
                };
                phoneLiteral = ' ' + vm.phonesList.RESERVAS.prefix + ' ' + vm.phonesList.RESERVAS.telephone;
                vm.textRefundByCashNotAvailable = $filter('translate')('MMB_REFUNDS_VOUCHER_CASH_TEXT');
                vm.textRefundByCashNotAvailable2 = $filter('translate')(vm.flags?.showRefundVoucherSectionFunctional ? 'MMB_FLEX_CASH_VOUCHER_REFUND':'MMB_FLEX_CASH_REFUND');
                vm.textRefundByCashNotAvailable = vm.textRefundByCashNotAvailable.replace(/\*/g, vm.phonesList.RESERVAS.prefix + ' ' + vm.phonesList.RESERVAS.telephone);
                vm.textRefundByCashNotAvailable2 = vm.textRefundByCashNotAvailable2.replace(/\*/g, vm.phonesList.RESERVAS.prefix + ' ' + vm.phonesList.RESERVAS.telephone);
            }
            if (DisruptionDashboardConstants.COMMON_LABELS.CHANNEL[channel]) {
                vm.textRefundByCashNotAvailable = $filter('translate')(DisruptionDashboardConstants.COMMON_LABELS.CHANNEL[channel].VALUE);
                vm.textRefundByCashNotAvailable += DisruptionDashboardConstants.COMMON_LABELS.CHANNEL[channel].PHONE ? phoneLiteral: '';
            } else {
                vm.textRefundByCashNotAvailable = $filter('translate')(DisruptionDashboardConstants.COMMON_LABELS.CHANNEL[channel].VALUE);
                vm.textRefundByCashNotAvailable += DisruptionDashboardConstants.COMMON_LABELS.CHANNEL['DEFAULT'].PHONE ? phoneLiteral: '';
            }
        }

        function openSummary() {
            localStorageService.set('voucherEmailNotificationFlow', false);
            localStorageService.set('cashEmailNotificationFlow', true);
            if (vm.isDisruption) {
                $scope.$emit('activateCashFlow');
                $scope.$emit('nextStep');
            } else {
                MmBModalService.showFullModal(false, 'ib-Mmb-cash-refund-modal-view.html', { 'priceInfo': vm.priceInfo, 'summaryModel': vm.summaryModel, 'phoneList': vm.phoneListOjbject, 'cashInformation': vm.cashPriceInfo }).result.then(angular.noop, angular.noop);
            }
        }
    }
})();
