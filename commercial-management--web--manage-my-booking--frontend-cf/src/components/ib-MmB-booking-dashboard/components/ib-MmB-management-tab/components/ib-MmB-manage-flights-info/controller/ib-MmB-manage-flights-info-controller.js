import { Skeleton } from "commercial-management--digital--web-components-design--library";
(function () {
    'use strict';

    angular
        .module('ib-MmB-manage-flights-info-module')
        .controller('MmBManageFlightsInfoController', MmBManageFlightsInfoController);

    MmBManageFlightsInfoController.$inject = ['$rootScope', '$filter', 'localStorageService'];
    function MmBManageFlightsInfoController($rootScope, $filter, localStorageService) {
        var vm = this;
        vm.event = null;
        vm.$onInit = activate;
        vm.skeletonComponent = Skeleton;
        vm.getFlightIcon = getFlightIcon;
        vm.skeletonProps = {
            className: 'mmb-skeleton-dashboard mmb-skeleton-dashboard__flight',
        };

        function activate() {
            vm.popoverFlights = [
                { 'text': $filter('translate')('IBCOAC_MMB_REQUEST_BILL_LINK_TITLE'), 'path': null, 'event': null },
                { 'text': $filter('translate')('MMB_CHANGE_FLIGHTS_TITLE'), 'path': null , 'event': vm.event},
                { 'text': $filter('translate')('MMB_NULLIFY_FLIGHTS_TITLE'), 'path': null ,'event': null}
            ];
        }

        function getFlightIcon(flight, index) {
            var aircraftCode = flight.segments[0].flight.aircraft && flight.segments[0].flight.aircraft.code;
            if (aircraftCode === 'TRN') {
                return 'icon-tren';
            }

            return index === 0 ? 'icon-avion_ida' : 'icon-avion_vuelta';
        }
    }
})();