(function () {
    'use strict';

    angular
        .module('ib-MmB-voucher-refund-breakdown-module')
        .controller('VoucherRefundBreakdownController', VoucherRefundBreakdownController);

    VoucherRefundBreakdownController.$inject = ['CommonsUtilService'];
    function VoucherRefundBreakdownController(CommonsUtilService) {
        var vm = this;
        vm.$onInit = activate;

        function activate() {
            CommonsUtilService.setTitlePage('MMB_TITLE_DISRUPTION_VOUCHER_REFUND_SUMMARY');
        }
    }
})();
