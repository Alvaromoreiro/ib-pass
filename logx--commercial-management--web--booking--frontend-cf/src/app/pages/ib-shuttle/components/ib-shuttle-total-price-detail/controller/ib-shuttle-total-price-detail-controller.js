import { BkiStorageConstants } from "@src/app/core/constants/ib-booking-storage-constants";

(function () {


    angular
        .module('ib-shuttle-total-price-detail-module')
        .controller('IbShuttleTotalPriceDetailController', IbShuttleTotalPriceDetailController);

    IbShuttleTotalPriceDetailController.$inject = ['$scope', 'localStorageService', 'BookingModalService', '$location', 'DatalayerBKIService', 'BookingAppConstants', 'IbBookingPriceDetailModalService'];
    function IbShuttleTotalPriceDetailController ($scope, localStorageService, BookingModalService, $location, DatalayerBKIService, BookingAppConstants, IbBookingPriceDetailModalService) {
        const vm = this;
        vm.$onInit = activate;
        vm.goNextPage = goNextPage;
        vm.fareDataAux = {};
        vm.getOfferSelected = getOfferSelected;
        $scope.$on('selectOffer', vm.getOfferSelected);
        vm.flowApp = '';
        vm.continueText = BookingAppConstants.TOTALPRICE_STEPS_MAP['ibshuttle'].text;
        vm.moduleId = BookingAppConstants.TOTALPRICE_STEPS_MAP['ibshuttle'].id;
        vm.openPriceDetailModal = openPriceDetailModal;
        vm.checkShouldShowPriceDetailCTA = this.checkShouldShowPriceDetailCTA;


        function activate () {
            vm.offerSelected = null;
            vm.flowApp = localStorageService.get('flowApp');
            vm.shouldShowPriceDetailCTA = IbBookingPriceDetailModalService.checkShouldShowCTA();

            if (((vm.flowApp === 'PARE') || (vm.flowApp === 'PAREONB')) && Object.keys(vm.redemptionPrice).length > 0) {
                const initialOffer = {
                    fareAviosPerPassenger: vm.redemptionPrice.fareAviosPerPassenger,
                    fareCashPerPassenger: vm.redemptionPrice.fareCashPerPassenger,
                    taxPerPassenger: vm.redemptionPrice.taxPerPassenger,
                    tax: vm.redemptionPrice.tax,
                    formatAvios: vm.redemptionPrice.price.totalAvios,
                    formatOldAvios: vm.redemptionPrice.oldPriceWithoutDiscount.totalAvios,
                    formatOldPrice: vm.redemptionPrice.oldPriceWithoutDiscount.totalCash,
                    formatPrice: vm.redemptionPrice.price.totalCash,
                    redemptionOptionId: vm.redemptionPrice.redemptionOptionId,
                    selected: true
                };
                vm.getOfferSelected(null, initialOffer);
            } else {
                vm.getOfferSelected(null, vm.model.offers[0]);
            }
        }

        function goNextPage () {
            let selectedFareRedemptionData;
            localStorageService.set('loadingNextFlow', 2);
            BookingModalService.showWaitingModal('ib-modal-loading-plane', 'ib-modals ib-modals--transparent ib-modals--loading-page', true);
            vm.fareDataAux = localStorageService.get('fareData');
            vm.fareDataAux.offers = angular.isUndefined(vm.offerSelected) || vm.flowApp === 'PAOB' || vm.flowApp === 'PAOBONB' ? vm.fareDataAux.offers : [vm.offerSelected];
            if (vm.flowApp === 'PARE') {
                selectedFareRedemptionData = {
                    fareCashPerPassenger: vm.offerSelected.fareCashPerPassenger,
                    fareAviosPerPassenger: vm.offerSelected.fareAviosPerPassenger,
                    taxPerPassenger: vm.offerSelected.taxPerPassenger,
                    tax: vm.offerSelected.tax,
                    price: {
                        totalCash: vm.offerSelected.formatPrice,
                        totalAvios: vm.offerSelected.formatAvios,
                        redemptionOptionId: vm.offerSelected.redemptionOptionId
                    }
                };
                localStorageService.set('selectedFareRedemptionData', selectedFareRedemptionData);
            } else if (vm.flowApp === 'PAREONB') {
                selectedFareRedemptionData = {
                    fareCashPerPassenger: vm.offerSelected.fareCashPerPassenger,
                    farePointsPerPassenger: vm.offerSelected.farePointsPerPassenger,
                    price: {
                        totalCash: vm.offerSelected.formatPrice,
                        totalPoints: vm.offerSelected.formatAvios,
                        redemptionOptionId: vm.offerSelected.redemptionOptionId
                    }
                };
                localStorageService.set('selectedFareRedemptionData', selectedFareRedemptionData);
            }
            DatalayerBKIService.getDigitalDataEcommerce(localStorageService.get('selectedTripInfo'), 'add_to_cart');
            $location.path('/ibairp');
        }

        function getOfferSelected (event, data) {
            vm.offerSelected = data;
            localStorageService.set('offerSelected', data);
            localStorageService.set(BkiStorageConstants.SELECTED_OFFER, data);
            if (angular.isUndefined(vm.model)) {
                vm.model = { priceInfo: { totalAvios: 0, totalCash: 0 } };
            }
            vm.model.priceInfo.totalAvios = data.formatAvios;
            vm.model.priceInfo.totalCash = data.formatPrice;
            vm.model.priceInfo.oldTotalAvios = data.formatOldAvios;
            vm.model.priceInfo.oldTotalCash = data.formatOldPrice;
            dataBreakdownPassengers(data.redemptionOptionId);
        }
        function dataBreakdownPassengers (selectedOptionId) {
            let fareData = localStorageService.get('fareData'),
                selectedOptions = [], selectedRedeption = [], breakdownPassengers = {},
                index = (selectedOptionId == 0) ? selectedOptionId : selectedOptionId - 1,
                cuponSelected = null, isPromotion = false;

            // save data selected option by redemptionOptions or promotion
            if (fareData) {
                // if exist coupon, save selection options prices
                if (vm.model.priceInfo.couponApplied) {
                    selectedOptions = vm.model.offers.coupons.flatMap((coupon) => coupon.offerList);
                    cuponSelected = selectedOptions.find(sel => sel.optionId === selectedOptionId);
                } else {
                    if (fareData.offers[0].redemptionOptions) {
                        selectedOptions = fareData.offers[0].redemptionOptions;
                    } else if (fareData.offers[0].promotion && fareData.offers[0].promotion.discountedRedemptionOptions) {
                        selectedOptions = fareData.offers[0].promotion.discountedRedemptionOptions;
                    }
                }

                selectedRedeption = cuponSelected || selectedOptions[index];
                breakdownPassengers.selectedRedeption = selectedRedeption;
                localStorageService.set('breakdownPassengers', breakdownPassengers);
            }

        }

        function openPriceDetailModal ($event) {
           IbBookingPriceDetailModalService.openPriceDetailModal($event)
        }

    }
})();
