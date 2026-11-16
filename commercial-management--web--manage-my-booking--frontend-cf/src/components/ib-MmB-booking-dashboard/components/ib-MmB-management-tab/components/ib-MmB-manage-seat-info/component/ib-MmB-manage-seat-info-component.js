(function () {
    'use strict';

    // Usage: <ib-MmB-manage-seat-info model="myCtrl.myModel"></ib-MmB-manage-seat-info>

    // Creates: Booking common data dashboard.

    /* istanbul ignore next */
    angular.module('ib-MmB-manage-seat-info-module')
        .component('ibMmbManageSeatInfo', {
            controller: 'MmbManageSeatInfoController',
            controllerAs: 'manageSeatInfoCtrl',
            bindings: {
                model: '=',
                ancillariesInfo: '<',
                orderItems: '<',
                seatConditions: '<',
                canceledSeatsFlag: '<'
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-MmB-manage-seat-info-view.html';
            }]
        });
})();
