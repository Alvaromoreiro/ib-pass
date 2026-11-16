(function () {


    angular
        .module('ib-booking-modal-module')
        .controller('FiltersModalController', FiltersModalController);

    FiltersModalController.$inject = ['$scope', '$uibModalInstance', 'object', 'CurrencyService', 'DatalayerUtilsService','BookingAppConstants'];
    function FiltersModalController ($scope, $uibModalInstance, object, CurrencyService, DatalayerUtilsService, BookingAppConstants) {
        const vm = this;
        vm.model = object;
        vm.onb=BookingAppConstants.LOGIN_ONB;
        vm.close = closeModal;
        vm.accept = acceptModal;
        vm.updateRangePrices = updateRangePrices;
        vm.$onInit = activate;

        function activate () {
            vm.model.filterOptions.cabin = !vm.model.filterOptions.cabin ? vm.model.filterOptions.cabinType.anyCabin : vm.model.filterOptions.cabin;
            DatalayerUtilsService.sendDatalayerModalEvent(vm.model);
            $uibModalInstance.result.then(DatalayerUtilsService.removeDatalayerModalAttrs, DatalayerUtilsService.removeDatalayerModalAttrs);
        }

        // eslint-disable-next-line angular/no-private-call,angular/controller-as
        $scope.$$postDigest(() => {
            $scope.$broadcast('rzSliderForceRender');
        });

        ////////////////
        /**
         * Closes the modal dismissing its instance
         */
        function closeModal () {
            $uibModalInstance.dismiss();
        }

        /**
         * Closes the modal calling close method of its instance
         */
        function acceptModal () {
            $uibModalInstance.close(applyFilters());
        }

        /**
        * Update the prices of the range slider when user changes cabin and set cabin type.
        */
        function updateRangePrices (cabinType) {
            if ((!cabinType || cabinType === 'anyCabin') && vm.model.filterOptions.price) {
                if (vm.model.filterOptions.price) vm.model.filterOptions.price = angular.copy(vm.model.initialFilterOptions.price);
            } else {
                vm.model.filterOptions.cabin.type = cabinType;
                if (vm.model.filterOptions.price) vm.model.filterOptions.price = angular.copy(vm.model.filterOptions.pricesByCabin[cabinType]);
            }
        }

        function formatPrice (price) {
            return CurrencyService.formatPrice(vm.model.currency, price, false, true);
        }

        /**
         * Push filters to filters array to show in the view
         */
        function applyFilters () {
            const filters = {};
            if (vm.model.filterOptions.stopsNumber1) filters.stopsNumber1 = vm.model.filterOptions.stopsNumber1;
            if (vm.model.filterOptions.stopsNumber2) filters.stopsNumber2 = vm.model.filterOptions.stopsNumber2;
            if (vm.model.filterOptions.stopsNumber3) filters.stopsNumber3 = vm.model.filterOptions.stopsNumber3;
            filters.cabinType = {
                description: 'Cabina' + ' ' + (angular.isDefined(vm.model.filterOptions.cabin) ? vm.model.filterOptions.cabin.cabinDescription : ''),
                value: (angular.isDefined(vm.model.filterOptions.cabin) ? vm.model.filterOptions.cabin.type : ''),
                enable: angular.isDefined(vm.model.filterOptions.cabin) && vm.model.filterOptions.cabin.cabinAvailable
            };
            if (angular.isDefined(vm.model.filterOptions.avios)) {
                filters.avios = {
                    value: vm.model.filterOptions.avios,
                    enable: vm.model.filterOptions.avios
                };
            }
            if (vm.model.filterOptions.price) {
                filters.price = {
                    initFormatValue: formatPrice(vm.model.filterOptions.price.minValue),
                    endFormatValue: formatPrice(vm.model.filterOptions.price.maxValue),
                    value: [vm.model.filterOptions.price.minValue, vm.model.filterOptions.price.maxValue],
                    enable: vm.model.filterOptions.cabin && vm.model.filterOptions.cabin.type && vm.model.filterOptions.cabin.cabinAvailable ? !angular.equals(vm.model.filterOptions.price, vm.model.filterOptions.pricesByCabin[vm.model.filterOptions.cabin.type]) : !angular.equals(vm.model.filterOptions.price, vm.model.initialFilterOptions.price)
                };
            }
            filters.departureHours = {
                description: {
                    min: (vm.model.filterOptions.departureHours.minValue / 60) < 10 ? ('0' + Math.floor(vm.model.filterOptions.departureHours.minValue / 60) + (((vm.model.filterOptions.departureHours.minValue / 60) % 1 === 0) ? ':00' : ':30')) : (Math.floor(vm.model.filterOptions.departureHours.minValue / 60) + (((vm.model.filterOptions.departureHours.minValue / 60) % 1 === 0) ? ':00' : ':30')),
                    max: (vm.model.filterOptions.departureHours.maxValue / 60) < 10 ? ('0' + Math.floor(vm.model.filterOptions.departureHours.maxValue / 60) + (((vm.model.filterOptions.departureHours.maxValue / 60) % 1 === 0) ? ':00' : ':30')) : (Math.floor(vm.model.filterOptions.departureHours.maxValue / 60) + (((vm.model.filterOptions.departureHours.maxValue / 60) % 1 === 0) ? ':00' : ':30'))
                },
                value: [vm.model.filterOptions.departureHours.minValue, vm.model.filterOptions.departureHours.maxValue],
                enable: !angular.equals(vm.model.filterOptions.departureHours, vm.model.initialFilterOptions.departureHours)
            };
            filters.arrivalHours = {
                description: {
                    min: (vm.model.filterOptions.arrivalHours.minValue / 60) < 10 ? ('0' + Math.floor(vm.model.filterOptions.arrivalHours.minValue / 60) + (((vm.model.filterOptions.arrivalHours.minValue / 60) % 1 === 0) ? ':00' : ':30')) : (Math.floor(vm.model.filterOptions.arrivalHours.minValue / 60) + (((vm.model.filterOptions.arrivalHours.minValue / 60) % 1 === 0) ? ':00' : ':30')),
                    max: (vm.model.filterOptions.arrivalHours.maxValue / 60) < 10 ? ('0' + Math.floor(vm.model.filterOptions.arrivalHours.maxValue / 60) + (((vm.model.filterOptions.arrivalHours.maxValue / 60) % 1 === 0) ? ':00' : ':30')) : (Math.floor(vm.model.filterOptions.arrivalHours.maxValue / 60) + (((vm.model.filterOptions.arrivalHours.maxValue / 60) % 1 === 0) ? ':00' : ':30'))
                },
                value: [vm.model.filterOptions.arrivalHours.minValue, vm.model.filterOptions.arrivalHours.maxValue],
                enable: !angular.equals(vm.model.filterOptions.arrivalHours, vm.model.initialFilterOptions.arrivalHours)
            };
            return filters;
        }


    }
})();