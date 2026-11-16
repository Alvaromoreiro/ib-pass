import { MMBDatalayerConstants } from "@src/components/services/ib-MmB-datalayer/constants/ib-MmB-datalayer-constants";

(function () {
    'use strict';

    angular
        .module('ib-MmB-refunds-tab-module')
        .controller('RefundsTabController', RefundsTabController);

    RefundsTabController.$inject = ['MmBAppConstants', 'MmBDatalayerUtilsService', 'localStorageService', 'RedirectionService', '$filter', 'CommonsUtilService'];
    function RefundsTabController(MmBAppConstants, MmBDatalayerUtilsService, localStorageService, RedirectionService, $filter, CommonsUtilService) {
        var vm = this;
        vm.redirectToExternalVoucherForm = redirectToExternalVoucherForm;
        vm.$onInit = activate;

        function activate() {
            CommonsUtilService.setTitlePage('MMB_TITLE_PAGE_REFUND_SUMMARY');
            const bookingInfo = localStorageService.get('bookingInfo');
            var fareFamilyConditions = localStorageService.get('fareFamilyConditionsConditions'), flexibilityConditions = localStorageService.get('flexibilityConditions');
            vm.isFlex = bookingInfo.flexibilizationCapabilitiesInformation;
            vm.isDigital = !bookingInfo.flexibilizationCapabilitiesInformation;
            checkConditions(fareFamilyConditions, flexibilityConditions);
            MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS.RVFDBT, MMBDatalayerConstants.DIGITAL_DATA_STEP.RVFDBT, MmBAppConstants.QUADRIGAM.FLEXIBILIZATION_REFUND_BEGGINING);
        }

        function redirectToExternalVoucherForm() {
            var bookingInfo = localStorageService.get('bookingInfo') || null, email = null;
            email = bookingInfo && bookingInfo.order && bookingInfo.order.primaryContactInfo && bookingInfo.order.primaryContactInfo.email ? bookingInfo.order.primaryContactInfo.email : '';
            RedirectionService.externalRedirect($filter('LinksFilter')('DISRUPTION_REFUND_EXTERNAL_LINK') + '?pnr=' + localStorageService.get('PNR') + '&lastname=' + localStorageService.get('checkinSurname')
                + '&email=' + email + '&fc=C');
        };

        function checkConditions(fareFamilyConditions, flexibilityConditions) {
            var i, j, voucherOrderItemsPrice = localStorageService.get('voucherOrderItemsPrice');
            if (fareFamilyConditions != null) {
                for (i = 0; i < fareFamilyConditions.length; i++) {
                    for (j = 0; j < fareFamilyConditions[i].conditions.length; j++) {
                        if (fareFamilyConditions[i].conditions[j].code === 'REEMBOLSO') {
                            vm.flexPercentage = voucherOrderItemsPrice;
                            localStorageService.set('refundPercentage', vm.flexPercentage);
                        }
                    }
                }
            }
            if (flexibilityConditions != null && angular.isUndefined(vm.flexPercentage)) {
                vm.flexPercentage = voucherOrderItemsPrice;
                localStorageService.set('refundPercentage', vm.flexPercentage);
            }
        }
    }
})();
