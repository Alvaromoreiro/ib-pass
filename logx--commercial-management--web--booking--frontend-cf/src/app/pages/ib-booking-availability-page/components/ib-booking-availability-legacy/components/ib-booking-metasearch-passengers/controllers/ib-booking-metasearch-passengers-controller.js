(function () {


    angular
        .module('ib-booking-metasearch-passengers-module')
        .controller('BookingMetasearchPassengersController', BookingMetasearchPassengersController);

    BookingMetasearchPassengersController.$inject = ['$scope', 'CommonsSessionStorageService', 'BookingAppConstants', '$filter', 'BookingUtilService'];
    function BookingMetasearchPassengersController ($scope, CommonsSessionStorageService, BookingAppConstants, $filter, BookingUtilService) {
        const vm = this;
        vm.specialDiscountsApplied = [];
        vm.discount = [];
        vm.passengersDiscountsSelectors = passengersDiscountsSelectors;
        vm.passengersSelectors = passengersSelectors;
        vm.checkAndSetSpecialDiscountsAppliedfromFare = checkAndSetSpecialDiscountsAppliedfromFare;
        $scope.$on('passengerCountChangeFail', passengerCountChangeFail);
        $scope.$on('updateInitialInfo', updateInitialInfo);

        vm.$onInit = activate;

        function toPassengerCount (value) {
            const parsedValue = Number(value);
            return Number.isFinite(parsedValue) && parsedValue >= 0 ? parsedValue : 0;
        }

        function getPassengerTotals () {
            const totals = {
                totalPassengers: 0,
                totalInfants: 0,
                totalChilds: 0,
                infantsIndex: 0
            };

            for (let i = 0; i < vm.items.length; ++i) {
                vm.items[i].value = toPassengerCount(vm.items[i].value);
                const currentItem = vm.items[i];

                if (currentItem.type === 'INFANT') {
                    totals.totalInfants = currentItem.value;
                    totals.infantsIndex = i;
                    continue;
                }

                totals.totalPassengers += currentItem.value;
                totals.totalChilds = currentItem.type === 'CHILD' ? currentItem.value : totals.totalChilds;
            }

            totals.totalAdults = totals.totalPassengers - totals.totalChilds;
            return totals;
        }

        function validatePassengerSelection (index, totals) {
            let warningInfants = false;
            vm.errorMessage = 0;

            if (totals.totalPassengers > 9 || totals.totalInfants > totals.totalAdults) {
                vm.errorMessage = totals.totalPassengers > 9 ? 3 : 2;
                if (vm.errorMessage === 3) {
                    vm.items[index].value = vm.initialPassengers[index].value;
                } else {
                    vm.items[totals.infantsIndex].value = vm.initialPassengers[totals.infantsIndex].value;
                    warningInfants = true;
                }
            } else if (totals.totalAdults * 2 < totals.totalChilds) {
                vm.errorMessage = 1;
            }

            return warningInfants;
        }

        function updatePassengersState (passengers, index, warningInfants) {
            const passengerIndex = findPassengerIndex(passengers, vm.items[index].type);
            const foundIt = passengerIndex !== -1;

            if (foundIt) {
                updateExistingPassenger(passengers, passengerIndex, vm.items[index].value);
            }

            const hasPassengerChanges = !angular.equals(vm.initialPassengers, vm.items);
            const updatePassengers = !foundIt && !warningInfants && vm.items[index].value >= 0 && hasPassengerChanges;
            if (updatePassengers) {
                const passengersAdd = {
                    // Keep localStorage payload as string for legacy consumers.
                    count: String(vm.items[index].value),
                    passengerType: vm.items[index].type
                };
                passengers.push(passengersAdd);
            }
        }

        function findPassengerIndex (passengers, passengerType) {
            for (let i = 0; i < passengers.length; i++) {
                if (passengers[i].passengerType === passengerType) {
                    return i;
                }
            }

            return -1;
        }

        function updateExistingPassenger (passengers, passengerIndex, value) {
            if (value > 0) {
                passengers[passengerIndex].count = String(value);
            } else {
                passengers.splice(passengerIndex, 1);
            }
        }

        function getFareSpecialDiscountsApplied (fareData) {
            return fareData?.offers?.[0]?.specialDiscountsApplied || [];
        }

        function setNoDiscountByUrl (urlFamilyDiscount, urlResidentDiscount, noDiscountOptionSelected) {
            if (urlFamilyDiscount === null) {
                vm.discount.push(noDiscountOptionSelected);
            }
            if (urlResidentDiscount === null) {
                vm.discount.push(noDiscountOptionSelected);
            }
        }

        function applyFareDiscounts (specialDiscountsApplied, noDiscountOptionSelected) {
            if (!specialDiscountsApplied[0]) {
                return;
            }

            for (let i = 0; i < specialDiscountsApplied.length; i++) {
                if (specialDiscountsApplied.findIndex(elem => elem.type === 'LGF') === -1) {
                    vm.discount.push(noDiscountOptionSelected);
                }
                if (specialDiscountsApplied.findIndex(elem => elem.type === 'RES') === -1) {
                    vm.discount.push(noDiscountOptionSelected);
                }
                vm.specialDiscountsApplied.push({
                    type: specialDiscountsApplied[i].type,
                    discountType: specialDiscountsApplied[i].discountType
                });
            }
        }

        function syncAppliedDiscountSelections () {
            if (!vm.specialDiscountsApplied?.[0] || !vm.specialDiscounts?.[0]) {
                return;
            }

            const discountLookupByType = buildDiscountLookupByType(vm.specialDiscounts);
            for (let i = 0; i < vm.specialDiscountsApplied.length; i++) {
                addAppliedDiscountIfMatched(vm.specialDiscountsApplied[i], discountLookupByType);
            }
        }

        function buildDiscountLookupByType (specialDiscounts) {
            const discountLookupByType = {};

            for (let i = 0; i < specialDiscounts.length; i++) {
                discountLookupByType[specialDiscounts[i].type] = {
                    index: i,
                    options: specialDiscounts[i].option
                };
            }

            return discountLookupByType;
        }

        function addAppliedDiscountIfMatched (appliedDiscount, discountLookupByType) {
            const mappedDiscount = discountLookupByType[appliedDiscount.type];
            if (!mappedDiscount) {
                return;
            }

            const selectedOption = findDiscountOptionByCode(mappedDiscount.options, appliedDiscount.discountType);
            if (selectedOption) {
                vm.discount.splice(mappedDiscount.index, 0, selectedOption);
            }
        }

        function findDiscountOptionByCode (options, discountType) {
            for (let i = 0; i < options.length; i++) {
                if (options[i].code === discountType) {
                    return options[i];
                }
            }

            return null;
        }

        function removeDiscountType (discounts, type) {
            const discountIndex = discounts.findIndex(discount => discount.type === type);
            if (discountIndex !== -1) {
                discounts.splice(discountIndex, 1);
            }
        }

        function getPassengerTypeBySelectorIndex (index) {
            if (index === 1) {
                return 'CHILD';
            }

            if (index === 2) {
                return 'INFANT';
            }

            return null;
        }

        function removePassengerByType (passengers, passengerType) {
            if (!passengerType) {
                return;
            }

            const passengerIndex = findPassengerIndex(passengers, passengerType);
            if (passengerIndex !== -1) {
                passengers.splice(1, passengerIndex);
            }
        }

        function emitNoSearchIfInitialPassengers () {
            if (angular.equals(vm.initialPassengers, vm.items)) {
                $scope.$emit('newSeach', false);
            }
        }


        function activate () {
            const fareData = CommonsSessionStorageService.get('fareData');
            let i = 0;
            vm.actualDisctounts;
            vm.items = BookingAppConstants.OPTIONS_PASSENGERS_METASEARCH.options;
            vm.passengers = CommonsSessionStorageService.get('bookingUrlParams');
            vm.initialDiscountsApplied = CommonsSessionStorageService.get('specialDiscounts') || [];
            vm.checkAndSetSpecialDiscountsAppliedfromFare(fareData);
            for (i = 0; i < vm.items.length; i++) {
                switch (vm.items[i].type) {
                        case 'ADULT':
                            vm.items[i].value = toPassengerCount(vm.passengers.adult);
                            break;
                        case 'CHILD':
                            vm.items[i].value = toPassengerCount(vm.passengers.child);
                            break;
                        case 'INFANT':
                            vm.items[i].value = toPassengerCount(vm.passengers.infant);
                            break;
                }
            }
            vm.initialPassengers = angular.copy(vm.items);
        }


        /**
         *  Determines if is needed recalculate summary and send event in that case
         * @param {Integer} index Indicates what passenger type changes
         * @param {Element} item
         */
        function passengersSelectors (index, item) {
            const actualDiscounts = CommonsSessionStorageService.get('specialDiscounts') || [];
            const passengers = CommonsSessionStorageService.get('addPassengers') || CommonsSessionStorageService.get('availabilityRequestData').passengers;
            const totals = getPassengerTotals();
            const warningInfants = validatePassengerSelection(index, totals);

            if (!angular.equals(vm.initialPassengers, vm.items) || !angular.equals(vm.initialDiscountsApplied, actualDiscounts)) {
                updatePassengersState(passengers, index, warningInfants);
                CommonsSessionStorageService.set('addPassengers', passengers);
                $scope.$emit('newSeach', true);
            } else {
                CommonsSessionStorageService.set('addPassengers', CommonsSessionStorageService.get('availabilityRequestData').passengers);
                $scope.$emit('newSeach', false);
            }
        }

        function passengerCountChangeFail (event, index, value) {
            const passengers = CommonsSessionStorageService.get('addPassengers') || null;
            if (passengers) {
                const passengerType = getPassengerTypeBySelectorIndex(index);
                removePassengerByType(passengers, passengerType);
                CommonsSessionStorageService.set('addPassengers', passengers);
            }

            vm.items[index].value = toPassengerCount(value);
            emitNoSearchIfInitialPassengers();
        }

        function passengersDiscountsSelectors (index, type, selected) {
            const actualDisctounts = CommonsSessionStorageService.get('specialDiscounts') || [];
            removeDiscountType(actualDisctounts, type);
            if (selected.code) {
                actualDisctounts.push({ type: type, discountType: selected.code });
            }
            vm.specialDiscounts[index].value = selected ? selected.name : $filter('translate')('AVAILABILITY_METASEARCH_NO_OPTION');
            CommonsSessionStorageService.set('specialDiscounts', actualDisctounts);
            if (!angular.equals(vm.initialDiscountsApplied, actualDisctounts))
                $scope.$emit('newSeach', true);
            else {
                if (angular.equals(vm.initialPassengers, vm.items))
                    $scope.$emit('newSeach', false);
            }
        }


        function updateInitialInfo () {
            vm.initialDiscountsApplied = CommonsSessionStorageService.get('specialDiscounts');
            vm.initialPassengers = angular.copy(vm.items);
        }

        function checkAndSetSpecialDiscountsAppliedfromFare (fareData) {
            const urlFamilyDiscount = BookingUtilService.getURLFirstParameterByName(BookingAppConstants.BOOKING_PARAMS_NAMES.LARGE_FAMILY_TYPE), noDiscountOptionSelected = { name: $filter('translate')('AVAILABILITY_METASEARCH_NO_OPTION') };
            const urlResidentDiscount = BookingUtilService.getURLFirstParameterByName(BookingAppConstants.BOOKING_PARAMS_NAMES.RESIDENT);
            const specialDiscountsApplied = getFareSpecialDiscountsApplied(fareData);

            setNoDiscountByUrl(urlFamilyDiscount, urlResidentDiscount, noDiscountOptionSelected);
            applyFareDiscounts(specialDiscountsApplied, noDiscountOptionSelected);
            syncAppliedDiscountSelections();
            vm.discount.length > 0 ? vm.initialDiscountsApplied = vm.discount : angular.noop;
        }
    }
})();
