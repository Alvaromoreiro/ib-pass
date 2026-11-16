(function () {


    angular
        .module('ib-booking-dropdown-select')
        .controller('BookingDropdownSelectController', BookingDropdownSelectController);

    BookingDropdownSelectController.$inject = [];
    function BookingDropdownSelectController () {
        const vm = this;
        vm.clickListFlightFilter = function (item, e) {
            vm.selectedListFlightFilter = item;
            e.preventDefault();
        };
        vm.listFlightFilter = [
            { name: 'AVAILABILITY_MOBILE_FILTER_TIME', filter: 'departureDateTime' },
            { name: 'AVAILABILITY_MOBILE_FILTER_DURATION', filter: 'duration' },
            { name: 'AVAILABILITY_MOBILE_FILTER_CABINS_PRICE', filter: 'slicePrice' }
        ];
        vm.selectedListFlightFilter = vm.listFlightFilter[0];

    }
})();