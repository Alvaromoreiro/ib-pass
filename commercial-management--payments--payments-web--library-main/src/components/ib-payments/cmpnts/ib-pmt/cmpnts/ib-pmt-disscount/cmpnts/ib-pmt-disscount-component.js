(function () {
    'use strict';

    // Usage: <ib-pmt-disscount ></ib-pmt-disscount>
    // 
    // Creates: A HTML struture with the info of the trip and teh info of the passengers who bought the ticket. 
    // The binding 'totalPrice' is a value binding with the formatted total price to show directly in the view
    // The binding 'trips'contains the trip information.
    // The binding 'passengers' Contains the information of all the passengers of the trip.

    /* istanbul ignore next */
    angular.module('ib-pmt-disscount-module')
        .component('ibPmtDisscount', {
            controller: 'IbPmtDisscountController',
            controllerAs: 'pmtDisscountCtrl',
            bindings: {
                disscounts: '=',
                appliedDiscounts: '=',
                loggedInfo: '<',
                currency: '=',
                selectedData: '=',
                showOptions: '=',
                paymentInfo: '=',
                loadingVoucher: '<',
                creditCards: '<',
                summaryInfo: '=',
                paymentMethods: '<',
                paymentId: '<',
                loadingIframe: '=',
                formSubmitted: '='
            },
            templateUrl: ['$rootScope', function ($rootScope) {
                return $rootScope.routes.templates + 'ib-pmt-disscount-view.html';
            }]
        });
})();