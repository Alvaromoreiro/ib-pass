import { MMBDatalayerConstants } from "@src/components/services/ib-MmB-datalayer/constants/ib-MmB-datalayer-constants";

(function () {
    'use strict';

    angular
        .module('ib-MmB-your-hotel-holidays-tab-module')
        .controller('MmBYourHotelHolidaysTabController', MmBYourHotelHolidaysTabController);

    MmBYourHotelHolidaysTabController.$inject = ['$scope', 'MmBModalService', 'MmBDatalayerUtilsService', 'MmBAppConstants'];
    function MmBYourHotelHolidaysTabController($scope, MmBModalService, MmBDatalayerUtilsService, MmBAppConstants) {
        var vm = this;

        vm.$onInit = activate;

        $scope.$on('openFareModal', openFareWindowModal);

        function activate() {
            MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS.IBMTFL, MMBDatalayerConstants.DIGITAL_DATA_STEP.IBMTFL, MmBAppConstants.QUADRIGAM.YOUR_FLIGHTS);
        }

        /**
        * Open a modal window for show all conditions of rate selected
        * @param {Object} event Event
        * @param {Object} conditions All conditions of rate selected
        */
        function openFareWindowModal(event, selectedFareInfo) {
            angular.extend(selectedFareInfo, { 'idModal': 'ib-compare-fares-modal' });
            MmBModalService.showGenericModal(false, 'ib-compare-fares-modal.html', { 'selectedFareInfo': selectedFareInfo }).result.then(angular.noop, angular.noop);
        }
    }
})();
