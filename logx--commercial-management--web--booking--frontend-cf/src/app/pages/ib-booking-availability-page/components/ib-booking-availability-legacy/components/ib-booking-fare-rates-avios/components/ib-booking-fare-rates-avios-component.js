(function () {


    // Usage: <ib-booking-fare-rates-avios></ib-booking-fare-rates-avios>
    // Creates: The component shows diferents fares rates for a trip and allows the user to choose a rate (Avios&Money)

    angular.module('ib-booking-fare-rates-avios-module')
        .component('ibBookingFareRatesAvios', {
            controller: 'BookingFareRatesAviosController',
            controllerAs: 'fareRatesAviosCtrl',
            bindings: {
                fareRate: '<',
                customerData: '<',
                totalPrice: '=',
                withoutAviosMoney: '<'
            },
            templateUrl: ['BookingAppConstants', function (BookingAppConstants) {
                return BookingAppConstants.templatesRoute + 'ib-booking-fare-rates-avios-view.html';
            }]
        });

})();