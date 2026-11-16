(function () {

    angular
        .module('ib-booking-summary-module')
        .controller('BookingSummaryController', BookingSummaryController);

    BookingSummaryController.$inject = ['$scope', 'localStorageService', 'BookingAppConstants', 'CurrencyService'];
    function BookingSummaryController ($scope, localStorageService, BookingAppConstants, CurrencyService) {
        const vm = this;
        vm.openTaxesModal = openTaxesModal;
        vm.isEmptyDiscounts = isEmptyDiscounts;
        vm.modalSelector = modalSelector;
        vm.controlPassengers = controlPassengers;

        activate();

        function activate () {
            vm.isOpenJaw = localStorageService.get('openJaw');
            vm.isMulticity = localStorageService.get('searchFlightType') === 'multiCityFlight';
            vm.passengersInsuranceInfo = localStorageService.get('passengerInsurance');
            vm.isLogged = localStorageService.get('userLogged');
            vm.LOGIN_ONB = BookingAppConstants.LOGIN_ONB;
            if (vm.isLogged === BookingAppConstants.LOGIN_ONB) {
                vm.membershipData = localStorageService.get('membershipData');
                if (localStorageService.get('oBDiscountType') === false) {
                    vm.oBDiscountInfo = localStorageService.get('oBDiscountInfo');
                }
            }
        }

        function openTaxesModal (breakdownTaxes) {
            $scope.$emit('openSummaryModal', 'ib-modal-payment-taxes.html', breakdownTaxes);
        }

        function isEmptyDiscounts () {
            return !vm.appliedDiscounts || Object.keys(vm.appliedDiscounts).length === 0;
        }

        function modalSelector (type, info) {
            let modalTemplate, modalObject;
            switch (type) {
                    case BookingAppConstants.CONDITION_TYPES.HAND_BAGGAGE:
                    case BookingAppConstants.CONDITION_TYPES.CHECKED_BAGGAGE:
                        modalTemplate = BookingAppConstants.MODAL_PAYMENT_LUGGAGE_INFO;
                        modalObject = angular.copy(info);
                        break;
            }
            $scope.$emit('openSummaryModal', modalTemplate, modalObject);
        }

        /**
         * Recalculate breakdown passengers for option selected (avios payments)
         * @param {Object} passengers
         * @return passengers
         */
        function controlPassengers (passengers) {
            let currency = null, pricePerPax = null, breakdownPassengers = localStorageService.get('breakdownPassengers'), fareData = localStorageService.get('fareData');

            if (breakdownPassengers && fareData && fareData.contextMetadata && fareData.contextMetadata.currencies[0]) {
                currency = CurrencyService.getCurrencyObject(fareData.contextMetadata.currencies[0]);
                if (breakdownPassengers.selectedRedeption) {
                    if (breakdownPassengers.selectedRedeption.pricePerPax) {
                        pricePerPax = breakdownPassengers.selectedRedeption.pricePerPax;
                    } else if (breakdownPassengers.selectedRedeption.discountedPrice && breakdownPassengers.selectedRedeption.discountedPrice.pricePerPax) {
                        pricePerPax = breakdownPassengers.selectedRedeption.discountedPrice.pricePerPax;
                    } else if (breakdownPassengers.selectedRedeption.basePrice && breakdownPassengers.selectedRedeption.basePrice.pricePerPax) {
                        pricePerPax = breakdownPassengers.selectedRedeption.basePrice.pricePerPax;
                    }
                }

                angular.forEach(pricePerPax, (price) => {
                    passengers[price.paxType][0].aviosFare = price.points.fare;
                    passengers[price.paxType][0].fare = price.cash.fare;
                    passengers[price.paxType][0].parsedFare = CurrencyService.formatPrice(currency, price.cash.fare, true);
                    passengers[price.paxType][0].parsedAviosFare = CurrencyService.formatAvios(currency.groupingSeparator, price.points.fare);
                });
            }

            return passengers;
        }
    }
})();