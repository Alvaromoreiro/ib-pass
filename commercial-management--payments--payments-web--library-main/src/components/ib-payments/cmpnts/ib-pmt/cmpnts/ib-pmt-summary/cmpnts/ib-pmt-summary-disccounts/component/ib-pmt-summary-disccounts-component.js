(function () {
    'use strict';

    // Creates: Booking common disccounts data summary.

    angular.module('ib-pmt-summary-disccounts-module')
        .component('ibPmtSummaryDisccounts', {
            controller: 'PmtSummaryDisccountsController',
            controllerAs: 'PmtSumDisCtrl',
            bindings: {
                disccountInfo: '=',
                voucherInfo: '=?',
                summaryInfo: '=',
                flow: '=',
                obInfo: '=',
                showName: '=',
                discountsAppliedIssue: '='
            },
            templateUrl: ['$rootScope', function ($rootScope) {
                return $rootScope.routes.templates + 'ib-pmt-summary-disccounts-view.html';
            }]
        });
})();