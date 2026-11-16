(function () {
    'use strict';

    // Usage: <ib-MmB-manage-flights-info model="myCtrl.myModel"></ib-MmB-manage-flights-info>

    // Creates: Booking common data dashboard.

    /* istanbul ignore next */
    angular.module('ib-MmB-manage-flights-info-module')
        .component('ibMmbManageFlightsInfo', {
            controller: 'MmBManageFlightsInfoController',
            controllerAs: 'manageFlightsInfoCtrl',
            bindings: {
                model: '=',
                flags: '<'
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-MmB-manage-flights-info-view.html';
            }]
        });
})();
