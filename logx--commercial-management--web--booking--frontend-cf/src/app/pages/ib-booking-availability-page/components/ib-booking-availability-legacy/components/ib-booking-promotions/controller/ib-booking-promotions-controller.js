(function () {

    angular
        .module('ib-booking-promotions-module')
        .controller('BookingPromotionsController', BookingPromotionsController);
    BookingPromotionsController.$inject = ['$scope', 'localStorageService'];
    function BookingPromotionsController ($scope, localStorageService) {
        const vm = this;
    }
})();
