import { MMBDatalayerConstants } from "@src/components/services/ib-MmB-datalayer/constants/ib-MmB-datalayer-constants";

(function () {
    'use strict';

    angular
        .module('ib-MmB-your-documents-tab-module')
        .controller('MmBYourDocumentsTabController', MmBYourDocumentsTabController);

    MmBYourDocumentsTabController.$inject = ['$scope', 'MmBModalService', 'MmBDatalayerUtilsService', 'MmBAppConstants', 'CommonsUtilService'];
    function MmBYourDocumentsTabController ($scope, MmBModalService, MmBDatalayerUtilsService, MmBAppConstants, CommonsUtilService) {
        const vm = this;

        vm.$onInit = activate;

        $scope.$on('openFareModal', openFareWindowModal);

        function activate () {
            //CommonsUtilService.setTitlePage('MMB_TITLE_PAGE_MANAGE_FLIGHTS');
            CommonsUtilService.setTitlePage('MMB_TITLE_PAGE_YOUR_DOCUMENTS');
            MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS.MODDOC, MMBDatalayerConstants.DIGITAL_DATA_STEP.MODDOC, MmBAppConstants.QUADRIGAM.YOUR_DOCUMENTS);
        }

        /**
        * Open a modal window for show all conditions of rate selected
        * @param {Object} event Event
        * @param {Object} conditions All conditions of rate selected
        */
        function openFareWindowModal (event, selectedFareInfo) {
            angular.extend(selectedFareInfo, { idModal: 'ib-compare-fares-modal' });
            MmBModalService.showGenericModal(false, 'ib-compare-fares-modal.html', { selectedFareInfo: selectedFareInfo }).result.then(angular.noop, angular.noop);
        }
    }
})();
