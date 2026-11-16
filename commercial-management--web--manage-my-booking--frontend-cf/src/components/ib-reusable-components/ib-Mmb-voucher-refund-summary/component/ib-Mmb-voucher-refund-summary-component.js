(function () {
    'use strict';

    // Usage: <ib-MmB-voucher-refund-summary></ib-MmB-voucher-refund-summary>
    // 
    // Creates: 
    // 
    /* istanbul ignore next */
    angular
        .module('ib-MmB-voucher-refund-summary-module')
        .component('ibMmbVoucherRefundSummary', {
            controller: 'VoucherRefundSummaryController',
            controllerAs: 'voucherRefundSummaryCtrl',
            bindings: {
                model: '=',
                contactInfo: '<',
                voucherPriceInfo: '<',
                isDisruption: '<',
                cashPriceInfo: '<',
                flags: '<'
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-Mmb-voucher-refund-summary-view.html';
            }]
        });

})();
