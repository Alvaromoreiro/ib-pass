(function () {
    'use strict';

    // Usage: <ib-pmt-summary-other order-fees="myCtrl.summaryInfo.orderFees"></ib-pmt-summary-other>

    // Creates: Booking common other data summary.

    /* istanbul ignore next */
    angular.module('ib-pmt-summary-other-module')
        .component('ibPmtSummaryOther', {
            controller: 'PmtSummaryOtherController',
            controllerAs: 'PmtSummaryOtherCtrl',
            bindings: {
                orderFees: '<'
            },
            templateUrl: ['$rootScope', function ($rootScope) {
                return $rootScope.routes.templates + 'ib-pmt-summary-other-view.html';
            }]
        });
})();