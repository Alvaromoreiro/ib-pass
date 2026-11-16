(function () {
    'use strict';

    // Usage: <ib-MmB-manage-baggage-info model="myCtrl.myModel"></ib-MmB-manage-baggage-info>

    // Creates: Booking common data dashboard.

    /* istanbul ignore next */
    angular.module('ib-MmB-manage-baggage-info-module')
        .component('ibMmbManageBaggageInfo', {
            controller: 'MmbManageBaggageInfoController',
            controllerAs: 'manageBaggageInfoCtrl',
            bindings: {
                model: '=',
                ancillariesInfo: '<'
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-MmB-manage-baggage-info-view.html';
            }]
        });
})();
