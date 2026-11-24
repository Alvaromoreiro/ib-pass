(function () {
    'use strict';

    // Usage: <ib-iberia-pay-credit-card-number creditCardFormModel = {}></ib-iberia-pay-credit-card-number>
    //
    // Creates: A HTML form struture with six inputs. One of them is another component inside
    // thisone (credit card date). Checks the form and set it to valid or invalid depends on
    // their input info. The expected binding ("") set the credit card type to know the correctly validation
    // and type of payment for that credit card.

    /* istanbul ignore next */
    angular.module('ib-iberia-pay-credit-card-number-module')
        .component('ibIberiaPayCreditCardNumber', {
            controller: 'ibIberiaPayCreditCardNumberController',
            controllerAs: 'iberiaPayCreditCardNumberCtr',
            bindings: {
                urlIframeNumber: '<',
                vaultId: '<',
                errorCardNumberIbPay: '<'
            },
            templateUrl: ['$rootScope', function ($rootScope) {
                return $rootScope.routes.templates + 'ib-iberia-pay-credit-card-number-view.html';
            }]
        });
})();