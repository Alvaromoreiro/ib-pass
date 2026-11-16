(function () {
    'use strict';

    // Creates: Booking common data dashboard.

    /* istanbul ignore next */
    angular.module('ib-MmB-manage-car-holidays-info-module')
        .component('ibMmbManageCarHolidaysInfo', {
            controller: 'MmBManageCarHolidaysInfoController',
            controllerAs: 'manageCarHolidaysInfoCtrl',
            bindings: {
                model: '='
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-MmB-manage-car-Holidays-info-view.html';
            }]
        });
})();
