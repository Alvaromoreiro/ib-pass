(function () {
    'use strict';

    angular
        .module('ib-MmB-refund-information-module')
        .controller('RefundInformationController', RefundInformationController);

    RefundInformationController.$inject = ['localStorageService'];
    function RefundInformationController(localStorageService) {
        var vm = this;
        const refundFeesText = 'MMB_REFUNDS_INFORMATION_BOX_YOUR_REFUND_DOES_NOT_INCLUDE_CONDITION_2';
        const refundFees = localStorageService.get('refundFees');
        vm.$onInit = activate;

        function activate() {
            vm.flags = localStorageService.get('orderFlags');

            vm.includedInRefund = [
                'MMB_REFUNDS_INFORMATION_BOX_YOUR_REFUND_INCLUDES_CONDITION_1',
                'MMB_REFUNDS_INFORMATION_BOX_YOUR_REFUND_INCLUDES_CONDITION_2',
                'MMB_REFUNDS_INFORMATION_BOX_YOUR_REFUND_INCLUDES_CONDITION_3'
            ];

            vm.notIncludedInRefund = [
                'MMB_REFUNDS_INFORMATION_BOX_YOUR_REFUND_DOES_NOT_INCLUDE_CONDITION_1',
                'MMB_REFUNDS_INFORMATION_BOX_YOUR_REFUND_DOES_NOT_INCLUDE_CONDITION_2',
                'MMB_REFUNDS_INFORMATION_BOX_YOUR_REFUND_DOES_NOT_INCLUDE_CONDITION_3',
                'MMB_REFUNDS_INFORMATION_BOX_YOUR_REFUND_DOES_NOT_INCLUDE_CONDITION_4',
                'MMB_REFUNDS_INFORMATION_BOX_YOUR_REFUND_DOES_NOT_INCLUDE_CONDITION_5',
                'MMB_REFUNDS_INFORMATION_BOX_YOUR_REFUND_DOES_NOT_INCLUDE_CONDITION_6',
                'MMB_REFUNDS_INFORMATION_BOX_YOUR_REFUND_DOES_NOT_INCLUDE_CONDITION_7'
            ];

            if(!vm.flags?.refundVoucherSection80) {
                vm.includedInRefund.push('MMB_REFUNDS_INFORMATION_BOX_YOUR_REFUND_INCLUDES_CONDITION_FLEX');
            }
            //Condition for refundFees attribute
            if(refundFees) {
                vm.includedInRefund.push(refundFeesText);
                vm.notIncludedInRefund = vm.notIncludedInRefund.filter(e => e !== refundFeesText);
            }
        }
    }
})();
