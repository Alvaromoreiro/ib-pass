(function () {


    angular
        .module('ib-booking-total-price-module')
        .controller('BookingTotalPriceController', BookingTotalPriceController);

    BookingTotalPriceController.$inject = ['$scope', '$rootScope', 'BookingAppConstants', 'localStorageService', '$filter'];
    function BookingTotalPriceController ($scope, $rootScope, BookingAppConstants, localStorageService, $filter) {
        const vm = this;
        vm.sendPayEvent = sendPayEvent;
        vm.LOGIN_ONB = BookingAppConstants.LOGIN_ONB;
        vm.getMarketOBPoints = localStorageService.get('getMarketOBPoints') || null;
        vm.aviosToEarn = null;

        activate();
        ////////////////

        function activate () {
            const fareData = localStorageService.get('fareData');
            const userLogged = localStorageService.get('userLogged');

            if (userLogged && fareData && fareData.offers && fareData.offers[0] &&
                fareData.offers[0].accrualQuote && fareData.offers[0].accrualQuote.redemptionPoints) {

                vm.aviosToEarn = $filter('aviosFormatter')(fareData.offers[0].accrualQuote.redemptionPoints);
            }
        }

        function sendPayEvent () {
            vm.containerForm.$submitted = true;
            $scope.$emit('paymentSubmitted', vm.containerForm.$valid);
        }
    }
})();
