(function () {


    // Usage: <ib-booking-total-price total-price="120€"></ib-booking-total-price>
    //
    // Creates: A HTML struture with the total price info.
    // The binding 'totalPrice' is a value binding with the formatted total price
    // to show directly in the view

    /* istanbul ignore next */
    angular.module('ib-booking-total-price-module')
        .component('ibBookingTotalPrice', {
            controller: 'BookingTotalPriceController',
            controllerAs: 'totalPriceCtrl',
            bindings: {
                totalPrice: '=',
                originalTotalPrice: '<',
                oldPriceInfo: '=',
                somethingToPay: '<',
                paymentMode: '@',
                checkTermsConditions: '=?',
                containerForm: '=?',
                aviosInfo: '=',
                onHoldInfo: '<',
                conditionsText: '<',
                totalPriceText: '<',
                paypalButton: '<',
                showRegularButton: '<',
                changePassengers: '<',
                isChecked: '<'
            },
            templateUrl: ['BookingAppConstants', function (BookingAppConstants) {
                return BookingAppConstants.templatesRoute + 'ib-booking-total-price-view.html';
            }]
        });
})();
