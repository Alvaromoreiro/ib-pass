import { timeout } from "rxjs";

(function () {
    'use strict';

    angular
        .module('ib-cki-modal-module')
        .controller('UpgradeCkiKnowMoreController', UpgradeCkiKnowMoreController);

    UpgradeCkiKnowMoreController.$inject = ['$scope', '$uibModalInstance', 'object', 'CkiDatalayerUtilsService', '$rootScope'];
    function UpgradeCkiKnowMoreController ($scope, $uibModalInstance, object, CkiDatalayerUtilsService, $rootScope) {

        const vm = this;
        vm.close = close;
        vm.openSeatdModal = openSeatdModal;
        vm.model = object;
        //vm.loadOffer = loadOffer;
        activate();

        ////////////////

        /**
         * Initialize modal controller
         */
        function activate () {
            CkiDatalayerUtilsService.sendDatalayerModalEvent(vm.model);
        }


        /**
         * Cllose modal
         */
        function close () {
            $uibModalInstance.dismiss('dismiss');
            $uibModalInstance.result.then(CkiDatalayerUtilsService.removeDatalayerModalAttrs, CkiDatalayerUtilsService.removeDatalayerModalAttrs);
        }

        /**
         * Load the new offer
         * @param {Integer,indexSelected Index of offer to load

        function loadOffer (currentCabin, segmentInfo, indexSelected) {
            close();
            $rootScope.$broadcast('openOfferCondition', { currentCabin: currentCabin, segmentInfo: segmentInfo, offerSelected: indexSelected });
        }*/

        function openSeatdModal (currentCabin, segmentInfo, indexSelected) {
            $rootScope.$broadcast('openSeat3dModal', { currentCabin: currentCabin, segmentInfo: segmentInfo, offerSelected: indexSelected });
        }
    }
})();
