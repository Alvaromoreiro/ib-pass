(function () {
    'use strict';

    angular
        .module('ib-modal-module')
        .controller('PaymentGenericErrorModalController', PaymentGenericErrorModalController);

    PaymentGenericErrorModalController.$inject = ['$uibModalInstance', 'errorObject', '$window', '$rootScope', 'DatalayerUtilsService','localStorageService','CommonsUtilService','PmtConstants'];
    function PaymentGenericErrorModalController ($uibModalInstance, errorObject, $window, $rootScope, DatalayerUtilsService, localStorageService,CommonsUtilService, PmtConstants) {
        const vm = this;
        vm.model = errorObject;

        activate();

        vm.close = closeErrorModal;
        vm.accept = acceptErrorModal;
        vm.updateDatalayer = updateDatalayer;

        ////////////////

        function activate () {
            const modelModal = vm.model ? vm.model : {};
            $rootScope.$broadcast('addRejectPayQuadrigam', vm.model);
            $uibModalInstance.result.then(deleteQuadrigam, deleteQuadrigam);
            function deleteQuadrigam () {
                $rootScope.$broadcast('deleteRejectPayQuadrigam', true);
            }
            updateDatalayer(modelModal);
            $uibModalInstance.result.then(DatalayerUtilsService.removeDatalayerModalAttrs, DatalayerUtilsService.removeDatalayerModalAttrs);
        }

        /**
         * Closes the error modal dismissing its instance
         */
        function closeErrorModal () {
            if (!checkTimeOutSesssion()) {
                $uibModalInstance.dismiss();
            } else {
                $window.location.href = $window.location.origin;
            }
        }

        /**
         * Closes the error modal calling close method of its instance
         */
        function acceptErrorModal (type) {
            if (!checkTimeOutSesssion()) {
                $uibModalInstance.close(type);
            } else {
                $window.location.href = $window.location.origin;
            }

        }


        function checkTimeOutSesssion () {
            return (vm.model.internalErrorCode === 'SSE_ORM_9999' || vm.model.internalErrorCode === 'SSE_AVM_9008');
        }

        function updateDatalayer (modelModal) {
            const isBKI = localStorageService.get('flowApp')==='BBKI';
            const isDeniedPayment = modelModal?.errorCode === 449 && modelModal?.internalErrorCode==='PMT_PPM_8009';
            const isRejectedPayment = modelModal?.errorCode === 449 && modelModal?.internalErrorCode==='PMT_PPM_8015';
            const isPCC = (modelModal?.errorCode === 449 || modelModal?.errorCode === 412) && modelModal?.internalErrorCode==='PMT_PPM_8014';
            if(isDeniedPayment && isBKI) {
                /* INIT DELETE GA4 MIGRATION*/
                DatalayerUtilsService.updateDatalayerWithQuadrigam(PmtConstants.QUADRIGAMS.BKI_PAYMENTS_DENIED,null,localStorageService.get('userLogged'));
                /* FINISH DELETE GA4 MIGRATION*/
                DatalayerUtilsService.updateDigitalDataWithQuadrigam(PmtConstants.QUADRIGAMS.BKI_PAYMENTS_DENIED,null,localStorageService.get('userLogged'));
                DatalayerUtilsService.setProcessAndStep(CommonsUtilService.getProcess(),PmtConstants.STEP_BY_QUADRIGAM.BKCCDN,PmtConstants.QUADRIGAMS.BKI_PAYMENTS_DENIED);
            } else if(isRejectedPayment && isBKI) {
                /* INIT DELETE GA4 MIGRATION*/
                DatalayerUtilsService.updateDatalayerWithQuadrigam(PmtConstants.QUADRIGAMS.BKI_PAYMENTS_REJECTED,null,localStorageService.get('userLogged'));
                /* FINISH DELETE GA4 MIGRATION*/
                DatalayerUtilsService.updateDigitalDataWithQuadrigam(PmtConstants.QUADRIGAMS.BKI_PAYMENTS_REJECTED,null,localStorageService.get('userLogged'));
                DatalayerUtilsService.setProcessAndStep(CommonsUtilService.getProcess(),PmtConstants.STEP_BY_QUADRIGAM.BKREJC,PmtConstants.QUADRIGAMS.BKI_PAYMENTS_REJECTED);
            } else if(isPCC && isBKI) {
                /* INIT DELETE GA4 MIGRATION*/
                DatalayerUtilsService.updateDatalayerWithQuadrigam(PmtConstants.QUADRIGAMS.BKI_PCC,null,localStorageService.get('userLogged'));
                /* FINISH DELETE GA4 MIGRATION*/
                DatalayerUtilsService.updateDigitalDataWithQuadrigam(PmtConstants.QUADRIGAMS.BKI_PCC,null,localStorageService.get('userLogged'));
                DatalayerUtilsService.setProcessAndStep(CommonsUtilService.getProcess(),PmtConstants.STEP_BY_QUADRIGAM.BKPPCC,PmtConstants.QUADRIGAMS.BKI_PCC);
            }
            DatalayerUtilsService.sendDatalayerModalEvent(modelModal);
        }
    }
})();