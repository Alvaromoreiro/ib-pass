(function () {
    'use strict';

    angular
        .module('ib-dropdown-select')
        .controller('ibDropdownSelectController', ibDropdownSelectController);

    ibDropdownSelectController.$inject = ['$timeout'];
    function ibDropdownSelectController($timeout) {
        var vm = this;

        vm.clickListFlightFilter = function(item, e){
            vm.selectedListFlightFilter = item;
            e.preventDefault();
        };
        vm.listFlightFilter = [
            {name: 'Ordenar por precio'},
            {name: 'Ordenar por salida'},
            {name: 'Ordenar por tarifa'},
            {name: 'Ordenar por escalas'}
        ];
        vm.selectedListFlightFilter = vm.listFlightFilter[0];

        vm.listFlightFilterVC = [
            { isOpenModal: false, configModal: {}, name: 'MMB_VC_AVAILABILITY_MOBILE_FILTER_TIME', title: 'MMB_VC_AVAILABILITY_MOBILE_FILTER_TIME_TITLE', filterName: 'departureDateTime' },
            { isOpenModal: false, configModal: {}, name: 'MMB_VC_AVAILABILITY_MOBILE_FILTER_DURATION', title: 'MMB_VC_AVAILABILITY_MOBILE_FILTER_DURATION_TITLE', filterName: 'duration' },
            { isOpenModal: false, configModal: {}, name: 'MMB_VC_AVAILABILITY_MOBILE_FILTER_CABINS_PRICE', title: 'MMB_VC_AVAILABILITY_MOBILE_FILTER_CABINS_PRICE_TITLE', filterName: 'slicePrice' }
        ];
        vm.selectedListFlightFilterVC = vm.listFlightFilterVC[0];
        vm.clickListFlightFilterVC = function (itemName) {
            // vm.selectedListFlightFilterVC = item;
            $timeout(function(){
                // for(var filterIndex = 0; filterIndex < vm.listFlightFilterVC.length; filterIndex++){
                //     if (vm.listFlightFilterVC[filterIndex].filterName === itemName) {
                //             vm.selectedListFlightFilterVC = vm.listFlightFilterVC[filterIndex];
                //     }
                // }
                vm.selectedListFlightFilterVC = itemName;
            });
        };

        vm.clickHoursFilter = function(item, e){
            vm.selectedHoursFilter = item;
            e.preventDefault();
        };
        vm.hoursFilter = [
            {name: 'Horarios de mañana'},
            {name: 'Horarios de tarde'},
            {name: 'Horarios de noche'}
        ];
        vm.selectedHoursFilter = vm.hoursFilter[0];

        vm.clickListFlightFilter2 = function(item, e){
            vm.selectedListFlightFilter2 = item;
            e.preventDefault();
        };
        vm.listFlightFilter2 = [
            {name: 'Ordenar por salida'},
            {name: 'Ordenar por llegada'},
            {name: 'Ordenar por operador'},
            {name: 'Ordenar por plazas'}
        ];
        vm.selectedListFlightFilter2 = vm.listFlightFilter2[0];

        vm.clickListFareDetail = function(item, e){
            vm.selectedListFareDetail = item;
            e.preventDefault();
        };
        vm.listFareDetail = [
            {name: 'Turista'},
            {name: 'Turista Premium'},
            {name: 'Business'}
        ];
        vm.selectedListFareDetail = vm.listFareDetail[0];

        vm.clickUsers = function(item, e){
            vm.selectedUsers = item;
            e.preventDefault();
        };
        vm.users = [
            {name: 'Maria Ramirez de Avellano'},
            {name: 'Maria Ramirez de Avellano'},
            {name: 'Maria Ramirez de Avellano'}
        ];
        vm.selectedUsers = vm.users[0];
    }
})();