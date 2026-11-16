(function () {
    'use strict';

    // Usage: <ib-MmB-voucher-refund-breakdown></ib-MmB-voucher-refund-breakdown>
    // 
    // Creates: 
    // 
    /* istanbul ignore next */
    angular
        .module('ib-MmB-voucher-refund-breakdown-module')
        .component('ibMmbVoucherRefundBreakdown', {
            controller: 'VoucherRefundBreakdownController',
            controllerAs: 'voucherRefundBreakdownCtrl',
            bindings: {
                model: '<',
                contactInfo: '<',
                phoneList: '<',
                voucherPriceInfo: '<',
                isDisruption: '<',
                cashPriceInfo: '<',
                flags:'<' +
                    ''
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-Mmb-voucher-refund-breakdown-view.html';
            }]
        });

})();
