(function () {
    'use strict';

    // Usage: <ib-MmB-cash-refund-confirmation></ib-MmB-cash-refund-confirmation>
    // 
    // Creates: 
    // 
    /* istanbul ignore next */
    angular
        .module('ib-Mmb-cash-refund-confirmation-module')
        .component('ibMmbCashRefundConfirmation', {
            controller: 'CashRefundConfirmationController',
            controllerAs: 'cashRefundConfirmationCtrl',
            bindings: {
                phoneList: '<',
                cashData: '<',
                isDisruption: '<'
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-Mmb-cash-refund-confirmtation-view.html';
            }]
        });
})();