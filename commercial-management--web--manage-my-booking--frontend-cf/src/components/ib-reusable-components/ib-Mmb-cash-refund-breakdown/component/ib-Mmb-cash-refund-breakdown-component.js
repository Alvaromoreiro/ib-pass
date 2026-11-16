(function () {
    'use strict';

    // Usage: <ib-MmB-cash-refund-breakdown></ib-MmB-cash-refund-breakdown>
    // 
    // Creates: 
    // 
    /* istanbul ignore next */
    angular
        .module('ib-MmB-cash-refund-breakdown-module')
        .component('ibMmbCashRefundBreakdown', {
            controller: 'CashRefundBreakdownController',
            controllerAs: 'cashRefundBreakdownCtrl',
            bindings: {
                model: '<',
                contactInfo: '<',
                phoneList: '<',
                voucherPriceInfo: '<',
                isDisruption: '<'
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-Mmb-cash-refund-breakdown-view.html';
            }]
        });

})();