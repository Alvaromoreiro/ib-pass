(function () {


    angular
        .module('ib-booking-redemption-coupons-module')
        .component('ibBookingRedemptionCoupons', {
            controller: 'RedemptionCouponsController',
            controllerAs: 'coupCtrl',
            bindings: {
                coupons: '<',
                customerData: '<',
                totalPrice: '='
            },
            templateUrl: ['BookingAppConstants', function (BookingAppConstants) {
                return BookingAppConstants.templatesRoute + 'ib-booking-redemption-coupons-view.html';
            }]
        });

})();