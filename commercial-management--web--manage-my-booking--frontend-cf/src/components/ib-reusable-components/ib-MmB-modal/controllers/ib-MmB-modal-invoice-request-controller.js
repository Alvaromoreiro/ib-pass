import { MMBDatalayerConstants } from "@src/components/services/ib-MmB-datalayer/constants/ib-MmB-datalayer-constants";

(function () {
    'use strict';

    angular
        .module('ib-MmB-modal-module')
        .controller('MmBModalInvoiceRequestController', MmBModalInvoiceRequestController);

    MmBModalInvoiceRequestController.$inject = [
        '$uibModalInstance',
        'object',
        'InvoiceDuplicateService',
        '$timeout',
        'MmBAppConstants',
        'MmBDatalayerUtilsService',
    ];

    function MmBModalInvoiceRequestController(
        $uibModalInstance,
        object,
        InvoiceDuplicateService,
        $timeout,
        MmBAppConstants,
        MmBDatalayerUtilsService
        ) {
        var vm = this;
        vm.model = object;
        vm.modalInvoiceForm = null;
        vm.validationError = false;
        vm.$onInit = activate;
        vm.close = closeModal;
        vm.resend = resend;

        /**
         * Initialize modal controller
         */
        function activate() {
            vm.model.showOk = false;
            vm.model.showError = false;
            vm.model.submitted = false;
            vm.model.showErrorConfirmation = false;
            vm.model.showOkConfirmation = false;
            vm.model.email = object.invoiceDetail.shippingData.email;
            if (vm.model.invoiceDetail.stateRequested === MmBAppConstants.INVOICE_STATES.ISSUED){
                setDigitalData(MmBAppConstants.QUADRIGAM.INVOICE_MODAL_ISSUED);
            } else {
                setDigitalData(MmBAppConstants.QUADRIGAM.INVOICE_MODAL_REVIEW_REQUEST);
            }
        };

        const setDigitalData = (quadrigam) => {
            MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS[quadrigam],MMBDatalayerConstants.DIGITAL_DATA_STEP[quadrigam], quadrigam);
        };

        /**
         * Closes the modal dismissing its instance
         */
        function closeModal() {
            if (angular.isDefined(vm.showError) && angular.isDefined(vm.submitted)) {
                vm.showError = false;
                vm.submitted = false;
            }
            $uibModalInstance.close();
        }

        /**
         * Send to service mail of the form & ticketsNumber
         */
        function resend() {
            vm.validationError = false;
            vm.model.showOk = false;
            vm.model.showError = false;
            vm.model.showErrorConfirmation = false;
            vm.model.showOkConfirmation = false;
            vm.modalInvoiceForm.$submitted = true;
            vm.model.submitted = true;
            if (vm.modalInvoiceForm.$valid) {
                let invoiceDuplicateRequestBody = {
                    ticketsNumber: [vm.model.invoiceDetail.ticketNumber],
                    email: vm.modalInvoiceForm.email.$modelValue
                };
                InvoiceDuplicateService.sendInvoiceDuplicate(invoiceDuplicateRequestBody).then(function (data) {
                    if (data && data[0].status === "FAILURE") {
                        vm.model.showOk = false;
                        vm.model.showError = true;
                    } else {
                        vm.model.showOk = true;
                        vm.model.showError = false;
                    }
                    setDigitalData(MmBAppConstants.QUADRIGAM.INVOICE_MODAL_RESEND);
                    closeMessageWithTimeout(false);
                }, function (error) {
                    vm.model.showOk = false;
                    vm.model.showError = true;
                    closeMessageWithTimeout(false);
                    setDigitalData(MmBAppConstants.QUADRIGAM.INVOICE_ERROR_RESEND);

                });
            } else {
                vm.validationError = true;
                vm.model.showOk = false;
                vm.model.submitted = false;
                closeMessageWithTimeout(false);
            }
        }

        /**
         * Close the service message with timeout & close the modal or not
         */
        function closeMessageWithTimeout (closeModal) {
            $timeout(function () {
                if (vm.model.showError) {
                    vm.model.showErrorConfirmation = true;
                }
                if (vm.model.showOk) {
                    vm.model.showOkConfirmation = true;
                }
                vm.model.submitted = false;
                vm.model.showError = false;
                vm.model.showOk = false;
                if (closeModal) {
                    $uibModalInstance.close();
                }
            }, 3000);
        }
    }
})();
