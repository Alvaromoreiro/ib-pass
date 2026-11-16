import { MMBDatalayerConstants } from "@src/components/services/ib-MmB-datalayer/constants/ib-MmB-datalayer-constants";

(function () {
    'use strict';

    angular
        .module('ib-Mmb-voucher-refund-confirmation-module')
        .controller('VoucherRefundConfirmationController', VoucherRefundConfirmationController);

    VoucherRefundConfirmationController.$inject = ['MmBAppConstants', 'MmBDatalayerUtilsService', 'MmBModalService', 'localStorageService', 'MmBUtilsSharedService'];
    function VoucherRefundConfirmationController(MmBAppConstants, MmBDatalayerUtilsService, MmBModalService, localStorageService, MmBUtilsSharedService) {
        var vm = this;
        vm.$onInit = activate;
        vm.openVoucherModal = openVoucherModal;

        function activate() {
            if (!vm.voucherData.hasMoreThanOneVouchers) {
                if (vm.isDisruption) {
                    MmBUtilsSharedService.updateQuadrigam(MmBAppConstants.QUADRIGAM.DISRUPTION_VOUCHER_REFUND_CONFIRMATION_SINGLE_PAX, MMBDatalayerConstants.DIGITAL_DATA_PROCESS.RVDCFP, MMBDatalayerConstants.DIGITAL_DATA_STEP.RVDCFP);
                } else {
                    MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS.RVFCFP,MMBDatalayerConstants.DIGITAL_DATA_STEP.RVFCFP, MmBAppConstants.QUADRIGAM.FLEXIBILIZATION_VOUCHER_REFUND_CONFIRMATION_SINGLE_PAX);
                }
            } else {
                if (vm.isDisruption) {
                    MmBUtilsSharedService.updateQuadrigam(MmBAppConstants.QUADRIGAM.DISRUPTION_VOUCHER_REFUND_CONFIRMATION_MULTIPLE_PAX, MMBDatalayerConstants.DIGITAL_DATA_PROCESS.RVDCFP, MMBDatalayerConstants.DIGITAL_DATA_STEP.RVDCFP);
                } else {
                    MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS.RVFCFP,MMBDatalayerConstants.DIGITAL_DATA_STEP.RVFCFP, MmBAppConstants.QUADRIGAM.FLEXIBILIZATION_VOUCHER_REFUND_CONFIRMATION_MULTIPLE_PAX);
                }
            }
            vm.flags = localStorageService.get('orderFlags');
            //CommonsUtilService.setTitlePage('MMB_TITLE_PAGE_REFUND_CONFIRMATION');
        }

        function openVoucherModal() {
            MmBModalService.showGenericModal(false, 'ib-modal-voucher-terms-and-conditions.html', {}, 'ib-modals ib-modals--md').result.then(angular.noop, angular.noop);
        }
    }
})();
