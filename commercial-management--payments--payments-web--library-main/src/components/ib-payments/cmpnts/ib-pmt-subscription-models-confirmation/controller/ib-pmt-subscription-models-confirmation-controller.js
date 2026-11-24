import { injectIbPmtStylesHost } from '../../../../../styles/ib-pmt-styles-host';

(function () {
    'use strict';

    angular
        .module('ib-pmt-subscription-models-confirmation-module')
        .controller('SubscriptionModelsConfirmationController', SubscriptionModelsConfirmationController);

    SubscriptionModelsConfirmationController.$inject = ['$scope', '$rootScope', 'DatalayerConstants', 'PmtConstants','CurrencyService', 'SubscriptionModelsConfirmationService', 'DatalayerUtilsService', 'localStorageService', '$window', 'SubscriptionModelsConfirmationModel', 'PmtComponentUtils', 'NewMainHeaderFacade', 'PmtUtilsService', 'DatalayerGeneralConstants', 'DigitalDataService'];
    function SubscriptionModelsConfirmationController ($scope, $rootScope, DatalayerConstants, PmtConstants,CurrencyService, SubscriptionModelsConfirmationService, DatalayerUtilsService, localStorageService, $window, SubscriptionModelsConfirmationModel, PmtComponentUtils, NewMainHeaderFacade, PmtUtilsService, DatalayerGeneralConstants, DigitalDataService) {

        const vm = this;
        vm.model = SubscriptionModelsConfirmationModel;
        vm.printSummary = printSummary;

        activate();

        ////////////////

        function activate () {
            injectIbPmtStylesHost();
            vm.model.issueOrderInfo = localStorageService.get('issueOrderInfo');
            vm.ibPayTrace = localStorageService.get('ibPayTrace');
            $rootScope.showMainHeader = true;
            NewMainHeaderFacade.updateSteps('confirmation');
            localStorageService.set('nextStepAllowed', false);
            //PmtModalService.showWaitingModal('ib-modal-loading-plane', 'ib-modals ib-modals--transparent', true);
            vm.model.paymentData = localStorageService.get('modelPaymentData');
            vm.model.subscriptionModelsConfigurationInfo = localStorageService.get('subscriptionModelsConfigurationInfo');
            if(vm.model.issueOrderInfo.data.voucher && vm.model.issueOrderInfo.data.voucher !== '') {
                vm.model.voucher = vm.model.issueOrderInfo.data.voucher;
                const currency = vm.model.subscriptionModelsConfigurationInfo.body.currency;
                vm.model.issueOrderInfo.data.voucher.price = CurrencyService.formatPrice(currency,vm.model.issueOrderInfo.data.voucher.amount , true);
            }
            PmtComponentUtils.equalHeight(angular.element('#pmtBoxConfirmationInfo'), true);
            const extendedDigitalDataInfo = {};
            const extendedDataLayerGeneralInfo = {};
            extendedDigitalDataInfo[DatalayerGeneralConstants.STEP] = PmtConstants.SUBSCRIPTION_MODELS_STEP.CONFIRMATION;
            extendedDigitalDataInfo[DatalayerGeneralConstants.CURRENCY] = vm.model.issueOrderInfo.data.paidItems[0].priceWithFee.currency;
            if(vm.model.voucher) {
                extendedDigitalDataInfo[DatalayerGeneralConstants.REFERENCE] = vm.model.voucher.code;
                extendedDataLayerGeneralInfo[DatalayerConstants.PNR_INFO.REFERENCE] = vm.model.voucher.code;
            }
            extendedDataLayerGeneralInfo[DatalayerConstants.DATALAYER_INFO.STEP] = PmtConstants.SUBSCRIPTION_MODELS_STEP.CONFIRMATION;
            extendedDataLayerGeneralInfo[DatalayerConstants.DATALAYER_INFO.CURRENCY] = vm.model.issueOrderInfo.data.paidItems[0].priceWithFee.currency;
            extendedDataLayerGeneralInfo[DatalayerConstants.DATALAYER_INFO.CREDITCARD_TYPE] = vm.model.issueOrderInfo.data.paidItems[0].creditCardCode;
            DatalayerUtilsService.updateDatalayerWithQuadrigam(PmtConstants.QUADRIGAMS.SUBSCRIPTION_MODELS_CONFIRMATION, extendedDataLayerGeneralInfo, SubscriptionModelsConfirmationService.isUserLogged());
            DatalayerUtilsService.sendDatalayerEvent(DatalayerConstants.DATALAYER_EVENT_TYPES.VIEW);

            DatalayerUtilsService.updateDigitalDataWithQuadrigam(PmtConstants.QUADRIGAMS.SUBSCRIPTION_MODELS_CONFIRMATION, extendedDigitalDataInfo, SubscriptionModelsConfirmationService.isUserLogged());
            DigitalDataService.emitViewEvent();
        }

        /**
          * @function
          * @name printSummary
          * @desc print summary
          */

        function printSummary () {
            $window.print();
        }
    }
})();