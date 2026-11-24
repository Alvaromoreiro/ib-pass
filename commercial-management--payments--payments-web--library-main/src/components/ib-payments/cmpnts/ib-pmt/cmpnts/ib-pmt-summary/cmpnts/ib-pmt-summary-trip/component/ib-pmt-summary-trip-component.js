(function () {
    'use strict';

    // Usage: <ib-pmt-summary-trip segment="myCtrl.segment"></ib-pmt-summary-trip>

    // Creates: Booking common trip data summary.

    /* istanbul ignore next */
    angular.module('ib-pmt-summary-trip-module')
        .component('ibPmtSummaryTrip', {
            controller: 'PmtSummaryTripController',
            controllerAs: 'PmtSummaryTripCtrl',
            bindings: {
                segment: '<'
            },
            templateUrl: ['$rootScope', function ($rootScope) {
                return $rootScope.routes.templates + 'ib-pmt-summary-trip-view.html';
            }]
        });
})();