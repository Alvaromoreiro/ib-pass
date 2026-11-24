(function () {
    'use strict';

    // Usage: <ib-pmt-summary-seats ancillaries="myCtrl.ancillaries"></ib-pmt-summary-seats>

    // Creates: Booking common seats data summary.

    /* istanbul ignore next */
    angular.module('ib-pmt-summary-seats-module')
        .component('ibPmtSummarySeats', {
            controller: 'PmtSummarySeatsController',
            controllerAs: 'PmtSummarySeatsCtrl',
            bindings: {
                ancillaries: '<'
            },
            templateUrl: ['$rootScope', function ($rootScope) {
                return $rootScope.routes.templates + 'ib-pmt-summary-seats-view.html';
            }]
        });
})();