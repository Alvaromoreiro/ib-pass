(function () {
    'use strict';

    // Usage: <ib-pmt-credit-card-tab creditCardFormModel = {}></ib-pmt-credit-card-tab>
    //
    // Creates: A HTML form struture with six inputs. One of them is another component inside
    // thisone (credit card date). Checks the form and set it to valid or invalid depends on
    // their input info. The expected binding ("") set the credit card type to know the correctly validation
    // and type of payment for that credit card.

    /* istanbul ignore next */
    angular.module('ib-pmt-credit-card-tab-module')
        .component('ibPmtCreditCardTab', {
            controller: 'IbPmtCreditCardTabController',
            controllerAs: 'creditCardTabCtrl',
            bindings: {
                creditCardFormModel: '=',
                containerForm: '=',
                selectedData: '=',
                contactData: '=',
                issuerCountry: '=',
                countriesList: '<',
                statesList: '<',
                loggedInfo: '<',
                customerCreditCards: '<',
                selectedPaymentInfo: '=',
                selectedLoggedCard: '=',
                isOnHoldOrder: '<',
                requiredAdditionalFields: '<',
                summaryInfoQuota: '<',
                submittedTab: '='
            },
            templateUrl: ['$rootScope', function ($rootScope) {
                return $rootScope.routes.templates + 'ib-pmt-credit-card-tab-view.html';
            }]
        });
})();