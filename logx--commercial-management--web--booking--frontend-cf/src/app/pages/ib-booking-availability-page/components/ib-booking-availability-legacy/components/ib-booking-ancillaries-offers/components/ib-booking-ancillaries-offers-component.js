(function () {


    // Usage: <ib-booking-anc-offers><ib-booking-anc-offers>
    //
    //
    /* istanbul ignore next */
    angular.module('ib-booking-ancillaries-offers-module')
        .component('ibBookingAncillariesOffers', {
            controller: 'BookingAncOffersController',
            controllerAs: 'bookingAncOffersCtrl',
            bindings: {
            },
            templateUrl: ['BookingAppConstants', '$attrs', '$parse', function (BookingAppConstants, $attrs, $parse) {
                return BookingAppConstants.templatesRoute + ($attrs.template || 'ib-booking-ancillaries-offers-view.html');
            }]
        });

})();