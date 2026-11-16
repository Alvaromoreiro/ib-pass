(function () {
    'use strict';

    // Usage: <ib-travel_addons></ib-travel-addons>
    // Creates: A estructura with accordion groups for show information of hotels, insurances and rent of cars.
    
    /* istanbul ignore next */
    angular.module('ib-travel-addons-module')
        .component('ibTravelAddons', {
            controller: 'TravelAddonsController',
            controllerAs: 'traAddCtrl',
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-travel-addons-view.html';
            }]
        });
})();

