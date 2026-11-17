(function () {
    'use strict';

    angular
        .module('ib-cki-modal-module')
        .controller('checkInGroupModalController', checkInGroupModalController);

    checkInGroupModalController.$inject = ['$uibModalInstance', 'ModalService', 'object', 'CkiDatalayerConstants', 'CkiDatalayerUtilsService'];
    function checkInGroupModalController ($uibModalInstance, ModalService, object, CkiDatalayerConstants, CkiDatalayerUtilsService) {
        const vm = this;
        vm.checkinSegmentsGroup = object.allSegmentsInfo;
        vm.close = close;

        activate();

        ////////////////

        /**
         * Initialize modal controller
         */
        function activate () {
            CkiDatalayerUtilsService.sendDatalayerModalEvent({ idModal: CkiDatalayerConstants.DATALAYER_MODAL_ID.SEGMENT_IN_GROUP_WARNING });
            $uibModalInstance.result.then(CkiDatalayerUtilsService.removeDatalayerModalAttrs, CkiDatalayerUtilsService.removeDatalayerModalAttrs);
        }

        function close () {
            $uibModalInstance.dismiss('cancel');
        }

    }
})();
