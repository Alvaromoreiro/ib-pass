(function () {
    'use strict';

    // Creates: Booking common data dashboard.

    /* istanbul ignore next */
    angular.module('ib-MmB-manage-maximum-to-pay-info-module')
        .component('ibMmbManageMaximumToPayInfo', {
            controller: 'MmBManageMaximumToPayInfoController',
            controllerAs: 'manageMaximumToPayInfoCtrl',
            bindings: {
                model: '='
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-MmB-manage-maximum-to-pay-info-view.html';
            }]
        });
})();
