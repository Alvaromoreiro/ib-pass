(function () {
    'use strict';

    // Usage: <ib-MmB-manage-flexibility-info model="myCtrl.myModel"></ib-MmB-manage-flexibility-info>

    // Creates: Booking common data dashboard.

    /* istanbul ignore next */
    angular.module('ib-MmB-manage-flexibility-info-module')
        .component('ibMmbManageFlexibilityInfo', {
            controller: 'MmbManageFlexibilityInfoController',
            controllerAs: 'manageFlexibilityInfoCtrl',
            bindings: {
                model: '=',
                ancillariesInfo: '<',
                flags: '<',
                flagsViews:'<',
                tabs: '<',
                orderFlags: '<'
            },

            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-MmB-manage-flexibility-info-view.html';
            }]
        });
})();
