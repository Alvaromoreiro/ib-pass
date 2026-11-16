import { DatalayerConstants } from '@shared/services/ib-datalayer/constants/ib-datalayer-constants';
(function () {


    angular
        .module('ib-booking-trip-info-module')
        .controller('BookingTripInfoController', BookingTripInfoController);

    BookingTripInfoController.$inject = ['$filter', 'BookingModalService', 'CurrencyService', 'DatalayerUtilsService', 'BookingAppConstants', 'localStorageService'];
    function BookingTripInfoController ($filter, BookingModalService, CurrencyService, DatalayerUtilsService, BookingAppConstants, localStorageService) {
        const vm = this;

        vm.choosedFilter;
        vm.filterReverse;

        vm.$onInit = activate;
        vm.activateFilter = activateFilter;
        vm.activateRedemptionFilter = activateRedemptionFilter;
        vm.deleteFilters = deleteFilters;
        vm.availabilityFilter = availabilityFilter;
        vm.availabilityFilterAws = availabilityFilterAws;
        vm.availabilityFilterMn = availabilityFilterMn;
        vm.openModal = openModal;
        vm.showPopoverStopover = showPopoverStopover;

        ////////////////

        function activate () {
            localStorageService.remove('voucherDeleteInfo');
            if (vm.tripInfoModel.provider === BookingAppConstants.REDEMPTION_AVAILABILITY_PROVIDERS.COMPOSITE && vm.tripInfoModel.selectedFilters) {
                quitShowDeleteAll(BookingAppConstants.REDEMPTION_AVAILABILITY_PROVIDERS.MULTINUCLEO);
                quitShowDeleteAll(BookingAppConstants.REDEMPTION_AVAILABILITY_PROVIDERS.AMADEUS);
            } else {
                quitShowDeleteAll(vm.tripInfoModel.provider);
            }
            vm.listFlightFilter = [
                { name: 'AVAILABILITY_MOBILE_FILTER_OUTBOUND', filter: 'departureDateTime' },
                { name: 'AVAILABILITY_MOBILE_FILTER_DURATION', filter: 'duration' },
                { name: 'AVAILABILITY_MOBILE_FILTER_CABINS_PRICE', filter: 'slicePrice' }
            ];
            vm.selectedListFlightFilter = vm.listFlightFilter[0];

            vm.AwsListFlightFilter = [
                { name: 'AVAILABILITY_MOBILE_FILTER_OUTBOUND', filter: 'departureDateTime' },
                { name: 'AVAILABILITY_MOBILE_FILTER_DURATION', filter: 'duration' }
            ];
            vm.selectedAwsListFlightFilter = vm.AwsListFlightFilter[0];
            vm.totalOriginDestinations = parseInt(localStorageService.get('bookingUrlParams').tripType);
            vm.ribbonLoading = {
                type: 'ribbon',
                identifier: 'bbki-trip-info-loading-elem',
                viewTitle: 'AVAILABILITY_SLICK_CHANGE_LOADING'
            };
        }

        function activateFilter (filtername) {
            vm.filterReverse = filtername !== null && vm.choosedFilter === filtername && !vm.filterReverse;
            vm.choosedFilter = filtername;
            vm.tripInfoModel.slices = $filter('orderBy')(vm.tripInfoModel.slices, vm.choosedFilter, vm.filterReverse);
            updateDatalayerInfo(vm.choosedFilter, vm.filterReverse);
        }

        function activateRedemptionFilter (filtername, providerName) {
            vm.filterReverse = vm.filterReverse ? vm.filterReverse : {};
            vm.choosedFilter = vm.choosedFilter ? vm.choosedFilter : {};
            vm.filterReverse[providerName] = filtername !== null && vm.choosedFilter[providerName] === filtername && !vm.filterReverse[providerName];
            vm.choosedFilter[providerName] = filtername;
        }

        function openModal (template, classTpl, event, provider) {
            if (!provider) {
                vm.openModalOptions = angular.copy(vm.tripInfoModel.filterOptions);
                BookingModalService.showFilterModal(template, { idModal: template, initialFilterOptions: angular.copy(vm.tripInfoModel.initialFilterOptions), filterOptions: vm.tripInfoModel.filterOptions, currency: vm.currencies[vm.tripInfoModel.currency] }, true, classTpl, 'FiltersModalController', 'filterCtrl').result.then(applyFilters, notApplyFilters);
            } else {
                vm.openModalOptions = angular.copy(vm.tripInfoModel.filterOptions[provider]);
                BookingModalService.showFilterModal(template, { idModal: template, initialFilterOptions: angular.copy(vm.tripInfoModel.initialFilterOptions[provider]), filterOptions: vm.tripInfoModel.filterOptions[provider] }, true, classTpl, 'FiltersModalController', 'filterCtrl').result.then(applyFilters, notApplyFilters);
            }
            event.preventDefault();

            function applyFilters (filters) {
                if (!provider) {
                    vm.tripInfoModel.selectedFilters = angular.copy(filters);
                } else {
                    if (!vm.tripInfoModel.selectedFilters) vm.tripInfoModel.selectedFilters = {};
                    vm.tripInfoModel.selectedFilters[provider] = angular.copy(filters);
                }
                quitShowDeleteAll(provider);
            }

            function notApplyFilters () {
                if (!provider) {
                    vm.tripInfoModel.filterOptions = angular.copy(vm.openModalOptions);
                } else {
                    if (vm.tripInfoModel.selectedFilters && vm.tripInfoModel.filterOptions[provider]) vm.tripInfoModel.filterOptions[provider] = angular.copy(vm.openModalOptions);
                }
            }
        }


        function deleteFilters (type, deleteAll, provider) {
            if (provider) {
                angular.forEach(vm.tripInfoModel.selectedFilters[provider], (value, filterType) => {
                    if (!deleteAll) {
                        vm.tripInfoModel.filterOptions[provider][type] = angular.copy(vm.tripInfoModel.initialFilterOptions[provider][type]);
                        if (type === 'cabinType') {
                            delete vm.tripInfoModel.filterOptions[provider].cabin;
                        }
                        vm.tripInfoModel.selectedFilters[provider][type].enable = false;
                    } else {
                        vm.tripInfoModel.filterOptions[provider][filterType] = angular.copy(vm.tripInfoModel.initialFilterOptions[provider][filterType]);
                        delete vm.tripInfoModel.filterOptions[provider].cabin;
                        vm.tripInfoModel.selectedFilters[provider][filterType].enable = false;
                        vm['showDeleteAll' + provider] = false;
                    }
                });
            } else {
                angular.forEach(vm.tripInfoModel.selectedFilters, (value, filterType) => {
                    if (!deleteAll) {
                        vm.tripInfoModel.filterOptions[type] = angular.copy(vm.tripInfoModel.initialFilterOptions[type]);
                        if (type === 'cabinType') {
                            delete vm.tripInfoModel.filterOptions.cabin;
                            vm.tripInfoModel.filterOptions.price = angular.copy(vm.tripInfoModel.initialFilterOptions.price);
                        }
                        vm.tripInfoModel.selectedFilters[type].enable = false;
                    } else {
                        vm.tripInfoModel.filterOptions[filterType] = angular.copy(vm.tripInfoModel.initialFilterOptions[filterType]);
                        delete vm.tripInfoModel.filterOptions.cabin;
                        vm.tripInfoModel.selectedFilters[filterType].enable = false;
                        vm.showDeleteAll = false;
                    }
                });
            }
            quitShowDeleteAll(provider);
        }

        function quitShowDeleteAll (provider) {
            let activeFilters = 0;
            if (provider && vm.tripInfoModel.selectedFilters) {
                angular.forEach(vm.tripInfoModel.selectedFilters[provider], (value, filterType) => {
                    if (vm.tripInfoModel.selectedFilters[provider][filterType].enable) {
                        activeFilters++;
                    }
                });
                vm['showDeleteAll' + provider] = !(activeFilters === 0);
            } else {
                angular.forEach(vm.tripInfoModel.selectedFilters, (value, filterType) => {
                    if (vm.tripInfoModel.selectedFilters[filterType].enable) {
                        activeFilters++;
                    }
                });
                vm.showDeleteAll = !(activeFilters === 0);
            }
        }


        function availabilityFilter (value) {
            let activeSlice = true;
            if (vm.tripInfoModel.selectedFilters) {
                const slicePrice = vm.tripInfoModel.selectedFilters.cabinType && vm.tripInfoModel.selectedFilters.cabinType.enable && value.cabins[vm.tripInfoModel.selectedFilters.cabinType.value].cabinAvailable ? CurrencyService.getPriceByRoundingPolicy(value.cabins[vm.tripInfoModel.selectedFilters.cabinType.value].bestPrice) : CurrencyService.getPriceByRoundingPolicy(value.slicePrice);
                const maxSlicePrice = CurrencyService.getPriceByRoundingPolicy(value.maxSlicePrice);
                const isStopsNumberFilterSelected = vm.tripInfoModel.selectedFilters.stopsNumber1.enable || vm.tripInfoModel.selectedFilters.stopsNumber2.enable || vm.tripInfoModel.selectedFilters.stopsNumber3.enable;
                activeSlice =
                    (
                        (
                            vm.tripInfoModel.selectedFilters.avios.enable
                            && value.cashAvios === vm.tripInfoModel.selectedFilters.avios.value
                        ) ||
                        !vm.tripInfoModel.selectedFilters.avios.enable
                    )
                    && (
                        (
                            vm.tripInfoModel.selectedFilters.stopsNumber1.enable
                            && vm.tripInfoModel.selectedFilters.stopsNumber1.value === value.stopsNumber
                        )
                        || (
                            vm.tripInfoModel.selectedFilters.stopsNumber2.enable
                            && vm.tripInfoModel.selectedFilters.stopsNumber2.value === value.stopsNumber
                        )
                        || (
                            vm.tripInfoModel.selectedFilters.stopsNumber3.enable
                            && vm.tripInfoModel.selectedFilters.stopsNumber3.value === value.stopsNumber
                        )
                        || !isStopsNumberFilterSelected
                    )
                    && (
                        (
                            vm.tripInfoModel.selectedFilters.cabinType.enable
                            && value.cabins[vm.tripInfoModel.selectedFilters.cabinType.value]
                            && value.cabins[vm.tripInfoModel.selectedFilters.cabinType.value].cabinAvailable
                        )
                        || !vm.tripInfoModel.selectedFilters.cabinType.enable
                    )
                    && (
                        (
                            vm.tripInfoModel.selectedFilters.price.enable
                            && (
                                (
                                    slicePrice >= vm.tripInfoModel.selectedFilters.price.value[0]
                                    && slicePrice <= vm.tripInfoModel.selectedFilters.price.value[1]
                                )
                                || (
                                    maxSlicePrice >= vm.tripInfoModel.selectedFilters.price.value[0]
                                    && maxSlicePrice <= vm.tripInfoModel.selectedFilters.price.value[1]
                                )
                            )
                        )
                        || !vm.tripInfoModel.selectedFilters.price.enable
                    )
                    && (
                        (
                            (
                                vm.tripInfoModel.selectedFilters.departureHours.enable
                                && value.departureDateTimeParsed
                            )
                            && (
                                (parseInt(value.departureDateTimeParsed.split(':')[0]) * 60) + parseInt(value.departureDateTimeParsed.split(':')[1]) >= vm.tripInfoModel.selectedFilters.departureHours.value[0]
                                && (parseInt(value.departureDateTimeParsed.split(':')[0]) * 60) + parseInt(value.departureDateTimeParsed.split(':')[1]) <= vm.tripInfoModel.selectedFilters.departureHours.value[1]
                            )
                        )
                        || !vm.tripInfoModel.selectedFilters.departureHours.enable
                    )
                    && (
                        (
                            (
                                vm.tripInfoModel.selectedFilters.arrivalHours.enable
                                && value.arrivalDateTimeParsed
                            )
                            && (
                                (parseInt(value.arrivalDateTimeParsed.split(':')[0]) * 60) + parseInt(value.arrivalDateTimeParsed.split(':')[1]) >= vm.tripInfoModel.selectedFilters.arrivalHours.value[0]
                                && (parseInt(value.arrivalDateTimeParsed.split(':')[0]) * 60) + parseInt(value.arrivalDateTimeParsed.split(':')[1]) <= vm.tripInfoModel.selectedFilters.arrivalHours.value[1]
                            )
                        )
                        || !vm.tripInfoModel.selectedFilters.arrivalHours.enable
                    );
            }
            return activeSlice;
        }

        /**
         * Filters Amadeus slices by selected filters.
         * @param {*object} value current slice to be filtered.
         * @returns {*Boolean} true if the slice fulfill the filter requirements.
         */
        function availabilityFilterAws (value) {
            let activeSlice = true;
            if (vm.tripInfoModel.selectedFilters && vm.tripInfoModel.selectedFilters.AWS) {
                const isStopsNumberFilterSelected =
                    (
                        vm.tripInfoModel.selectedFilters.AWS.stopsNumber1
                        && vm.tripInfoModel.selectedFilters.AWS.stopsNumber1.enable
                    )
                    || (
                        vm.tripInfoModel.selectedFilters.AWS.stopsNumber2
                        && vm.tripInfoModel.selectedFilters.AWS.stopsNumber2.enable
                    )
                    || (
                        vm.tripInfoModel.selectedFilters.AWS.stopsNumber3
                        && vm.tripInfoModel.selectedFilters.AWS.stopsNumber3.enable
                    );
                activeSlice =
                    (
                        (
                            vm.tripInfoModel.selectedFilters.AWS.stopsNumber1
                            && vm.tripInfoModel.selectedFilters.AWS.stopsNumber1.enable
                            && vm.tripInfoModel.selectedFilters.AWS.stopsNumber1.value === value.stopsNumber
                        )
                        || (
                            vm.tripInfoModel.selectedFilters.AWS.stopsNumber2
                            && vm.tripInfoModel.selectedFilters.AWS.stopsNumber2.enable
                            && vm.tripInfoModel.selectedFilters.AWS.stopsNumber2.value === value.stopsNumber
                        )
                        || (
                            vm.tripInfoModel.selectedFilters.AWS.stopsNumber3
                            && vm.tripInfoModel.selectedFilters.AWS.stopsNumber3.enable
                            && vm.tripInfoModel.selectedFilters.AWS.stopsNumber3.value === value.stopsNumber
                        )
                        || !isStopsNumberFilterSelected
                    )
                    && (
                        (
                            vm.tripInfoModel.selectedFilters.AWS.cabinType.enable
                            && value.cabins[vm.tripInfoModel.selectedFilters.AWS.cabinType.value]
                            && value.cabins[vm.tripInfoModel.selectedFilters.AWS.cabinType.value].cabinAvailable
                        )
                        || !vm.tripInfoModel.selectedFilters.AWS.cabinType.enable
                    )
                    && (
                        (
                            (
                                vm.tripInfoModel.selectedFilters.AWS.departureHours.enable
                                && value.departureDateTimeParsed
                            )
                            && (
                                (parseInt(value.departureDateTimeParsed.split(':')[0]) * 60) + parseInt(value.departureDateTimeParsed.split(':')[1]) >= vm.tripInfoModel.selectedFilters.AWS.departureHours.value[0]
                                && (parseInt(value.departureDateTimeParsed.split(':')[0]) * 60) + parseInt(value.departureDateTimeParsed.split(':')[1]) <= vm.tripInfoModel.selectedFilters.AWS.departureHours.value[1]
                            )
                        )
                        || !vm.tripInfoModel.selectedFilters.AWS.departureHours.enable
                    )
                    && (
                        (
                            (
                                vm.tripInfoModel.selectedFilters.AWS.arrivalHours.enable
                                && value.arrivalDateTimeParsed
                            )
                            && (
                                (parseInt(value.arrivalDateTimeParsed.split(':')[0]) * 60) + parseInt(value.arrivalDateTimeParsed.split(':')[1]) >= vm.tripInfoModel.selectedFilters.AWS.arrivalHours.value[0]
                                && (parseInt(value.arrivalDateTimeParsed.split(':')[0]) * 60) + parseInt(value.arrivalDateTimeParsed.split(':')[1]) <= vm.tripInfoModel.selectedFilters.AWS.arrivalHours.value[1]
                            )
                        )
                        || !vm.tripInfoModel.selectedFilters.AWS.arrivalHours.enable);
            }
            return activeSlice;
        }

        /**
         * Filters Multinucleo slices by selected filters.
         * @param {*} value current slice to be filtered.
         * @returns {*Boolean} true if the slice fulfill the filter requirements.
         */
        function availabilityFilterMn (value) {
            let activeSlice = true;
            if (vm.tripInfoModel.selectedFilters && vm.tripInfoModel.selectedFilters.MN) {
                activeSlice =
                    (
                        (
                            vm.tripInfoModel.selectedFilters.MN.cabinType.enable
                            && value.cabins[vm.tripInfoModel.selectedFilters.MN.cabinType.value]
                            && value.cabins[vm.tripInfoModel.selectedFilters.MN.cabinType.value].cabinAvailable
                        )
                        || !vm.tripInfoModel.selectedFilters.MN.cabinType.enable
                    )
                    && (
                        (
                            (
                                vm.tripInfoModel.selectedFilters.MN.departureHours.enable
                                && value.departureDateTimeParsed
                            )
                            && (
                                (parseInt(value.departureDateTimeParsed.split(':')[0]) * 60) + parseInt(value.departureDateTimeParsed.split(':')[1]) >= vm.tripInfoModel.selectedFilters.MN.departureHours.value[0]
                                && (parseInt(value.departureDateTimeParsed.split(':')[0]) * 60) + parseInt(value.departureDateTimeParsed.split(':')[1]) <= vm.tripInfoModel.selectedFilters.MN.departureHours.value[1]
                            )
                        )
                        || !vm.tripInfoModel.selectedFilters.MN.departureHours.enable
                    )
                    && (
                        (
                            (
                                vm.tripInfoModel.selectedFilters.MN.arrivalHours.enable
                                && value.arrivalDateTimeParsed
                            )
                            && (
                                (parseInt(value.arrivalDateTimeParsed.split(':')[0]) * 60) + parseInt(value.arrivalDateTimeParsed.split(':')[1]) >= vm.tripInfoModel.selectedFilters.MN.arrivalHours.value[0]
                                && (parseInt(value.arrivalDateTimeParsed.split(':')[0]) * 60) + parseInt(value.arrivalDateTimeParsed.split(':')[1]) <= vm.tripInfoModel.selectedFilters.MN.arrivalHours.value[1]
                            )
                        )
                        || !vm.tripInfoModel.selectedFilters.MN.arrivalHours.enable
                    );
            }
            return activeSlice;
        }

        /**
         * Updates the datalayer object and sends it to tag manager
         * @param {String} orderSelected The String with the order Selected
         * @param {Boolean} filterReverse True means descending order. False means ascending order
         */
        function updateDatalayerInfo (orderSelected, filterReverse) {
            const ORDER_TEXT = {
                departureDateTime: 'TIME',
                duration: 'DURATION',
                slicePrice: 'CABINS_AND_PRICE'
            };
            const datalayerObject = {}, filterType = !filterReverse ? '_ASC' : '_DESC';
            const datalayerEvent = vm.currentOriginDestinationIndex === 0 ? 'ORDER_EVENT_OUTBOUND' : 'ORDER_EVENT_INBOUND';
            datalayerObject[DatalayerConstants.DATALAYER_INFO.ORDER_KEY] = DatalayerConstants.DATALAYER_VALUES.ORDER_KEYS[ORDER_TEXT[orderSelected] + filterType];
            datalayerObject[DatalayerConstants.DATALAYER_INFO.EVENT] = DatalayerConstants.DATALAYER_VALUES[datalayerEvent];
            DatalayerUtilsService.addDataLayerInfo(datalayerObject);
            DatalayerUtilsService.updateDatalayerViewEvent();
        }

        function showPopoverStopover (stopOverCities, stopsNumber) {
            let i, cities = '';
            if (stopOverCities && angular.isNumber(stopsNumber)) {
                for (i = 0; i < stopOverCities.length; i++) {
                    if (stopsNumber > 1) {
                        if (i === stopsNumber - 1) {
                            cities += stopOverCities[i].description.toUpperCase();
                        } else {
                            cities += stopOverCities[i].description.toUpperCase() + ', ';
                        }
                    } else {
                        cities += stopOverCities[i].description.toUpperCase();
                    }
                }
                return cities;
            }
        }
    }
})();
