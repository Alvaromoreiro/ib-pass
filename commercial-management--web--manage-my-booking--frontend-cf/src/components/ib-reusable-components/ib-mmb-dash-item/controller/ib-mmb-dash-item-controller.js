(function () {
    'use strict';

    angular
        .module('ib-mmb-dash-item')
        .controller('ibMmbDashItemController', ibMmbDashItemController);

    ibMmbDashItemController.$inject = ['localStorageService', '$scope', 'MmBModalService', '$timeout'];

    function ibMmbDashItemController(localStorageService, $scope, MmBModalService, $timeout) {
        var vm = this;
        vm.action = action;
        vm.flightMenuOpen = false;
        vm.flightMenuBtnText = '';
        vm.flightMenuAriaText = 'Menú abierto';
        vm.flightMenuFocusValue = -1;
        vm.flightMenuToggle = flightMenuToggle;

        function action(event, sliceItem, index) {
            var showSpeqs = false,
                i;
            if (event === 'priority') {
                vm.activeLink = false;
                if (vm.ancillariesInfo && vm.ancillariesInfo.ancillariesAvailable && vm.ancillariesInfo.isAncillariesInTime && vm.ancillariesInfo.isAncillariesInTime.isIntime) {
                    angular.forEach(vm.ancillariesInfo.ancillariesAvailable, function (ancillaryType) {
                        if (ancillaryType === 'PRIORITY_BOARDING' && !vm.ancillariesInfo.isPnrGroup) {
                            vm.activeLink = true;
                        }
                    });
                }
                vm.local = localStorageService.get('PriorityInfo').PriorityInfo;
            } else {
                vm.local = localStorageService.get('SpeqsInfo').SpeqsInfo;
                showSpeqs = true;
            }

            vm.selectedSpeq = sliceItem;
            vm.showItem = '';
            vm.showItemParent = '';
            if (event === 'priority') {
                for (i = 0; i < vm.local.length; i++) {
                    vm.local[i].segments.forEach(function (elementItem) {
                        if (elementItem.arrivalCity.city.code === vm.selectedSpeq.arrival.code && elementItem.departureCity.city.code === vm.selectedSpeq.departure.code) {
                            vm.showItem = elementItem.slicePriority;
                            vm.showItemParent = elementItem;
                        }
                    });
                }
            } else {
                vm.local.forEach(function (elementItem) {
                    if (elementItem.arrivalCity.code === vm.selectedSpeq.arrival.code && elementItem.departureCity.code === vm.selectedSpeq.departure.code) {
                        vm.showItem = elementItem;
                    }
                });
            }
            if (showSpeqs && localStorageService.get('bundleSpeqsPerFlight')) {
                checkBundleItems();
            }
            if (showSpeqs) {
                vm.activeLink = isActiveLink();
                MmBModalService.showGenericModal(false, 'ib-show-speqs-modal.html', {
                    'selectedSliceInfo': vm.showItem,
                    'activeLink': vm.activeLink
                }, 'ib-modals ib-modals--md').result.then(angular.noop, angular.noop);
            } else {
                MmBModalService.showGenericModal(false, 'ib-show-priority-modal.html', {
                    'selectedSliceInfo': vm.showItemParent,
                    'activeLink': vm.activeLink
                }, 'ib-modals ib-modals--md').result.then(angular.noop, angular.noop);
            }

        }

        function isActiveLink() {
            var activeLink = false,
                i;
            var segmentsBaggageAvailable = localStorageService.get('speqsAvailableSegments');
            if (vm.ancillariesInfo && segmentsBaggageAvailable && segmentsBaggageAvailable.length > 0) {
                if (!vm.ancillariesInfo.isPnrGroup) {
                    activeLink = true;
                }
            }
            return activeLink;
        }

        function flightMenuToggle() {
            vm.flightMenuOpen = !vm.flightMenuOpen;
            accesibility();
        }

        function accesibility() {
            if (vm.flightMenuOpen) {
                vm.flightMenuBtnText = 'HEADER_ADVANCED_SEARCH_PASSENGERS_OPENED';
                vm.flightMenuAriaText = 'Menú abierto';
                vm.flightMenuFocusValue = 0;
            } else {
                vm.flightMenuBtnText = 'HEADER_ADVANCED_SEARCH_PASSENGERS_CLOSED';
                vm.flightMenuAriaText = 'Menú cerrado';
                vm.flightMenuFocusValue = -1;
            }
        }

        function checkBundleItems() {
            const bundleSpeqsPerFlight = localStorageService.get('bundleSpeqsPerFlight');
            for (let i = 0; i < vm.local.length; i++) {
                for (let j = 0; j < vm.local[i].segments.length; j++) {
                    let sliceSpeqs = vm.local[i].segments[j].sliceSpeqs;
                    const bundleSpeqsPerFlightAndPassenger = bundleSpeqsPerFlight.quantity / sliceSpeqs.passBaggages.length;
                    for (let k = 0; k < sliceSpeqs.passBaggages.length; k++) {
                        let l = 0,
                            alreadyDeleted = false;
                        do {
                            if (sliceSpeqs.passBaggages[k].Speqs[l].subtype === "SPEQS_" + bundleSpeqsPerFlight.subtype &&
                                        sliceSpeqs.passBaggages[k].Speqs[l].amount === bundleSpeqsPerFlightAndPassenger) {
                                        sliceSpeqs.passBaggages[k].Speqs.splice(l, 1);
                                alreadyDeleted = true;
                            }
                            l++;
                        } while (l < sliceSpeqs.passBaggages[k].Speqs.length && !alreadyDeleted);
                    }
                }
            }
        }

        $scope.$on('flight-dropdown', function () {
            if (vm.flightMenuOpen === true) {
                $timeout(function () {
                    vm.flightMenuOpen = !vm.flightMenuOpen;
                    accesibility();
                });
            }
        });

    }
})();
