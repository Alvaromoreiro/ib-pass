(function () {
    'use strict';

    // Usage: <ib-pmt-nav-tab pay-tab-model = "{}" container-form ="{}" selected-tab=""></ib-pmt-nav-tab>
    //
    // Creates: A Tab component with the available payment methods described in payTabModel binding.
    //  The component also receives the container form to check fields validations.
    //

    /* istanbul ignore next */
    angular.module('ib-pmt-nav-tab-module')
        .component('ibPmtNavTab', {
            controller: 'PmtTabNavController',
            controllerAs: 'payTabNavCtrl',
            bindings: {
                containerForm: '=?',
                selectedData: '<',
                contactData: '=',
                paymentInfo: '=',
                requiredFields: '<',
                onHoldInfo: '<',
                showOptions: '<',
                loggedInfo: '<',
                customerCreditCards: '<',
                selectedLoggedCard: '=',
                issuerCountry: '=',
                countriesList: '<',
                statesList: '<',
                prefixList: '<',
                summaryInfoQuota: '<',
                showQuotas: '<',
                submittedTabs: '='
            },
            templateUrl: ['$rootScope', function ($rootScope) {
                return $rootScope.routes.templates + 'ib-pmt-nav-tab-view.html';
            }]
        });
})();