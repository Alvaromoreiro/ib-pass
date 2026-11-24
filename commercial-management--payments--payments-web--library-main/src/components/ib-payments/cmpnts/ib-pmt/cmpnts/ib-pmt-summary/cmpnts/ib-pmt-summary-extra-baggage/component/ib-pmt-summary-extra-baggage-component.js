(function () {
    'use strict';


    // Usage: <ib-pmt-summary-extra-baggage ancillaries="myCtrl.ancillaries"></ib-pmt-summary-extra-baggage>

    // Creates: Booking common extra-baggage data summary.

    /* istanbul ignore next */
    angular
        .module('ib-pmt-summary-extra-baggage-module')
        .component('ibPmtSummaryExtraBaggage', {
            controller: 'PmtSummaryExtraBaggageController',
            controllerAs: 'PmtSummaryExtraBaggageCtrl',
            bindings: {
                ancillaries: '<'
            },
            templateUrl: ['$rootScope', function ($rootScope) {
                return $rootScope.routes.templates + 'ib-pmt-summary-extra-baggage-view.html';
            }]

        });
})();