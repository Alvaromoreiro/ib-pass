(function () {
    'use strict';

    // Usage: <ib-MmB-manage-widget-info model="myCtrl.myModel"></ib-MmB-manage-widget-info>

    // Creates: Booking common data dashboard.

    /* istanbul ignore next */
    angular.module('ib-MmB-manage-widget-info-module')
        .component('ibMmbManageWidgetInfo', {
            controller: 'MmbManageWidgetInfoController',
            controllerAs: 'manageWidgetInfoCtrl',
            bindings: {
                order: '<',
                infoBooking: '<'
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-MmB-manage-widget-info-view.html';
            }]
        });
})();
