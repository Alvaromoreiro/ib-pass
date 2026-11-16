(function () {


    angular
        .module('ib-shuttle-redemption-coupons-module')
        .component('ibShuttleRedemptionCoupons', {
            controller: 'ShuttleCouponsController',
            controllerAs: 'ScoupCtrl',
            bindings: {
                coupons: '<',
                customerData: '<',
                totalPrice: '=',
                model: '='
            },
            templateUrl: ['BookingAppConstants', function (BookingAppConstants) {
                return BookingAppConstants.templatesRoute + 'ib-shuttle-redemption-coupons-view.html';
            }]
        });

})();