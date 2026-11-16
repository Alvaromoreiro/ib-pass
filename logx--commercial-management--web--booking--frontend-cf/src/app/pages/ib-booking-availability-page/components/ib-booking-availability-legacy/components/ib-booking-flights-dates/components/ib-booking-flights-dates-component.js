(function () {


    /* istanbul ignore next */
    angular
        .module('ib-booking-flights-dates-module')
        .component('ibBookingFlightsDates', {
            controller: 'FlightsDatesController',
            controllerAs: 'fDCtrl',
            bindings: {
                calendarData: '<',
                index: '<',
                selectedCarousel: '<',
                initialSlideIndex:'=?'
            },
            templateUrl: ['BookingAppConstants', function (BookingAppConstants) {
                return BookingAppConstants.templatesRoute + 'ib-booking-flights-dates-view.html';
            }]
        });

})();