(function () {
    'use strict';

    // Usage: <ib-iberia-pay-cvv-number creditCardFormModel = {}></ib-iberia-pay-cvv-numbe>
    //
    // Creates: A HTML form struture with six inputs. One of them is another component inside
    // thisone (credit card date). Checks the form and set it to valid or invalid depends on
    // their input info. The expected binding ("") set the credit card type to know the correctly validation
    // and type of payment for that credit card.

    /* istanbul ignore next */
    angular.module('ib-iberia-pay-cvv-number-module')
        .component('ibIberiaPayCvvNumber', {
            controller: 'ibIberiaPayCvvNumberController',
            controllerAs: 'ibIberiaPayCvvNumberCtr',
            bindings: {
                urlIframeCvv: '<',
                vaultId: '<',
                errorCvvIbPay: '=',
                disabledCvv: '<'
            },
            templateUrl: ['$rootScope', function ($rootScope) {
                return $rootScope.routes.templates + 'ib-iberia-pay-cvv-number-view.html';
            }]
        });
})();