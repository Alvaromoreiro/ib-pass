(function () {
    'use strict';

    // Creates: Booking common data dashboard.

    /* istanbul ignore next */
    angular.module('ib-MmB-manage-hotel-holidays-info-module')
        .component('ibMmbManageHotelHolidaysInfo', {
            controller: 'MmBManageHotelHolidaysInfoController',
            controllerAs: 'manageHotelHolidaysInfoCtrl',
            bindings: {
                model: '='
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-MmB-manage-hotel-Holidays-info-view.html';
            }]
        });
})();
