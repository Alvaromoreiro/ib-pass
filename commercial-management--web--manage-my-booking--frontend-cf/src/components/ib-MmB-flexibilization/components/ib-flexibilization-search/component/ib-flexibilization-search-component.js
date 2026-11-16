(function () {
    'use strict';

    // Usage: <ib-flexibilization-search model="myCtrl.myModel"></ib-flexibilization-search>

    /* istanbul ignore next */
    angular.module('ib-flexibilization-search-module')
        .component('ibFlexibilizationSearch', {
            controller: 'IbFlexibilizationSearchController',
            controllerAs: 'flexibilizationSearchCtrl',
            bindings: {
                flights: '<',
                allSegments: '<',
                flags: '<',
                blackOutDates:'<',
                sisterCitiesAvailability: '<'
                
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-flexibilization-search-view.html';
            }]
        });
})();