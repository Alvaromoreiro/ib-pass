import dayjs from 'dayjs';
(function () {


    angular
        .module('ib-booking-popover-module')
        .controller('IbPopoverController', IbPopoverController);

    IbPopoverController.$inject = ['$scope', 'localStorageService', '$window', '$timeout'];
    function IbPopoverController ($scope, localStorageService, $window, $timeout) {
        const vm = this;
        vm.isOpen = false;
        vm.close = close;
        vm.showData = showData;
        vm.text = '';
        vm.outboundFlight;
        vm.passengers;
        vm.returnFlight;
        vm.multicityData = [];
        vm.showModalToAvailability = showModalToAvailability;
        vm.showMulticities = showMulticities;
        vm.flowApp;
        activate();

        function activate () {
            vm.triggerTitle = $window.innerWidth < 1024 ? 'CLICK_FOR_MORE_INFORMATION_TEXT' : '';
        }

        vm.close = function () {
            $timeout(() => {
                vm.isOpen = false;
            });
        };
        //Function to change state isOpen
        vm.isFocusIn = function (param) {
            $timeout(() => {
                vm.isOpen = param;
            });
        };
        vm.hoverLargeView = function (event, text) {
            const windowWidth = $window.innerWidth;
            $timeout(() => {
                vm.text = text;
                vm.triggerTitle = windowWidth < 1024 ? 'CLICK_FOR_MORE_INFORMATION_TEXT' : '';
            });
            if (windowWidth >= 1024 && (event.type === 'mouseenter' || event.type === 'focus') && !vm.isOpen) {
                vm.isFocusIn(true);
            } else if(windowWidth >= 1024 && event.type === 'mouseleave' && vm.isOpen) {
                vm.close();
            } else if (windowWidth >= 1024 && event.type === 'click' && vm.isOpen) {
                vm.isOpen = true;
            } else if (windowWidth < 1024 && event.type === 'click' && !vm.isOpen) {
                vm.isFocusIn(true);
            } else if (windowWidth < 1024 && (event.type === 'mouseenter' || event.type === 'mouseleave') && vm.isOpen) {
                vm.isFocusIn(true);
            } else {
                vm.close();
            }
        };

        function showData (outboundFlight, returnFligh, numberPassengers) {
            vm.flowApp = localStorageService.get('flowApp');
            vm.outboundFlight = outboundFlight;
            vm.returnFlight = returnFligh;
            vm.passengers = numberPassengers;
        }

        function showMulticities (cities) {
            let i;
            vm.multicityData = [];
            vm.passengers = cities[0].passengers;
            for (i = 0; i < cities.length; i++) {
                vm.multicityData.push({ date: dayjs(cities[i].dates.outboundFlight).format('DD/MM/YYYY'), origin: cities[i].originCity.code, destination: cities[i].destinationCity.code });
            }

        }

        /**
         * Emits event to open modal
         * @param {Int} position Position on page for show modal with different options
         * depending of position
         */
        function showModalToAvailability (position) {
            $scope.$emit('showModalAvailability', position);
        }

        $scope.$on('outside-popover', () => {
            if (vm.isOpen) {
                vm.close();
            }
        });
        $scope.$on('outside-popover-enter', () => {
            if (!vm.isOpen) {
                $timeout(() => {
                    vm.isOpen = true;
                });
            }
        });
    }
})();
