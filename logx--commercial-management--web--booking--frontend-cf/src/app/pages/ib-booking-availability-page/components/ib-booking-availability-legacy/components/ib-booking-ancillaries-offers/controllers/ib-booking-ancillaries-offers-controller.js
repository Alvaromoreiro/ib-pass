import angular from 'angular';

(function () {

    angular
        .module('ib-booking-ancillaries-offers-module')
        .controller(
            'BookingAncOffersController',
            BookingAncOffersController
        );

    BookingAncOffersController.$inject = ['$scope', '$rootScope', 'localStorageService','BookingModalService','NewMainHeaderFacade','CurrencyService','$filter','CommonsSessionStorageService'];
    function BookingAncOffersController ($scope, $rootScope, localStorageService,BookingModalService,NewMainHeaderFacade,CurrencyService,$filter,CommonsSessionStorageService) {
        const vm = this;
        vm.selectedFlex;
        vm.openModal = openModal;
        vm.selectFlex = selectFlex;
        vm.deleteFlex = deleteFlex;
        vm.$onInit = activate;
        vm.totals = [];
        vm.currency = CommonsSessionStorageService.get('commercialData').currency.symbol;
        vm.flexAvailable = [];
        vm.selectedFare = [false, false, false, true];

        $scope.$on('calculateFlexPrices', calculateFlexPrices);
        $scope.$on('emptyFlex', emptyFlex);

        function activate () {
            vm.selectedFare = [false, false, false, true];
            calculateFlexPrices();
        }

        function emptyFlex () {
            vm.selectedFare = [false, false, false, true];
        }

        function calculateFlexPrices () {
            const totalPrice = CommonsSessionStorageService.get('headerModel').headerModel.shoppingBasket.total.totalPrice;
            const relativePrices = [
                Math.round(totalPrice * 0.12),
                Math.round(totalPrice * 0.35),
                Math.round(totalPrice * 0.3995)
            ];
            for (let i = 0; i < relativePrices.length; i++) {
                if (i === 0) {
                    vm.totals.push(relativePrices[i] <= 5 ? relativePrices[i] = 5 : relativePrices[i] && relativePrices[i] >= 15 ? relativePrices[i] = 15 : relativePrices[i]);
                }
                if (i === 1) {
                    vm.totals.push(relativePrices[i] <= 10 ? relativePrices[i] = 10 : relativePrices[i] && relativePrices[i] >= 50 ? relativePrices[i] = 50 : relativePrices[i]);
                }
                if (i === 2) {
                    vm.totals.push(relativePrices[i] <= 12.75 ? relativePrices[i] = 12.75 : relativePrices[i]  && relativePrices[i] >= 55.25 ? relativePrices[i] = 55.25 : relativePrices[i]);
                }
            }
        }

        function selectFlex (selectedFlex) {
            let totalPrice, flexType, message;
            switch (selectedFlex) {
                    case 'FLIGHT_CHANGE': flexType = 'FLIGHT_CHANGE'; totalPrice = vm.totals[0]; message = $filter('translate')('ANCILLARIES_FLEXIBILITY_FLIGHT_CHANGE_TITLE'); break;
                    case 'VOUCHER_REFUND': flexType = 'VOUCHER_REFUND'; totalPrice = vm.totals[1]; message = $filter('translate')('ANCILLARIES_FLEXIBILITY_VOUCHER_REFUND_CHANGE_TITLE');  break;
                    case 'PACK_FLEX': flexType = 'FLEXIBILITY_PACK'; totalPrice = vm.totals[2]; message = $filter('translate')('ANCILLARIES_FLEXIBILITY_PACK_FLEXIBILITY');  break;
            }
            vm.flexAvailable = [
                {
                    description: message,
                    total: totalPrice,
                    passengerPrices: [
                        {
                            id: 'ADULT_01',
                            amount: totalPrice
                        }
                    ],
                    percentage: 80,
                    status: {
                        code: 'AVAILABLE',
                        reason: null
                    },
                    subtype: flexType,
                    priceFormatted: CurrencyService.formatPrice(vm.currency,totalPrice, true)
                }
            ];
            localStorageService.set('currency',CommonsSessionStorageService.get('headerModel').headerModel.shoppingBasket.currency);
            NewMainHeaderFacade.updateBasketFlexibilization(vm.flexAvailable[0]);
            localStorageService.set('selectedFlex', vm.flexAvailable[0]);
            $rootScope.$broadcast('updatePrice', CommonsSessionStorageService.get('headerModel').headerModel.shoppingBasket.total.formatted);
            $rootScope.$broadcast('isFareSelectedAncOffers', true);
            $rootScope.$broadcast('updateEcommerce');

            if (localStorageService.get('selectedFlex')) {
                const subtypeAncOffer = vm.flexAvailable[0].description;
                vm.ancOffersTotal = $filter('translate')('AVAILABILITY_SUMMARY_TOTAL_PRICE', { option: subtypeAncOffer});
                $rootScope.$broadcast('changeOffersTotal',vm.ancOffersTotal);
            }
        }

        function deleteFlex () {
            NewMainHeaderFacade.updateBasketFlexibilization('');
            CommonsSessionStorageService.remove('selectedFlex');
            $rootScope.$broadcast('emptyFlex');
            $rootScope.$broadcast('calculateFlexPrices');
            $rootScope.$broadcast('updatePrice', CommonsSessionStorageService.get('headerModel').headerModel.shoppingBasket.total.formatted);
            $rootScope.$broadcast('isFareSelectedAncOffers', false);
            $rootScope.$broadcast('updateEcommerce');
        }

        function openModal (template, classTpl, event) {
            event.preventDefault();
            BookingModalService.showGenericModal(true, template, { idModal: template }).result.then(angular.noop, angular.noop);
        }
    }
})();
