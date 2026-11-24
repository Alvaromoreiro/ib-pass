(function () {
    'use strict';

    // Usage: <ib-pmt-generic-credit-card-fields creditCardFormModel = {}></ib-pmt-generic-credit-card-fields>
    //
    // Creates: A HTML form struture with six inputs. One of them is another component inside
    // thisone (credit card date). Checks the form and set it to valid or invalid depends on
    // their input info. The expected binding ('') set the credit card type to know the correctly validation
    // and type of payment for that credit card.

    /* istanbul ignore next */
    angular.module('ib-pmt-generic-credit-card-fields-module')
        .component('ibPmtGenericCreditCardFields', {
            controller: 'IbPmtGenericCreditCardFieldsController',
            controllerAs: 'genCreditCardFieldsCtrl',
            bindings: {
                creditCardFormModel: '=',
                containerForm: '=',
                selectedData: '=',
                contactData: '=',
                issuerCountry: '=',
                loggedInfo: '<',
                countriesList: '<',
                statesList: '<',
                isOnHoldOrder: '<',
                requiredAdditionalFields: '<',
                summaryInfoQuota: '<',
                customerCreditCards: '<',
                submittedTab: '='
            },
            templateUrl: ['$rootScope', function ($rootScope) {
                return $rootScope.routes.templates + 'ib-pmt-gcc-fields-view.html';
            }]
        });
})();