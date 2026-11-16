(function () {
    'use strict';

    // Usage: <ib-MmB-hotel-card></ib-MmB-hotel-card>
    //
    // Creates:
    //
    /* istanbul ignore next */
    angular.module('ib-MmB-hotel-card-module')
        .component('ibMmbHotelCard', {
            controller: 'MmBHotelController',
            controllerAs: 'hotelCardCtrl',
            bindings: {
                model: '=',
                index: '='
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-MmB-hotel-card-view.html';
            }]
        });
})();
