(function () {
    'use strict';

    // Creates: Booking common data dashboard.

    /* istanbul ignore next */
    angular.module('ib-MmB-manage-purchase-breakdown-info-module')
        .component('ibMmbManagePurchaseBreakdownInfo', {
            controller: 'MmBManagePurchaseBreakdownInfoController',
            controllerAs: 'managePurchaseBreakdownInfoCtrl',
            bindings: {
                model: '='
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-MmB-manage-purchase-breakdown-info-view.html';
            }]
        });
})();
