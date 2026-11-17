(function () {
    'use strict';

    angular
        .module('ib-cki-modal-module')
        .controller('AcceptSplitModalController', AcceptSplitModalController);

    AcceptSplitModalController.$inject = ['$uibModalInstance', 'ModalService', 'newPnr', 'CkiDatalayerUtilsService', 'CkiDatalayerConstants'];
    function AcceptSplitModalController ($uibModalInstance, ModalService, newPnr, CkiDatalayerUtilsService, CkiDatalayerConstants) {

        const vm = this;
        vm.locator = newPnr;
        vm.close = close;

        activate();

        ////////////////

        /**
         * Initialize modal controller
         */
        function activate () {
            CkiDatalayerUtilsService.sendDatalayerModalEvent({ idModal: CkiDatalayerConstants.DATALAYER_MODAL_ID.BOOKING_SPLIT });
            $uibModalInstance.result.then(CkiDatalayerUtilsService.removeDatalayerModalAttrs, CkiDatalayerUtilsService.removeDatalayerModalAttrs);
        }

        function close () {
            $uibModalInstance.dismiss('cancel');
        }

    }
})();
