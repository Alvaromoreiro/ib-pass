(function () {
    'use strict';

    angular
        .module('ib-popover-module')
        .controller('IbPopoverController', IbPopoverController);

    IbPopoverController.$inject = ['RedirectionService','$scope'];
    function IbPopoverController(RedirectionService,$scope) {
        var vm = this;
        vm.isOpen = false;
        vm.close = close;
        vm.showData = showData;
        vm.text = '';
        vm.outboundFlight = null;
        vm.passengers = null;
        vm.returnFlight = null;
        vm.showModalToAvailability = showModalToAvailability;
        vm.goToPage = goToPage;
        vm.callEvent = callEvent;

        function close() {
            vm.isOpen = false;
        }

        function goToPage(path, blank) {
            RedirectionService.externalRedirect(path, blank);
        }

        function callEvent(tab){
            $scope.$emit('changeTabEvent', tab);
        }

        function showData(outboundFlight, returnFligh, numberPassengers) {
            vm.outboundFlight = outboundFlight;
            vm.returnFlight = returnFligh;
            vm.passengers = numberPassengers;
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
