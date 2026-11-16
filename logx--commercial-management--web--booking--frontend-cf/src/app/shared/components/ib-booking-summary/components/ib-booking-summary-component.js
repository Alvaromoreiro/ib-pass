(function () {


    // Usage: <ib-booking-summary trips="" passengers="" total-price=""></ib-booking-summary>
    //
    // Creates: A HTML struture with the info of the trip and teh info of the passengers who bought the ticket.
    // The binding 'totalPrice' is a value binding with the formatted total price to show directly in the view
    // The binding 'trips'contains the trip information.
    // The binding 'passengers' Contains the information of all the passengers of the trip.

    /* istanbul ignore next */
    angular.module('ib-booking-summary-module')
        .component('ibBookingSummary', {
            controller: 'BookingSummaryController',
            controllerAs: 'summaryCtrl',
            bindings: {
                trips: '<',
                passengers: '<',
                ancillaries: '<',
                passengersInsurance: '<',
                appliedDiscounts: '=',
                totalPrice: '=',
                otherFees: '<',
                onHoldInfo: '=',
                showPassengersName: '=',
                onHoldPayment: '<',
                isOnHold: '<',
                onHoldType: '<',
                paymentType: '<'
            },
            templateUrl: ['BookingAppConstants', function (BookingAppConstants) {
                return BookingAppConstants.templatesRoute + 'ib-booking-summary-view.html';
            }]
        });
})();