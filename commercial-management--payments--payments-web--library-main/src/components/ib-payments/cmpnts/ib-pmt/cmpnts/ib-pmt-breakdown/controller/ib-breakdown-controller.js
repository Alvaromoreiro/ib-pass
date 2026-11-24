(function () {
    'use strict';

    angular.module('ib-breakdown-module').controller('BreakdownController', BreakdownController);

    BreakdownController.$inject = ['$scope', 'CurrencyService', 'localStorageService', 'UpgradingUtilService'];
    function BreakdownController ($scope, CurrencyService, localStorageService, UpgradingUtilService) {
        const vm = this;
        $scope.$on('updateBreakdownTotalPrice', updateBreakdownTotalPrice);

        activate();

        function activate () {
            vm.flowUpgrade = localStorageService.get('flowUpgrade');
            vm.totalAviosAmount = localStorageService.get('totalAviosAmount');
            vm.aviosSummary = localStorageService.get('upgAviosPutMade');
            vm.numberFreeUpgrade = localStorageService.get('numberFreeUpgrade');
            vm.totalAviosAmountFormatted = localStorageService.get('totalAviosAmountFormatted');
        }

        vm.$onChanges = () => {
            vm.summaryText = UpgradingUtilService.getSummaryText(
                vm.totalAviosAmountFormatted,
                vm.totalAviosAmount,
                vm.numberFreeUpgrade
            );
        };

        function updateBreakdownTotalPrice(evt, paymentInfo) {
            const currency = localStorageService.get('currency'),
                aviosInfo = localStorageService.get('selectedAviosDisccount');
            let totalDiscount = 0;
            if (aviosInfo && aviosInfo.totalDiscount) {
                totalDiscount += aviosInfo.totalDiscount.fare;
            }
            if (paymentInfo && paymentInfo.appliedDiscounts && paymentInfo.appliedDiscounts.status) {
                if (paymentInfo.appliedDiscounts.types.VOUCHER) {
                    totalDiscount += paymentInfo.appliedDiscounts.types.VOUCHER.originalDiscount;
                }
            }
            vm.breakdownModel.totalFormatted = CurrencyService.formatPrice(
                currency,
                vm.breakdownModel.total - totalDiscount,
                true
            );
        }
    }
})();
