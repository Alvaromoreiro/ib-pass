(function () {
    'use strict';

    // Usage: <ib-MmB-manage-insurance-info model="myCtrl.myModel"></ib-MmB-manage-insurance-info>

    // Creates: Booking common data dashboard.

    /* istanbul ignore next */
    angular.module('ib-MmB-manage-insurance-info-module')
        .component('ibMmbManageInsuranceInfo', {
            controller: 'MmbManageInsuranceInfoController',
            controllerAs: 'manageInsuranceInfoCtrl',
            bindings: {
                model: '=',
                passengers: '<'
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-MmB-manage-insurance-info-view.html';
            }]
        });
})();
