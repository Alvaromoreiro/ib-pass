(function () {
    'use strict';

    /* istanbul ignore next */
    angular.module('ib-MmB-your-hotel-holidays-tab-module')
        .component('ibMmbYourHotelHolidaysTab', {
            controller: 'MmBYourHotelHolidaysTabController',
            controllerAs: 'hotelHolidaysTabCtrl',
            bindings: {
                model: '='
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-MmB-your-hotel-holidays-tab-view.html';
            }]
        });
})();
