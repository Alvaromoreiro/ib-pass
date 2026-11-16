(function () {

    angular
        .module('ib-booking-fare-rates-avios-module')
        .controller('BookingFareRatesAviosController', BookingFareRatesAviosController);
    BookingFareRatesAviosController.$inject = ['$scope', 'localStorageService', 'BookingModalService', 'CurrencyService'];
    function BookingFareRatesAviosController ($scope, localStorageService, BookingModalService, CurrencyService) {
        const vm = this;
        vm.disabled = false;
        vm.selectAviosMoneyOption = selectAviosMoneyOption;
        vm.newAvailability = newAvailability;

        vm.openModalLinks = function () {
            BookingModalService.showGenericModal(true, 'ib-modal-avios-buy-v2.html', { idModal: 'ib-modal-avios-buy-v2.html' }).result.then(angular.noop, angular.noop);
        };

        /**
         * Adds to model the values of the avios&money option selected by the user
         * @param {object} aviosMoneySelected option selected in the avios&money module
         */
        function selectAviosMoneyOption (aviosMoneySelected) {
            vm.commercialData = vm.commercialData || localStorageService.get('commercialData');
            vm.totalPrice.fareCashPerPassenger = aviosMoneySelected.fareCashPerPassenger;
            vm.totalPrice.fareAviosPerPassenger = aviosMoneySelected.fareAviosPerPassenger;
            vm.totalPrice.tax = aviosMoneySelected.tax;
            vm.totalPrice.taxPerPassenger = aviosMoneySelected.taxPerPassenger;
            vm.totalPrice.price.totalCash = aviosMoneySelected.formatPrice;
            vm.totalPrice.price.totalAvios = aviosMoneySelected.formatAvios;
            vm.totalPrice.redemptionOptionId = aviosMoneySelected.redemptionOptionId;
            // Prices without discount
            if (vm.totalPrice.oldPriceWithoutDiscount && (aviosMoneySelected.aviosWithoutDiscount && aviosMoneySelected.cashWithoutDiscount)) {
                vm.totalPrice.oldPriceWithoutDiscount.totalCash = CurrencyService.formatPrice(CurrencyService.getCurrencyObject(vm.commercialData.currency), aviosMoneySelected.cashWithoutDiscount.fare + vm.totalPrice.tax, true);
                vm.totalPrice.oldPriceWithoutDiscount.totalAvios = CurrencyService.formatAvios(vm.commercialData.currency.groupingSeparator, aviosMoneySelected.aviosWithoutDiscount.fare);
            }

            // Save option selected
            $scope.$emit('dataBreakdownPassengers', vm.totalPrice.redemptionOptionId);
        }

        function newAvailability () {
            $scope.$emit('recalculatePrice');
        }
    }
})();
