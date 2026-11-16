(function () {


    angular
        .module('ib-shuttle-redemption-coupons-module')
        .controller('ShuttleCouponsController', ShuttleCouponsController);

    ShuttleCouponsController.$inject = ['$scope', '$window','localStorageService', 'CurrencyService', 'GdprService', 'BookingModalService', 'ContentParserUtilsService'];
    function ShuttleCouponsController ($scope, $window, localStorageService, CurrencyService, GdprService, BookingModalService, ContentParserUtilsService) {
        const vm = this;
        vm.promotion = true;
        vm.selectCoupon = selectCoupon;
        vm.setnullCoupon = setnullCoupon;
        vm.seeConditions = seeConditions;

        vm.refresh = () => $window.location.reload();

        activate();

        ////////////////

        function activate () {
            setnullCoupon();
        }

        function setnullCoupon () {
            $scope.$emit('setShuttleCoupon', null);
        }

        function selectCoupon (coupon) {
            vm.commercialData = vm.commercialData || localStorageService.get('commercialData');
            // vm.model.priceInfo.fareCashPerPassenger = coupon.offerList[(vm.model.priceInfo.redemptionOptionId - 1) % (coupon.offerList.length)].discountedPrice.totalCash.fare / numberPassengers;
            // vm.model.priceInfo.fareAviosPerPassenger = coupon.offerList[(vm.model.priceInfo.redemptionOptionId - 1) % (coupon.offerList.length)].discountedPrice.totalAvios.fare/ numberPassengers;
            vm.model.priceInfo.totalCash = CurrencyService.formatPrice(CurrencyService.getCurrencyObject(vm.commercialData.currency), coupon.offerList[(vm.model.priceInfo.redemptionOptionId - 1) % (coupon.offerList.length)].discountedPrice.totalCash.fare + vm.model.priceInfo.tax, true);
            vm.model.priceInfo.totalAvios = CurrencyService.formatAvios(vm.commercialData.currency.groupingSeparator, coupon.offerList[(vm.model.priceInfo.redemptionOptionId - 1) % (coupon.offerList.length)].discountedPrice.totalPoints.fare);
            vm.model.priceInfo.redemptionOptionId = coupon.offerList[(vm.model.priceInfo.redemptionOptionId - 1) % (coupon.offerList.length)].optionId;
            // Prices without discount

            if (vm.model.priceInfo.oldPriceWithoutDiscount) {
                vm.model.priceInfo.oldPriceWithoutDiscount.totalCash = CurrencyService.formatPrice(CurrencyService.getCurrencyObject(vm.commercialData.currency), coupon.offerList[(vm.model.priceInfo.redemptionOptionId - 1) % (coupon.offerList.length)].basePrice.totalCash.fare + vm.model.priceInfo.tax, true);
                vm.model.priceInfo.oldPriceWithoutDiscount.totalAvios = CurrencyService.formatAvios(vm.commercialData.currency.groupingSeparator, coupon.offerList[(vm.model.priceInfo.redemptionOptionId - 1) % (coupon.offerList.length)].basePrice.totalPoints.fare);
                vm.model.priceInfo.oldTotalAvios = vm.model.priceInfo.oldPriceWithoutDiscount.totalAvios;
                vm.model.priceInfo.oldTotalCash = vm.model.priceInfo.oldPriceWithoutDiscount.totalCash;
            } else {
                vm.model.oldPriceWithoutDiscount = {
                    totalCash: CurrencyService.formatPrice(CurrencyService.getCurrencyObject(vm.commercialData.currency), coupon.offerList[(vm.model.priceInfo.redemptionOptionId - 1) % (coupon.offerList.length)].basePrice.totalCash.fare + vm.model.priceInfo.tax, true),
                    totalAvios: CurrencyService.formatAvios(vm.commercialData.currency.groupingSeparator, coupon.offerList[(vm.model.priceInfo.redemptionOptionId - 1) % (coupon.offerList.length)].basePrice.totalPoints.fare)
                };
                vm.model.priceInfo.oldTotalAvios = vm.model.priceInfo.oldPriceWithoutDiscount.totalAvios;
                vm.model.priceInfo.oldTotalCash = vm.model.priceInfo.oldPriceWithoutDiscount.totalCash;
            }
            vm.model.priceInfo.couponApplied = true;

            vm.totalPrice.totalCash = vm.model.priceInfo.totalCash;
            vm.totalPrice.totalAvios = vm.model.priceInfo.totalAvios;
            vm.totalPrice.redemptionOptionId = vm.model.priceInfo.redemptionOptionId;
            vm.totalPrice.oldPriceWithoutDiscount = vm.model.priceInfo.oldPriceWithoutDiscount;
            $scope.$emit('setShuttleCoupon', coupon);
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