(function () {
    'use strict';

    // Usage: <ib-MmB-cash-refund></ib-MmB-cash-refund>
    // 
    // Creates: 
    // 
    /* istanbul ignore next */
    angular
        .module('ib-MmB-cash-refund-module')
        .component('ibMmbCashRefund', {
            controller: 'CashRefundController',
            controllerAs: 'cashRefundCtrl',
            bindings: {
                summaryModel: '<',
                priceInfo: '<',
                available: '<',
                isDisruption: '<',
                isVoluntary: '<',
                cashPriceInfo: '<',
                voucherPriceInfo: '<',
                flags:'<'
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-Mmb-cash-refund-view.html';
            }]
        });

})();