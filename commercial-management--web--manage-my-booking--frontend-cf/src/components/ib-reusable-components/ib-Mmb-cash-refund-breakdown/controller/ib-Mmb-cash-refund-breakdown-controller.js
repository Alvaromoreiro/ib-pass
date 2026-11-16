(function () {
    'use strict';

    angular
        .module('ib-MmB-cash-refund-breakdown-module')
        .controller('CashRefundBreakdownController', CashRefundBreakdownController);

    CashRefundBreakdownController.$inject = [];
    function CashRefundBreakdownController() {
        var vm = this;
        vm.$onInit = activate;

        function activate() {
        }
    }
})();