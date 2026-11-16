(function () {
    'use strict';

    // Usage: <ib-MmB-voucher-refund-confirmation></ib-MmB-voucher-refund-confirmation>
    // 
    // Creates: 
    // 
    /* istanbul ignore next */
    angular
        .module('ib-Mmb-voucher-refund-confirmation-module')
        .component('ibMmbVoucherRefundConfirmation', {
            controller: 'VoucherRefundConfirmationController',
            controllerAs: 'voucherRefundConfirmationCtrl',
            bindings: {
                model: '<',
                phoneList: '<',
                voucherData: '<',
                isDisruption: '<'
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-Mmb-voucher-refund-confirmation-view.html';
            }]
        });
})();