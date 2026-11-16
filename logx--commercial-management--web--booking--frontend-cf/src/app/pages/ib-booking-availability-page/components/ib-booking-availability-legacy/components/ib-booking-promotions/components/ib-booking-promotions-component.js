(function () {


    // Usage: <ib-booking-promotions></ib-booking-promotions>

    angular.module('ib-booking-promotions-module')
        .component('ibBookingPromotions', {
            controller: 'BookingPromotionsController',
            controllerAs: 'promotionsCtrl',
            bindings: {
                totalPrice: '<'            },
            templateUrl: ['BookingAppConstants', function (BookingAppConstants) {
                return BookingAppConstants.templatesRoute + 'ib-booking-promotions-view.html';
            }]
        });

})();