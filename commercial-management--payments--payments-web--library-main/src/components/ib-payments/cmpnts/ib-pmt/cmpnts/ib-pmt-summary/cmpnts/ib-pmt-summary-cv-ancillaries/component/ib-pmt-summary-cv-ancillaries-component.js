(function () {
    'use strict';


    // Usage: <ib-pmt-summary-cv-ancillaries ancillaries="myCtrl.ancillaries"></ib-pmt-summary-cv-ancillaries>

    // Creates:

    /* istanbul ignore next */
    angular
        .module('ib-pmt-summary-cv-ancillaries-module')
        .component('ibPmtSummaryCvAncillaries', {
            controller: 'PmtSummaryCvAncillariesController',
            controllerAs: 'PmtSummaryCvAnciCtrl',
            bindings: {
                ancillariesRefund: '<'
            },
            templateUrl: ['$rootScope', function ($rootScope) {
                return $rootScope.routes.templates + 'ib-pmt-summary-cv-ancillaries-view.html';
            }]

        });
})();