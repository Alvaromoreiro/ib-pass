import { MMBDatalayerConstants } from "@src/components/services/ib-MmB-datalayer/constants/ib-MmB-datalayer-constants";

(function () {
    'use strict';

    angular
        .module('ib-MmB-voucher-refund-summary-module')
        .controller('VoucherRefundSummaryController', VoucherRefundSummaryController);

    VoucherRefundSummaryController.$inject = ['$rootScope', 'MmBModalService', 'MmBAppConstants', 'MmBDatalayerUtilsService', 'localStorageService', 'CommonsUtilService', 'MmBUtilsSharedService'];
    function VoucherRefundSummaryController($rootScope, MmBModalService, MmBAppConstants, MmBDatalayerUtilsService, localStorageService, CommonsUtilService, MmBUtilsSharedService) {
        var vm = this;
        vm.openContinueModal = openContinueModal;
        vm.closeFullModal = closeFullModal;
        vm.$onInit = activate;
        vm.checkUSRoute = checkUSRoute;
        vm.multipleVoucherAmount = 'MULTIPLE';
        vm.voucherEmailNotification = localStorageService.get('voucherEmailNotification');
        vm.cashEmailNotification = localStorageService.get('cashEmailNotification');
        vm.voucherFlow =localStorageService.get('voucherEmailNotificationFlow');
        vm.cashFlow = localStorageService.get('cashEmailNotificationFlow');
        vm.percentage = localStorageService.get('refundPercentage');
        vm.bookingInfo = localStorageService.get('bookingInfo');

        function activate() {
            if (vm.contactInfo) {
                if (vm.isDisruption){
                    MmBUtilsSharedService.updateQuadrigam(MmBAppConstants.QUADRIGAM.DISRUPTION_VOUCHER_REFUND_SUMMARY, MMBDatalayerConstants.DIGITAL_DATA_PROCESS.RVDDBD, MMBDatalayerConstants.DIGITAL_DATA_STEP.RVDDBD);
                } else{
                    CommonsUtilService.setTitlePage('MMB_TITLE_FLEXIBILIZATION_VOUCHER_REFUND_SUMMARY');
                    MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS.RVFDBD,MMBDatalayerConstants.DIGITAL_DATA_STEP.RVFDBD, MmBAppConstants.QUADRIGAM.FLEXIBILIZATION_VOUCHER_REFUND_SUMMARY);
                }
            } else {
                if (vm.isDisruption){
                    CommonsUtilService.setTitlePage('MMB_TITLE_DISTUPTION_CASH_REFUND_SUMARY');
                    MmBUtilsSharedService.updateQuadrigam(MmBAppConstants.QUADRIGAM.DISRUPTION_CASH_REFUND_SUMMARY, MMBDatalayerConstants.DIGITAL_DATA_PROCESS.RCDDBD, MMBDatalayerConstants.DIGITAL_DATA_STEP.RCDDBD);
                }else{
                    MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS.RCFDBD,MMBDatalayerConstants.DIGITAL_DATA_STEP.RCFDBD, MmBAppConstants.QUADRIGAM.FLEXIBILIZATION_CASH_REFUND_SUMMARY);
                }
            }
            //CommonsUtilService.setTitlePage('MMB_TITLE_PAGE_REFUND_SELECT');
        }

        // Handler to check if the route has USA as departure or arrival city and if cash refund is available
        function checkUSRoute() {
            if(!vm.bookingInfo?.orderFlags?.some(flag => flag.type === 'ALLOWED_REFUND_CASH' && flag.enabled)) {
                return false;
            }
     
            return vm.bookingInfo?.order?.slices?.some(slice =>
                slice.segments?.some(segment =>
                    segment.arrivalCity.countryCode === 'US' ||
                    segment.departureCity.countryCode === 'US'
                )
            ) ?? false;
        }

        function openContinueModal() {
            var modalBody = {}, quadrigam, redirectionFunction, processDatalayer, stepDatalayer;
            if((vm.voucherFlow && !vm.voucherEmailNotification) || (vm.cashFlow && !vm.cashEmailNotification)){
                //Open modal until its correctly set
                if(vm.voucherFlow){
                    redirectionFunction = redirectVoucher;
                    angular.extend(modalBody, MmBAppConstants.EMAIL_NOTIFICATION.VOUCHER);
                    if(vm.isDisruption){
                        quadrigam = MmBAppConstants.QUADRIGAM.DISRUPTION_VOUCHER_REFUND_ACCEPTANCE_MODAL;
                        processDatalayer = MMBDatalayerConstants.DIGITAL_DATA_PROCESS.RVDCEB;
                        stepDatalayer = MMBDatalayerConstants.DIGITAL_DATA_STEP.RVDCEB;
                    }else{
                        quadrigam = MmBAppConstants.QUADRIGAM.FLEXIBILIZATION_VOUCHER_REFUND_ACCEPTANCE_MODAL;
                        processDatalayer = MMBDatalayerConstants.DIGITAL_DATA_PROCESS.RVFCEB;
                        stepDatalayer = MMBDatalayerConstants.DIGITAL_DATA_STEP.RVFCEB;
                    }
                }
                if(vm.cashFlow){
                    redirectionFunction = redirectCash;
                    angular.extend(modalBody, MmBAppConstants.EMAIL_NOTIFICATION.CASH);
                    if(vm.isDisruption){
                        quadrigam = MmBAppConstants.QUADRIGAM.DISRUPTION_CASH_REFUND_CONFIRMATION_MODAL;
                        processDatalayer = MMBDatalayerConstants.DIGITAL_DATA_PROCESS.RCDCEB;
                        stepDatalayer = MMBDatalayerConstants.DIGITAL_DATA_STEP.RCDCEB;
                    }else{
                        quadrigam = MmBAppConstants.QUADRIGAM.FLEXIBILIZATION_CASH_REFUND_ACCEPTANCE_MODAL;
                        processDatalayer = MMBDatalayerConstants.DIGITAL_DATA_PROCESS.RVFCEB;
                        stepDatalayer = MMBDatalayerConstants.DIGITAL_DATA_STEP.RVFCEB;
                    }
                }
                modalBody.accept = 'MMB_VOUCHER_REFUND_BREAKDOWN_MODAL_BUTTON_TEXT';
                modalBody.cancel = 'MODAL_CANCEL';
                modalBody.data = {};
                modalBody.needsTranslate = true;
                MmBUtilsSharedService.updateQuadrigam(quadrigam, processDatalayer, stepDatalayer);
                MmBModalService.showGenericModal(true, 'ib-voucher-email-notification-modal.html', modalBody).result.then(redirectionFunction, angular.noop);
            }else{
                if (vm.contactInfo) {
                    const isUSRoute = checkUSRoute();

                    modalBody = {
                        body: 'MMB_VOUCHER_REFUND_BREAKDOWN_MODAL_TEXT',
                        extraBody: isUSRoute ? 'MMB_VOUCHER_REFUND_BREAKDOWN_MODAL_TEXT_3' : 'MMB_VOUCHER_REFUND_BREAKDOWN_MODAL_TEXT_2',
                        title: 'MMB_VOUCHER_REFUND_BREAKDOWN_MODAL_TITLE',
                        accept: 'MMB_VOUCHER_REFUND_BREAKDOWN_MODAL_BUTTON_TEXT',
                        cancel: 'MODAL_CANCEL',
                        needsTranslate: true
                    };
                    if (vm.isDisruption){
                        MmBUtilsSharedService.updateQuadrigam(MmBAppConstants.QUADRIGAM.DISRUPTION_VOUCHER_REFUND_ACCEPTANCE_MODAL, MMBDatalayerConstants.DIGITAL_DATA_PROCESS.RVDCEB, MMBDatalayerConstants.DIGITAL_DATA_STEP.RVDCEB);
                    }else{
                        CommonsUtilService.setTitlePage('MMB_TITLE_FLEXIBILIZATION_VOUCHER_REFUND_CONFIRMATION');
                        MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS.RVFCEB,MMBDatalayerConstants.DIGITAL_DATA_STEP.RVFCEB, MmBAppConstants.QUADRIGAM.FLEXIBILIZATION_VOUCHER_REFUND_ACCEPTANCE_MODAL);
                    }
                } else {
                    modalBody = {
                        body: 'MMB_CASH_REFUND_MODAL_MESSAGE',
                        title: 'MMB_CASH_REFUND_MODAL_TITLE',
                        accept: 'MMB_VOUCHER_REFUND_BREAKDOWN_MODAL_BUTTON_TEXT',
                        cancel: 'MODAL_CANCEL',
                        needsTranslate: true
                    };
                    if (vm.isDisruption){
                        MmBUtilsSharedService.updateQuadrigam(MmBAppConstants.QUADRIGAM.DISRUPTION_CASH_REFUND_CONFIRMATION_MODAL, MMBDatalayerConstants.DIGITAL_DATA_PROCESS.RCDCEB, MMBDatalayerConstants.DIGITAL_DATA_STEP.RCDCEB);
                    } else{
                        MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS.RCFCEB,MMBDatalayerConstants.DIGITAL_DATA_STEP.RCFCEB, MmBAppConstants.QUADRIGAM.FLEXIBILIZATION_CASH_REFUND_ACCEPTANCE_MODAL);
                    }
                }
                MmBModalService.showGenericModal(false, 'generic-complete-modal.html', modalBody).result.then(function () {
                    if (vm.contactInfo) {
                        continueVoucherFlow();
                    } else
                        $rootScope.$emit('proceedToCashNextStep');

                }, angular.noop);
            }
            function redirectVoucher(){
                localStorageService.set('voucherEmailNotificationValue', modalBody.data.email);
                continueVoucherFlow();
            }
            function redirectCash(){
                localStorageService.set('cashEmailNotificationValue', modalBody.data.email);
                $rootScope.$emit('proceedToCashNextStep');
            }
            function continueVoucherFlow(){
                $rootScope.$emit('proceedToVoucherNextStep', vm.multipleVoucherAmount);
            }
        }

        function closeFullModal() {
            $rootScope.$broadcast('closeEntireModal');
        }
    }
})();
