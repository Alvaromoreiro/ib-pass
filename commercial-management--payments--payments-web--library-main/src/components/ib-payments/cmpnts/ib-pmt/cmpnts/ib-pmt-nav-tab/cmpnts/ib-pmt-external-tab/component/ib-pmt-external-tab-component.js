(function () {
    'use strict';

    // Usage: <ib-pmt-external-tab></ib-payment-external-tab>
    //
    // Creates: A HTML structure with the logo and text of the external payment provider.

    /* istanbul ignore next */
    angular.module('ib-pmt-external-tab-module')
        .component('ibPmtExternalTab', {
            controller: 'PmtExternalTabController',
            controllerAs: 'externalTabPmtCtrl',
            bindings: {
                externalPaymentInfo: '<',
                paymentInfo: '=',
                containerForm: '=',
                statesList: '<',
                submittedTab: '='
            }, templateUrl: ['$rootScope', function ($rootScope) {
                return $rootScope.routes.templates + 'ib-pmt-external-tab-view.html';
            }]
        });
})();