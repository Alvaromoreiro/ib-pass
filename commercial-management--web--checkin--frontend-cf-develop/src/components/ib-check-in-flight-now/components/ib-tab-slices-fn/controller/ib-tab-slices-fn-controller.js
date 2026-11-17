(function () {
    'use strict';

    angular
        .module('ib-tab-slices-fn-module')
        .controller('TabSlicesFnController', TabSlicesFnController);

    TabSlicesFnController.$inject = ['$scope', '$filter'];
    function TabSlicesFnController($scope, $filter) {
        var vm = this;

        vm.activateFilter = activateFilter;
        vm.selectSegment = selectSegment;
        vm.$onInit = activate;


        ////////////////

        function activate() {
            vm.listFilters = [
                { name: 'IBFNPA_TAB_SLICE_FILTER_BY_DEPARTURE_DATE_MOBILE', filter: 'departureDateTime' },
                { name: 'IBFNPA_TAB_SLICE_FILTER_BY_ARRIVAL_DATE_MOBILE', filter: 'arrivalDateTime' },
                { name: 'IBFNPA_TAB_SLICE_FILTER_BY_OPERATING_COMPANY_MOBILE', filter: 'operatedBy' },
                { name: 'IBFNPA_TAB_SLICE_FILTER_BY_REMAINING_SEATS_MOBILE', filter: 'remainingSeats' }
            ];
            vm.isOpen = false;
            vm.choosedFilter = 'departureDateTime';
            vm.filterReverse = false;
            vm.originDestinationModel.slices = $filter('orderBy')(vm.originDestinationModel.slices, vm.choosedFilter, vm.filterReverse);
        }

        function activateFilter(filtername) {
            vm.filterReverse = (filtername !== null && vm.choosedFilter === filtername)
                ? !vm.filterReverse : false;
            vm.choosedFilter = filtername;
            vm.originDestinationModel.slices = $filter('orderBy')(vm.originDestinationModel.slices, vm.choosedFilter, vm.filterReverse);
        }

        function selectSegment(slice) {
            $scope.$emit('selectSegment', slice);
        }

    }
})();