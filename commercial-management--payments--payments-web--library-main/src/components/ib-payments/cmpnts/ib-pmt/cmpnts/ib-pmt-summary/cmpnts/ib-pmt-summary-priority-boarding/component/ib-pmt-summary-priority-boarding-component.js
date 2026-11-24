(function () {
    'use strict';
    // Usage: <ib-pmt-summary-priority-boarding></ib-pmt-summary-priority-boarding>

    // Creates: Booking common priority-boarding data summary.

    /* istanbul ignore next */
    angular.module('ib-pmt-summary-priority-boarding-module')
        .component('ibPmtSummaryPriorityBoarding', {
            controller: 'PmtSummaryPriorityBoardingController',
            controllerAs: 'PmtSummaryPriorityBoardingCtrl',
            bindings: {
                model: '<'
            },
            templateUrl: ['$rootScope', function ($rootScope) {
                return $rootScope.routes.templates + 'ib-pmt-summary-priority-boarding-view.html';
            }]
        });
})();