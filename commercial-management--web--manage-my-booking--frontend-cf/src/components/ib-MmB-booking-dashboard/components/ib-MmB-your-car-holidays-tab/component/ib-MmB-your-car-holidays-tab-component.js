(function () {
    'use strict';

    /* istanbul ignore next */
    angular.module('ib-MmB-your-car-holidays-tab-module')
        .component('ibMmbYourCarHolidaysTab', {
            controller: 'MmBYourCarHolidaysTabController',
            controllerAs: 'carHolidaysTabCtrl',
            bindings: {
                model: '='
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-MmB-your-car-holidays-tab-view.html';
            }]
        });
})();
