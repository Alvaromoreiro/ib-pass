(function () {


    // Usage: <ib-booking-fare-details fare-info is-selected></ib-booking-fare-details>
    // Creates: The component shows diferents fares for a trip and allows the user to choose a fare


    /* istanbul ignore next */
    angular.module('ib-booking-fare-details-module')
        .component('ibBookingFareDetails', {
            controller: 'BookingFareDetailsController',
            controllerAs: 'fareDetailsCtrl',
            bindings: {
                fareInfo: '<',
                isSelected: '<',
                fareIndex: '<',
                currencies: '<',
                selectedFare: '=',
                selectedCabin: '=',
                selectedSliceIndex: '<',
                selectedSegmentIndex: '<',
                originDestinationId: '<',
                metaSearchInfo: '<',
                recommendedOfferId: '<',
                multiCity: '<',
                redemption: '<',
                rateHighlighted: '<',
                isLastFare: '<',
                flightRatio: '<',
                marketingCarrier: '<'
            },
            templateUrl: ['BookingAppConstants', function (BookingAppConstants) {
                return BookingAppConstants.templatesRoute + 'ib-booking-fare-details-view.html';
            }]
        });

})();
