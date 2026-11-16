(function () {
    'use strict';

    // Usage: <ib-MmB-manage-bundles model="myCtrl.myModel"></ib-MmB-manage-bundles>

    // Creates: Booking common data dashboard.

    /* istanbul ignore next */
    angular.module('ib-MmB-manage-bundles-module')
        .component('ibMmbManageBundles', {
            controller: 'MmbManageBundlesController',
            controllerAs: 'manageBundlesCtrl',
            bindings: {
                model: '=',
                ancillariesInfo: '<'
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-MmB-manage-bundles-view.html';
            }]
        });
})();
