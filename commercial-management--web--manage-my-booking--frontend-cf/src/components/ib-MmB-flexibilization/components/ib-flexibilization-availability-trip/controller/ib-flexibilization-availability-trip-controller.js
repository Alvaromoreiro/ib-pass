(function () {
    'use strict';

    angular
        .module('ib-flexibilization-availability-trip-module')
        .controller('IbFlexAvailabilityTripController', IbFlexAvailabilityTripController);

    IbFlexAvailabilityTripController.$inject = ['$scope', 'MmBModalService', 'MmBUtilsSharedService'];
    function IbFlexAvailabilityTripController($scope, MmBModalService, MmBUtilsSharedService) {
        var vm = this;
        vm.$onInit = activate;
        vm.optionSelected = optionSelected;
        vm.removeStateFlight = removeStateFlight;
        vm.clickListFlightFilter = clickListFlightFilter;
        vm.activateFilter = activateFilter;
        vm.openSisterCity = openSisterCity;
        vm.showWarningPanel = false;
        vm.warningMessage = '';

        function activate() {
            vm.listFlightFilter = [
                { name: 'MMB_VC_AVAILABILITY_MOBILE_FILTER_TIME', filter: 'departureTime', title: 'MMB_VC_AVAILABILITY_MOBILE_FILTER_TIME_TITLE' },
                { name: 'MMB_VC_AVAILABILITY_MOBILE_FILTER_DURATION', filter: 'durationMinutes', title: 'MMB_VC_AVAILABILITY_MOBILE_FILTER_DURATION_TITLE' }
            ];
            vm.selectedListFlightFilter = vm.listFlightFilter[0];
            vm.choosedFilter = 'durationMinutes';
        }
        function optionSelected() {
            $scope.$emit('optionSelected');
        }
        function removeStateFlight(sliceConfIndex) {
            delete vm.selectedSlices[sliceConfIndex];
            vm.listSlicesShow = sliceConfIndex > vm.listSlicesShow ? vm.listSlicesShow : sliceConfIndex;
            vm.totalShow = false;
        }

        function clickListFlightFilter(item, e) {
            vm.selectedListFlightFilter = item;
            e.preventDefault();
        };
        function activateFilter(item, e) {
            vm.selectedListFlightFilter = item;
            if (e) e.preventDefault();
            vm.filterReverse = item.filter !== null && vm.choosedFilter === item.filter && !vm.filterReverse;
            vm.choosedFilter = item.filter;
        };


        function openSisterCity () {
            vm.sisTripSliceId = vm.slices[0].tripSliceId;
            MmBModalService.showGenericModal(false, 'ib-modal-sister-cities.html', vm).result.then(function(){
                MmBUtilsSharedService.updateSisterCitiesModel(vm.newSisterCities);
                $scope.$emit('newDateSalected');
            }, function(){
            });
        }
    }
})();