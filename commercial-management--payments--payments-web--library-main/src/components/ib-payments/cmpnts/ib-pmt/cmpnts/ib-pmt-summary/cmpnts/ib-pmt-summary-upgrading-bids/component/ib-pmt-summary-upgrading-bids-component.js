(function () {
    'use strict';

    // Usage: <ib-pmt-summary-upgrading-bids segment="myCtrl.segment"></ib-pmt-summary-upgrading-bids>

    // Creates: Booking common trip data summary.

    /* istanbul ignore next */
    angular.module('ib-pmt-summary-upgrading-bids-module')
        .component('ibPmtSummaryUpgradingBids', {
            controller: 'PmtSummaryUpgradingBidsController',
            controllerAs: 'PmtSummaryUpgradingBidsCtrl',
            bindings: {
                segments: '<',
                bidSegments: '<'
            },
            templateUrl: ['$rootScope', function ($rootScope) {
                return $rootScope.routes.templates + 'ib-pmt-summary-upgrading-bids-view.html';
            }]
        });
})();