(function () {
    'use strict';

    angular
        .module('ib-MmB-modal-module')
        .controller('MmBGenericErrorModalController', MmBGenericErrorModalController);

    MmBGenericErrorModalController.$inject = ['$uibModalInstance', 'errorObject', 'MmBDatalayerUtilsService'];
    function MmBGenericErrorModalController ($uibModalInstance, errorObject, MmBDatalayerUtilsService) {
        const vm = this;
        vm.model = errorObject;

        activate();

        vm.close = closeErrorModal;
        vm.accept = acceptErrorModal;

        ////////////////

        /**
         * Initialize modal controller
         */
        function activate () {
            MmBDatalayerUtilsService.sendDatalayerErrorEvent(vm.model);
            $uibModalInstance.result.then(MmBDatalayerUtilsService.removeDatalayerErrorAttrs, MmBDatalayerUtilsService.removeDatalayerErrorAttrs);
        }

        /**
         * Closes the error modal dismissing its instance
         */
        function closeErrorModal () {
            $uibModalInstance.dismiss();
        }

        /**
         * Closes the error modal calling close method of its instance
         */
        function acceptErrorModal () {
            $uibModalInstance.close();
        }
    }
})();