(function () {
    'use strict';

    // Usage: <ib-MmB-manage-transfer-widget-info model="myCtrl.myModel"></ib-MmB-manage-widget-info>

    // Creates: Booking common data dashboard.

    /* istanbul ignore next */
    angular.module('ib-MmB-manage-transfer-widget-info-module')
        .component('ibMmbTransferManageWidgetInfo', {
            controller: 'MmbManageTransferWidgetInfoController',
            controllerAs: 'manageTransferWidgetInfoCtrl',
            bindings: {
                order: '<',
                infoBooking: '<'
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-MmB-manage-transfer-widget-info-view.html';
            }]
        });
})();
