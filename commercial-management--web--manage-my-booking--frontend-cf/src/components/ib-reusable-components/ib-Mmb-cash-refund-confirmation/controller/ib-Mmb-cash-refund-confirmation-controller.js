import { MMBDatalayerConstants } from "@src/components/services/ib-MmB-datalayer/constants/ib-MmB-datalayer-constants";

(function () {
    'use strict';

    angular
        .module('ib-Mmb-cash-refund-confirmation-module')
        .controller('CashRefundConfirmationController', CashRefundConfirmationController);

    CashRefundConfirmationController.$inject = ['MmBAppConstants', 'MmBDatalayerUtilsService', 'MmBUtilsSharedService'];
    function CashRefundConfirmationController(MmBAppConstants, MmBDatalayerUtilsService, MmBUtilsSharedService) {
        var vm = this;
        vm.$onInit = activate;

        function activate() {
            if (vm.isDisruption) {
                MmBUtilsSharedService.updateQuadrigam(MmBAppConstants.QUADRIGAM.DISRUPTION_CASH_REFUND_CONFIRMATION_PAGE, MMBDatalayerConstants.DIGITAL_DATA_PROCESS.RCDCEB, MMBDatalayerConstants.DIGITAL_DATA_STEP.RCDCEB);
            } else {
                MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS.RCFCFP,MMBDatalayerConstants.DIGITAL_DATA_STEP.RCFCFP, MmBAppConstants.QUADRIGAM.FLEXIBILIZATION_CASH_REFUND_CONFIRMATION_PAGE);
            }
        };
    };
})();
