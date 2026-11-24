(function () {
    'use strict';

    // Usage: <ib-pmt-total-price total-price="120€"></ib-pmt-total-price>
    //
    // Creates: A HTML struture with the total price info.
    // The binding 'totalPrice' is a value binding with the formatted total price
    // to show directly in the view

    /* istanbul ignore next */
    angular.module('ib-pmt-total-price-module')
        .component('ibPmtTotalPrice', {
            controller: 'PmtTotalPriceController',
            controllerAs: 'totalPriceCtrl',
            bindings: {
                priceInfo: '<',
                somethingToPay: '<',
                paymentMode: '@',
                checkTermsConditions: '=?',
                containerForm: '=?',
                co2MarkInfo: '<',
                aviosInfo: '=',
                onHoldInfo: '<',
                conditionsText: '<',
                totalPriceText: '<',
                relatedContent: '<',
                taxInfo: '<',
                paypalButton: '<',
                showExternalButton: '<',
                showRegularButton: '<',
                isChecked: '<',
                obPoints: '<',
                showObpoints: '<',
                noDiscountObPrice: '<',
                showDiscount: '<',
                aviosToEarn: '<',
                elitePointsToEarn: '<',
                selectedPayment: '=',
                indexSelectedTab: '<',
                donationEnabled: '<',
                dccSelected: '<',
                currentDccData: '<'
            },
            templateUrl: ['$rootScope', function ($rootScope) {
                return $rootScope.routes.templates + 'ib-pmt-total-price-view.html';
            }]
        });
})();