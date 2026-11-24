(function () {
    'use strict';

    // Usage: <ib-pmt-summary-type-payment payment-type="myCtrl.paymentType"></ib-pmt-summary-type-payment>

    // Creates: Booking common type-payment data summary.

    /* istanbul ignore next */
    angular.module('ib-pmt-summary-type-payment-module')
        .component('ibPmtSummaryTypePayment', {
            controller: 'PmtSummaryTypePaymentController',
            controllerAs: 'PmtSummaryTypePaymentCtrl',
            bindings: {
                paymentType: '<'
            },
            templateUrl: ['$rootScope', function ($rootScope) {
                return $rootScope.routes.templates + 'ib-pmt-summary-type-payment-view.html';
            }]
        });
})();