(function () {
    'use strict';

    // Usage: <ib-pmt-summary trips="" passengers="" total-price=""></ib-pmt-summary>
    // 
    // Creates: A HTML struture with the info of the trip and teh info of the passengers who bought the ticket. 
    // The binding 'totalPrice' is a value binding with the formatted total price to show directly in the view
    // The binding 'trips'contains the trip information.
    // The binding 'passengers' Contains the information of all the passengers of the trip.

    /* istanbul ignore next */
    angular.module('ib-pmt-summary-module')
        .component('ibPmtSummary', {
            controller: 'PmtSummaryController',
            controllerAs: 'PmtsummaryCtrl',
            bindings: {
                summaryInfo: '<',
                totalPrice: '<',
                appliedDiscounts: '<',
                showPassengersName: '<',
                onHoldInfo: '<',
                onHoldPayment: '<',
                isOnHold: '<',
                onHoldType: '<',
                membershipData: '<',
                donationEnabled: '<',
                dccSelected: '<',
                currentDccData: '<'
            },
            templateUrl: ['$rootScope', function ($rootScope) {
                return $rootScope.routes.templates + 'ib-pmt-summary-view.html';
            }]
        });
})();