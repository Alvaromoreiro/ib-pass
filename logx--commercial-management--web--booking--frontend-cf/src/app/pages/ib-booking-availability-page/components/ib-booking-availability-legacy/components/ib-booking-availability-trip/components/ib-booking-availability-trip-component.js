(function () {


    // Usage: <ib-booking-availability-trip availability-trip-model = "{}"></ib-booking-availability-trip>
    //
    // Creates: A trip component with the 1 way bind for availability
    //

    /* istanbul ignore next */
    angular.module('ib-booking-availability-trip-module')
        .component('ibBookingAvailabilityTrip', {
            controller: 'BookingAvailabilityTripController',
            controllerAs: 'aTripCtrl',
            bindings: {
                tripModel: '<',
                showAdaptativeMobileFlow: '<',
                currencies: '<',
                originDestinationTitle: '<',
                currentOriginDestinationIndex: '<',
                selectedSlicesLength: '<',
                animationRun: '<',
                showBanner: '<',
                relatedContent: '<',
                multiCity: '<',
                redemption: '<',
                isChecked: '<',
                selectedSliceInfoFamily: '<'
            },
            templateUrl: ['BookingAppConstants', function (BookingAppConstants) {
                return BookingAppConstants.templatesRoute + 'ib-booking-availability-trip-view.html';
            }]
        });

})();