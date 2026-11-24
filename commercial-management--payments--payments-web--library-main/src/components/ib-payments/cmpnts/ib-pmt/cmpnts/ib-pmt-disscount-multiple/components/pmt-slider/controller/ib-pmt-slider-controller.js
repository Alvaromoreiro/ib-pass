(function () {
    'use strict';

    angular
        .module('ib-pmt-slider-module')
        .controller('PmtSliderController', PmtSliderController);

    PmtSliderController.$inject = ['$timeout', 'localStorageService', '$scope', '$rootScope'];
    function PmtSliderController ($timeout, localStorageService, $scope, $rootScope) {

        const vm = this;
        const aviosArrayInfo = [0];
        $scope.$on('reloadSlider', reloadSlider);

        activate();

        function activate () {
            vm.customerData = localStorageService.get('customerData');
            vm.discount_avios = {
                value: 0,
                options: {
                    disabled: false,
                    hideLimitLabels: false,
                    floor: 0,
                    ceil: vm.customerData.generalInfo.avios,
                    stepsArray: aviosArrayInfo,
                    ticksArray: [0, 9],
                    showTicksValues: true,
                    showSelectionBar: true,
                    translate: function (value) {
                        return value + ' Avios';
                    },
                    onEnd: function () {
                        $rootScope.$broadcast('updateTotalPrice', vm.discount_avios.value);
                        localStorageService.set('aviosSliderValue', vm.discount_avios.value);
                    }
                }
            };
            $timeout(() => {
                vm.paymentInfo = localStorageService.get('paymentsInfo');
                const sortedAvailableAvios = getSortedAvailableAvios(vm.paymentInfo.availableDiscounts.AVIOS.disscounts);
                let i = 0, lastItem = 0;
                for (i = 0; i < sortedAvailableAvios.length; i++) {
                    aviosArrayInfo.push(sortedAvailableAvios[i].aviosRequired);
                }
                lastItem = aviosArrayInfo.length - 1;
                vm.discount_avios.options.ticksArray = [0, lastItem];
                vm.discount_avios.options.ceil = lastItem;
                $scope.$broadcast('rzSliderForceRender');
            });
        }

        function getSortedAvailableAvios (discounts) {
            return discounts.filter(item => item.aviosRequired !== 0)
                .sort((a, b) => a.aviosRequired - b.aviosRequired);
        }

        function reloadSlider (evt, paymentInfo) {
            aviosArrayInfo.length = 0;
            aviosArrayInfo.push(0);
            let lastItem = 0, i = 0;
            const selectedAviosDisccount = localStorageService.get('selectedAviosDisccount');
            if (paymentInfo.availableDiscounts && paymentInfo.availableDiscounts.AVIOS) {
                const sortedAvailableAvios = getSortedAvailableAvios(paymentInfo.availableDiscounts.AVIOS.disscounts);
                for (i = 0; i < sortedAvailableAvios.length; i++) {
                    aviosArrayInfo.push(sortedAvailableAvios[i].aviosRequired);
                }
            }
            if (paymentInfo && paymentInfo.appliedDiscounts && paymentInfo.appliedDiscounts.types['AVIOS']) {
                vm.discount_avios.value = paymentInfo.appliedDiscounts.types['AVIOS'].id;
            } else if (paymentInfo && paymentInfo.appliedDiscounts && !paymentInfo.appliedDiscounts.types['AVIOS']) {
                if (selectedAviosDisccount && selectedAviosDisccount.aviosRequired > 0) {
                    vm.discount_avios.value = 0;
                    $rootScope.$broadcast('updateTotalPriceToCero', vm.discount_avios.value);
                }
            }
            lastItem = aviosArrayInfo.length - 1;
            vm.discount_avios.options.ticksArray = [0, lastItem];
            vm.discount_avios.options.ceil = lastItem;
        }
    }
})();
