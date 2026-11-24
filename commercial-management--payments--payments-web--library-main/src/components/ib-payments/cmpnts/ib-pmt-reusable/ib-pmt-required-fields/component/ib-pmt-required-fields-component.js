(function () {
    'use strict';

    // Usage: <ib-pmt-required-fields required-fields = "" container-form= "" ></ib-pmt-required-fields>
    //
    // Creates: A HTML form struture with dinamic inputs.

    /* istanbul ignore next */
    angular.module('ib-pmt-required-fields-module')
        .component('ibPmtRequiredFields', {
            controller: 'IbPmtRequiredFieldsController',
            controllerAs: 'reqFieldsCtrl',
            bindings: {
                requiredFields: '=',
                containerForm: '=',
                paymentCardCode: '<',
                selectedCard: '<',
                summaryInfoQuota: '=',
                submittedTab: '=',
                showQuotasCombo: '<'
            },
            templateUrl: ['$rootScope', function ($rootScope) {
                return $rootScope.routes.templates + 'ib-pmt-required-fields-view.html';
            }]
        });
})();