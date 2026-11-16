(function () {


    // Usage: <ib-booking-recalculate-price ></ib-booking-recalculate-price>
    //
    // Creates:
    //

    /* istanbul ignore next */
    angular.module('ib-booking-recalculate-price-module')
        .component('ibBookingRecalculatePrice', {
            controller: 'BookingRecalculatePriceController',
            controllerAs: 'recalculatePriceCtrl',
            bindings: {
                conditionsText: '<'
            },
            templateUrl: ['BookingAppConstants', function (BookingAppConstants) {
                return BookingAppConstants.templatesRoute + 'ib-booking-recalculate-price-view.html';
            }]
        });

})();