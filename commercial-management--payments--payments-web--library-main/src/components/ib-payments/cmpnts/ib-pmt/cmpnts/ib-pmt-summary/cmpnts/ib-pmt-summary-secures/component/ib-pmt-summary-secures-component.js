(function () {
    'use strict';


    // Usage: <ib-pmt-summary-secures ancillaries="myCtrl.ancillaries"></ib-pmt-summary-secures>

    // Creates: Booking common secures data summary.

    /* istanbul ignore next */
    angular
        .module('ib-pmt-summary-secures-module')
        .component('ibPmtSummarySecures', {
            controller: 'PmtSummarySecuresController',
            controllerAs: 'PmtSummarySecuresCtrl',
            bindings: {
                ancillaries: '<'
            },
            templateUrl: ['$rootScope', function ($rootScope) {
                return $rootScope.routes.templates + 'ib-pmt-summary-secures-view.html';
            }]

        });
})();