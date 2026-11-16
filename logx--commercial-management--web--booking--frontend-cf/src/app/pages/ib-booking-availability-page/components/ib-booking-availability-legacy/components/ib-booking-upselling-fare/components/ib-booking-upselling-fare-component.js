(function () {


    // Usage: <ib-booking-upselling-fare ></ib-booking-upselling-fare>
    //
    //
    /* istanbul ignore next */
    angular.module('ib-booking-upselling-fare-module')
        .component('ibBookingUpsellingFare', {
            controller: 'BookingUpsellingFareController',
            controllerAs: 'ibUpsellingFareCtrl',
            bindings: {
                selectedInfo: '<'
            },
            templateUrl: ['BookingAppConstants', '$attrs', '$parse', function (BookingAppConstants, $attrs, $parse) {
                return BookingAppConstants.templatesRoute + ($attrs.template || 'ib-booking-upselling-fare-view.html');
            }]
        });

})();