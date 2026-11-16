(function () {


    // Usage: <ib-booking-metasearch-passengers ></ib-booking-metasearch-passengers>
    //
    // Creates:
    //

    /* istanbul ignore next */
    angular.module('ib-booking-metasearch-passengers-module')
        .component('ibBookingMetasearchPassengers', {
            controller: 'BookingMetasearchPassengersController',
            controllerAs: 'metasearchPassengersCtrl',
            bindings: {
                passengersCount: '<',
                errorMessage : '<',
                specialDiscounts:'='
            },
            templateUrl: ['BookingAppConstants', function (BookingAppConstants) {
                return BookingAppConstants.templatesRoute + 'ib-booking-metasearch-passengers-view.html';
            }]
        });

})();