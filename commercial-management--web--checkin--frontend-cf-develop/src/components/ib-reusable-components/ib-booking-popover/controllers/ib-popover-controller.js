(function () {
    'use strict';

    angular
        .module('ib-booking-popover-module')
        .controller('IbPopoverController', IbPopoverController);

    IbPopoverController.$inject = ['$scope'];
    function IbPopoverController($scope) {
        var vm = this;
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

        function close() {
            vm.isOpen = false;
        }

        function showData(outboundFlight, returnFligh, numberPassengers) {
            vm.outboundFlight = outboundFlight;
            vm.returnFlight = returnFligh;
            vm.passengers = numberPassengers;
        }

        function showMulticities(cities){
            var i;
            vm.multicityData = [];
            vm.passengers = cities[0].passsengers;
            for (i=0; i<cities.length; i++){
                vm.multicityData.push({'date': dayjs(cities[i].dates.outboundFlight).format('DD/MM/YYYY'), 'origin': cities[i].originCity.code, 'destination': cities[i].destinationCity.code});
            }

        }

        /**
         * Emits event to open modal
         * @param {Int} position Position on page for show modal with different options
         * depending of position
         */
        function showModalToAvailability(position) {
            $scope.$emit('showModalAvailability', position);
        }
    }
})();
