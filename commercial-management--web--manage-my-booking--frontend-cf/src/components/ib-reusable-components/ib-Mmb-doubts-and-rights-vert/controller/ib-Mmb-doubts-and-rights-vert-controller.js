import { MMBDatalayerConstants } from "@src/components/services/ib-MmB-datalayer/constants/ib-MmB-datalayer-constants";

(function () {
    'use strict';

    angular
        .module('ib-MmB-doubts-and-rights-vert-module')
        .controller('MmbDoubtsAndRightsVertController', MmbDoubtsAndRightsVertController);

    MmbDoubtsAndRightsVertController.$inject = ['$scope', 'MmBModalService', 'localStorageService', '$filter', 'MmBDatalayerUtilsService', 'MmBAppConstants', 'RedirectionService'];
    function MmbDoubtsAndRightsVertController($scope, MmBModalService, localStorageService, $filter,  MmBDatalayerUtilsService, MmBAppConstants, RedirectionService) {
        var vm = this;
        vm.showVoucherConditions = showVoucherConditions;
        vm.getVoucherValidity = getVoucherValidity;
        vm.showVoucherTermsAndConditions = showVoucherTermsAndConditions;
        vm.linkToTermsAndConditions = linkToTermsAndConditions;

        vm.$onInit = function () {
            vm.voucherValidity = localStorageService.get('voucherList');
            vm.validityAvailable = !(angular.isUndefined(vm.voucherValidity) || vm.voucherValidity.length < 1 || angular.isUndefined(vm.voucherValidity[0].validityDate));
            vm.flightDateAvailable = !(angular.isUndefined(vm.voucherValidity) || vm.voucherValidity.length < 1 ||  angular.isUndefined(vm.voucherValidity[0].flightDateLimit));
            vm.validityText = getVoucherValidity();
            vm.flightDateLimit = getFlightDateLimit();
            vm.flags = localStorageService.get('orderFlags');
            vm.isDisruption = localStorageService.get('bookingInfo')?.genericDisruptionCapabilitiesInformation ? true : false;
        };

        function showVoucherConditions() {
            if(vm.isDisruption){
                MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS.RVDSMB, MMBDatalayerConstants.DIGITAL_DATA_STEP.RVDSMB, MmBAppConstants.QUADRIGAM.DISRUPTION_VOUCHER_REFUND_INFO);
            }else {
                MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS.RVFSMB, MMBDatalayerConstants.DIGITAL_DATA_STEP.RVFSMB, MmBAppConstants.QUADRIGAM.FLEXIBILIZATION_VOUCHER_REFUND_INFO);
            }
            MmBModalService.showGenericModal(false, 'ib-modal-voucher-terms-and-conditions.html', {}, 'ib-modals ib-modals--md').result.then(angular.noop, angular.noop);
        }


        function getVoucherValidity() {
            var validityDate, formattedValidityDate;
            if (vm.voucherValidity[0].validityDate) {
                validityDate = $filter('DateFormatFilter')(vm.voucherValidity[0].validityDate);
                formattedValidityDate = validityDate.formatedDate;
            }
            return formattedValidityDate;
        }
        function getFlightDateLimit() {
            var flightDateLimit, formattedFlightDateLimit;
            if (vm.voucherValidity[0].flightDateLimit) {
                flightDateLimit = $filter('DateFormatFilter')(vm.voucherValidity[0].flightDateLimit);
                formattedFlightDateLimit = flightDateLimit.formatedDate;
            }
            return formattedFlightDateLimit;
        }
        function showVoucherTermsAndConditions() {
            MmBModalService.showGenericModal(false, 'ib-modal-voucher-new-terms-and-conditions.html', {}, 'ib-modals ib-modals--md').result.then(angular.noop, angular.noop);
        }

        function linkToTermsAndConditions() {
            if(!vm.isDisruption){
                MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS.RVFTYC, MMBDatalayerConstants.DIGITAL_DATA_STEP.RVFTYC, MmBAppConstants.QUADRIGAM.FLEXIBILIZATION_VOUCHER_REFUND_CONDITIONS);
                const linkToRedirect = vm.flags && vm.flags.refundVoucherSection80 ? $filter('LinksFilter')('VOUCHER_KNOW_MORE_FLEX') : $filter('LinksFilter')('VOUCHER_KNOW_MORE');
                RedirectionService.newNavigation(linkToRedirect);
            }
            else {
                MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS.RVDTYC, MMBDatalayerConstants.DIGITAL_DATA_STEP.RVDTYC, MmBAppConstants.QUADRIGAM.DISRUPTION_VOUCHER_REFUND_CONDITIONS);
                const linkToRedirect = vm.flags && vm.flags.refundVoucherSection80 ? $filter('LinksFilter')('VOUCHER_KNOW_MORE_FLEX') : $filter('LinksFilter')('VOUCHER_KNOW_MORE');
                RedirectionService.newNavigation(linkToRedirect);
            }
        }
    }
})();
