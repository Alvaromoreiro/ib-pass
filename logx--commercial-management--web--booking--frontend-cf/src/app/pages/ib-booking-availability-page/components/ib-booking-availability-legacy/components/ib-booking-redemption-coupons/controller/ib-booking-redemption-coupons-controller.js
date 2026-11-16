(function () {


    angular
        .module('ib-booking-redemption-coupons-module')
        .controller('RedemptionCouponsController', RedemptionCouponsController);

    RedemptionCouponsController.$inject = ['$scope','localStorageService', 'CurrencyService', 'GdprService', 'BookingModalService', 'ContentParserUtilsService'];
    function RedemptionCouponsController ($scope, localStorageService, CurrencyService, GdprService, BookingModalService, ContentParserUtilsService) {
        const vm = this;
        vm.promotion = true;
        vm.selectCoupon = selectCoupon;
        vm.setPromotion = setPromotion;
        vm.seeConditions = seeConditions;


        activate();

        ////////////////

        function activate () {
        }

        function setPromotion () {
            vm.promotion = true;
            $scope.$emit('refreshAvailability');
            $scope.$emit('setCoupon', null);
        }

        function selectCoupon (coupon) {
            vm.promotion = true;
            $scope.$emit('setCoupon', coupon);
            vm.commercialData = vm.commercialData || localStorageService.get('commercialData');
            // vm.totalPrice.fareCashPerPassenger = coupon.offerList[(vm.totalPrice.redemptionOptionId - 1) % (coupon.offerList.length)].discountedPrice.totalCash.fare / numberPassengers;
            // vm.totalPrice.fareAviosPerPassenger = coupon.offerList[(vm.totalPrice.redemptionOptionId - 1) % (coupon.offerList.length)].discountedPrice.totalAvios.fare/ numberPassengers;
            vm.totalPrice.price.totalCash = CurrencyService.formatPrice(CurrencyService.getCurrencyObject(vm.commercialData.currency), coupon.offerList[(vm.totalPrice.redemptionOptionId - 1) % (coupon.offerList.length)].discountedPrice.totalCash.fare + vm.totalPrice.tax, true);
            vm.totalPrice.price.totalAvios = CurrencyService.formatAvios(vm.commercialData.currency.groupingSeparator, coupon.offerList[(vm.totalPrice.redemptionOptionId - 1) % (coupon.offerList.length)].discountedPrice.totalPoints.fare);
            vm.totalPrice.redemptionOptionId = coupon.offerList[(vm.totalPrice.redemptionOptionId - 1) % (coupon.offerList.length)].optionId;
            // Prices without discount

            if (vm.totalPrice.oldPriceWithoutDiscount) {
                vm.totalPrice.oldPriceWithoutDiscount.totalCash = CurrencyService.formatPrice(CurrencyService.getCurrencyObject(vm.commercialData.currency), coupon.offerList[(vm.totalPrice.redemptionOptionId - 1) % (coupon.offerList.length)].basePrice.totalCash.fare + vm.totalPrice.tax, true);
                vm.totalPrice.oldPriceWithoutDiscount.totalAvios = CurrencyService.formatAvios(vm.commercialData.currency.groupingSeparator, coupon.offerList[(vm.totalPrice.redemptionOptionId - 1) % (coupon.offerList.length)].basePrice.totalPoints.fare);
            } else {
                vm.totalPrice.oldPriceWithoutDiscount = {
                    totalCash: CurrencyService.formatPrice(CurrencyService.getCurrencyObject(vm.commercialData.currency), coupon.offerList[(vm.totalPrice.redemptionOptionId - 1) % (coupon.offerList.length)].basePrice.totalCash.fare + vm.totalPrice.tax, true),
                    totalAvios: CurrencyService.formatAvios(vm.commercialData.currency.groupingSeparator, coupon.offerList[(vm.totalPrice.redemptionOptionId - 1) % (coupon.offerList.length)].basePrice.totalPoints.fare)
                };
            }
        }

        function seeConditions (event, coupon) {
            if (coupon.name && coupon.name.length > 0) {
                GdprService.getConditionsCoupon(coupon.name).then(getConditionsCouponSuccess, getConditionsCouponError);
            }

            function getConditionsCouponSuccess (data) {
                if (data && data.modals && data.modals.length > 0 && data.modals[0] && data.modals[0].elements.length > 0 && data.modals[0].elements[0] !== null && data.modals[0].elements[0].description && data.modals[0].elements[0].description.length > 0 && data.modals[0].title && data.modals[0].title.length > 0) {
                    BookingModalService.showGenericModal(false, 'ib-generic-external-modal.html', { info: data.modals[0] });
                } else {
                    BookingModalService.showGenericError({
                        errorCode: -1,
                        message: 'REST_SERVICE_ERROR_GENERAL',
                        needsTranslate: true,
                        internalErrorCode: ''
                    }, true).result.then(angular.noop, angular.noop);
                }
            }

            function getConditionsCouponError (error) {
                BookingModalService.showGenericError(error, true).result.then(angular.noop, angular.noop);
            }
        }
    }
})();