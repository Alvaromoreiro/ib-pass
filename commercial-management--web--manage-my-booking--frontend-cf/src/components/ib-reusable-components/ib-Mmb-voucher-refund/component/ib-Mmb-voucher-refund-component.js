(function () {
    'use strict';

    // Usage: <ib-MmB-voucher-refund></ib-MmB-voucher-refund>
    // 
    // Creates: 
    // 
    /* istanbul ignore next */
    angular
        .module('ib-MmB-voucher-refund-module')
        .component('ibMmbVoucherRefund', {
            controller: 'VoucherRefundController',
            controllerAs: 'voucherRefundCtrl',
            bindings: {
                contactData: '<',
                summaryModel: '<',
                voucherPriceInfo: '<',
                isDisruption: '<',
                cashPriceInfo: '<',
                flexibilityPercentage: '<'
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-Mmb-voucher-refund-view.html';
            }]
        });

})();
