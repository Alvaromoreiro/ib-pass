(function () {
    'use strict';

    angular
        .module('ib-cki-modal-module')
        .controller('UnavailableModalController', UnavailableModalController);

    UnavailableModalController.$inject = ['$uibModalInstance', 'ModalService', '$location', 'CkiDatalayerUtilsService'];
    function UnavailableModalController ($uibModalInstance, ModalService, $location, CkiDatalayerUtilsService) {

        const vm = this;

        activate();

        ////////////////

        /**
         * Initialize modal controller
         */
        function activate () {
            /* INIT DELETE GA4 MIGRATION*/
            CkiDatalayerUtilsService.sendDatalayerErrorEvent({message : '' , errorCode : '' , internalErrorCode : 'NO_SEGMENTS_AVAILABLE'});
            /* FIN DELETE GA4 MIGRATION*/
            CkiDatalayerUtilsService.sendDigitalDataErrorEvent({message : '' , errorCode : '' , internalErrorCode : 'NO_SEGMENTS_AVAILABLE'});

            $uibModalInstance.result.then(CkiDatalayerUtilsService.removeDatalayerErrorAttrs, CkiDatalayerUtilsService.removeDatalayerErrorAttrs);
        }

        vm.continueStep = function () {
            $location.path('/ibcose');
            $uibModalInstance.dismiss('cancel');
        };

    }
})();