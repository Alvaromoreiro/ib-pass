import { injectIbPmtStylesHost } from '../../../../../styles/ib-pmt-styles-host';

(function () {
    'use strict';
    angular
        .module('ib-pmt-communication-lost-module')
        .controller('PmtCommunicationLostController', PmtCommunicationLostController);
    PmtCommunicationLostController.$inject = ['$rootScope', '$scope', 'ibPmtCommunicationLostService', 'localStorageService', '$window', 'PmtDatalayerUtilsService', 'PmtConstants', 'NewMainHeaderFacade', 'DatalayerUtilsService', 'MonetateUtilsService', 'PmtUtilsService', 'PmtDatalayerConstants', 'DigitalDataService','CommonsUtilService', 'DatalayerMMBConstants'];
    function PmtCommunicationLostController ($rootScope, $scope, ibPmtCommunicationLostService, localStorageService, $window, PmtDatalayerUtilsService, PmtConstants, NewMainHeaderFacade, DatalayerUtilsService, MonetateUtilsService, PmtUtilsService, PmtDatalayerConstants, DigitalDataService, CommonsUtilService, DatalayerMMBConstants) {

        const vm = this;
        vm.printSummary = printSummary;
        vm.flowApp = localStorageService.get('flowApp');
        $scope.$on('$destroy', () => {
            if (localStorageService.get('flowApp') === PmtConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE || localStorageService.get('flowApp') === PmtConstants.APP_TYPES.MANAGEMYBOOKING_UNIFIED) {
                PmtDatalayerUtilsService.resetDatalayer();
            }
        });

        activate();

        function activate () {
            injectIbPmtStylesHost();
            vm.model = ibPmtCommunicationLostService.getCommunicationLostInfo();
            vm.flowApp = localStorageService.get('flowApp');
            localStorageService.set('previousStepFlow', localStorageService.get('actualStepFlow'));
            localStorageService.set('actualStepFlow', 'confirmation');
            if (vm.flowApp !== PmtConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE && vm.flowApp !== PmtConstants.APP_TYPES.BOOKING && vm.flowApp !== PmtConstants.APP_TYPES.ONHOLD && vm.flowApp !== PmtConstants.APP_TYPES.MANAGEMYBOOKING_UNIFIED) {
                $rootScope.showMainHeader = false;
                $rootScope.showHeaders = false;
            } else {
                $rootScope.showMainHeader = false;
                $rootScope.showHeaders = true;
            }

            if (vm.flowApp === PmtConstants.APP_TYPES.BOOKING || vm.flowApp === PmtConstants.APP_TYPES.ONHOLD) {
                NewMainHeaderFacade.updateSteps(localStorageService.get('actualStepFlow'));
                NewMainHeaderFacade.showLogin();
            }
            if (vm.model.quadrigam) {
                /* INIT DELETE GA4 MIGRATION */
                DatalayerUtilsService.updateDatalayerWithQuadrigam(vm.model.quadrigam, null, PmtUtilsService.isUserLogged());
                DatalayerUtilsService.sendDatalayerEvent(PmtDatalayerConstants.DATALAYER_EVENT_TYPES.VIEW);
                /* FINISH DELETE GA4 MIGRATION */
                DatalayerUtilsService.updateDigitalDataWithQuadrigam(vm.model.quadrigam, null, PmtUtilsService.isUserLogged());
                DigitalDataService.emitViewEvent();
                MonetateUtilsService.updateMonetateInfo();
                switch(vm.flowApp) {
                        case PmtConstants.APP_TYPES.BOOKING:
                            DatalayerUtilsService.setProcessAndStep(CommonsUtilService.getProcess(),PmtConstants.STEP_BY_QUADRIGAM.BKBKER,PmtConstants.QUADRIGAMS.BOOKING_COMMUNICATION_LOST);
                            break;
                        case PmtConstants.APP_TYPES.MANAGEMYBOOKING_UNIFIED:
                        case PmtConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE:
                            CommonsUtilService.setTitlePage('MMB_TITLE_VOLUNTARY_CONFIRM_INTERRUPTED');
                            const bookingInfo = localStorageService.get('bookingInfo');
                            let process = PmtConstants.PROCESS_BY_QUADRIGAM[vm.model.quadrigam];
                            const step = PmtConstants.STEP_BY_QUADRIGAM[vm.model.quadrigam];
                            if(PmtConstants.MMB_DISRUPTION_PAYMENT_QUADRIGAM_UN_UNTK.includes(vm.model.quadrigam)) {
                                switch (bookingInfo.order.status) {
                                        case PmtConstants.MMB_DISRUPTION_ORDER_STATUS.UN: //involuntary change without alternative (UN)
                                            process = PmtConstants.PROCESS_DISRUPTION.CANCELLATION;
                                            break;
                                        case PmtConstants.MMB_DISRUPTION_ORDER_STATUS.UNTK: //involuntary change with alternative (UN/TK)
                                            process = PmtConstants.PROCESS_DISRUPTION.CANCELLATION_ALTERNATIVE;
                                            break;
                                }
                            }
                            DatalayerUtilsService.setProcessAndStep(process, step, vm.model.quadrigam);
                            break;
                        default: break;
                }
            }
            if (localStorageService.get('selectedAviosDisccount')) {
                sessionStorage.removeItem('customerData');
                sessionStorage.removeItem('retrieveMemberDetail');
            }
        }

        function printSummary () {
            $window.print();
        }

    }
})();
