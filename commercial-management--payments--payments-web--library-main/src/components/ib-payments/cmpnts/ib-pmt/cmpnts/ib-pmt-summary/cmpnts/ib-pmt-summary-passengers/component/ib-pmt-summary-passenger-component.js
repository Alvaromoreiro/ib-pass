(function () {
    'use strict';

    // Usage: <ib-pmt-summary-passenger trip-passenger="myCtrl.trip.passenger"></ib-pmt-summary-passenger>

    // Creates: Booking common passenger data summary.

    /* istanbul ignore next */
    angular.module('ib-pmt-summary-passenger-module')
        .component('ibPmtSummaryPassenger', {
            controller: 'PmtSummaryPassengerController',
            controllerAs: 'PmtSummaryPassengerCtrl',
            bindings: {
                showPassengersName: '<',
                passengers: '<'
            },
            templateUrl: ['$rootScope', function ($rootScope) {
                return $rootScope.routes.templates + 'ib-pmt-summary-passengers-view.html';
            }]
        });
})();