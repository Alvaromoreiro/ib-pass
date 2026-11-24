
import { injectIbPmtStylesHost } from '../../../../../styles/ib-pmt-styles-host';

(function () {
    'use strict';

    angular
        .module('ib-pmt-gift-cards-confirmation-module')
        .controller('GiftCardsConfirmationController', GiftCardsConfirmationController);

    GiftCardsConfirmationController.$inject = ['$scope', '$rootScope', 'DatalayerConstants', 'PmtConstants','CurrencyService', 'GiftCardsConfirmationService', 'DatalayerUtilsService', 'localStorageService', '$window', 'GiftCardsConfirmationModel', 'PmtComponentUtils', 'NewMainHeaderFacade', 'PmtUtilsService', 'DigitalDataService', 'CommonsUtilService', '$timeout', 'DatalayerGeneralConstants', 'PmtDatalayerConstants'];
    function GiftCardsConfirmationController ($scope, $rootScope, DatalayerConstants, PmtConstants,CurrencyService, GiftCardsConfirmationService, DatalayerUtilsService, localStorageService, $window, GiftCardsConfirmationModel, PmtComponentUtils, NewMainHeaderFacade, PmtUtilsService, DigitalDataService, CommonsUtilService, $timeout, DatalayerGeneralConstants, PmtDatalayerConstants) {

        const vm = this;
        vm.model = GiftCardsConfirmationModel;
        vm.printSummary = printSummary;
        vm.viewModel;
        activate();

        ////////////////

        function activate () {
            injectIbPmtStylesHost();
            vm.model.issueOrderInfo = localStorageService.get('issueOrderInfo');
            if(vm.model.issueOrderInfo.data.giftCardInfo.delivery?.dateTime) {
                const issueDate = vm.model.issueOrderInfo.data.giftCardInfo.delivery?.dateTime;
                calculateUTC0DateTimeGiftCardGroup(checkFormatDate(issueDate));
            }
            if(!vm.model.issueOrderInfo.data.giftCardInfo.theme) {
                vm.model.issueOrderInfo.data.giftCardInfo.theme = 'GIFT';
            }
            vm.ibPayTrace = localStorageService.get('ibPayTrace');
            $rootScope.showMainHeader = true;
            NewMainHeaderFacade.updateSteps('confirmation');
            localStorageService.set('nextStepAllowed', false);
            //PmtModalService.showWaitingModal('ib-modal-loading-plane', 'ib-modals ib-modals--transparent', true);
            vm.model.paymentData = localStorageService.get('modelPaymentData');
            vm.model.giftCardConfigurationInfo = localStorageService.get('giftCardsConfigurationInfo');
            let giftCardExpirationDate;
            let giftCardCode;
            if(vm.model.issueOrderInfo.data.voucher) {
                vm.model.voucher = vm.model.issueOrderInfo.data.voucher;
                const currency = vm.model.giftCardConfigurationInfo.importInfo.currency;
                vm.model.issueOrderInfo.data.voucher.price = CurrencyService.formatPrice(currency,vm.model.issueOrderInfo.data.voucher.amount , true);
                giftCardExpirationDate = vm.model.voucher.expirationDate;
                giftCardCode = vm.model.voucher.code;
            }
            let giftCardBeneficiary;
            vm.viewModel = buildCardViewModel(vm.model.issueOrderInfo.data.giftCardInfo.theme);
            if(vm.model.issueOrderInfo.data.giftCardInfo) {
                giftCardBeneficiary =
                    vm.model.issueOrderInfo.data.giftCardInfo.type === PmtDatalayerConstants.DATALAYER_GIFTCARD.TYPE_OWN ?
                        PmtDatalayerConstants.DATALAYER_GIFTCARD.BENEFICIARY_USUARIO : PmtDatalayerConstants.DATALAYER_GIFTCARD.BENEFICIARY_OTRO;
            }
            PmtComponentUtils.equalHeight(angular.element('#pmtBoxConfirmationInfo'), true);
            const extendedDatalayerInfo = getExtendDatalayerInfo();
            const extendedDigitalDataInfo = getExtendDigitalDataInfo();
            /* INIT DELETE GA4 MIGRATION */
            DatalayerUtilsService.updateDatalayerWithQuadrigam(PmtConstants.QUADRIGAMS.GIFTCARDS_CONFIRMATION, extendedDatalayerInfo, GiftCardsConfirmationService.isUserLogged());
            DatalayerUtilsService.sendDatalayerEvent(DatalayerConstants.DATALAYER_EVENT_TYPES.VIEW);
            /* FINISH DELETE GA4 MIGRATION */
            DatalayerUtilsService.updateDigitalDataWithQuadrigam(PmtConstants.QUADRIGAMS.GIFTCARDS_CONFIRMATION, extendedDigitalDataInfo, GiftCardsConfirmationService.isUserLogged());
            DigitalDataService.addDigitalDataInfo({
                Quadrigam: PmtConstants.QUADRIGAMS.GIFTCARDS_CONFIRMATION,
                CodigoSeguimiento: GiftCardsConfirmationService.updateFollowCode(PmtConstants.QUADRIGAMS.GIFTCARDS_CONFIRMATION),
                GiftCardExpiry: giftCardExpirationDate,
                GiftCardReference: giftCardCode,
                GiftCardBeneficiary: giftCardBeneficiary
            });
            DigitalDataService.emitViewEvent();
            const selectedCardType = localStorageService.get('typeCardIberiaPay');
            let cardType;
            if (selectedCardType) {
                cardType = {tipoTarjeta : selectedCardType};
                DatalayerUtilsService.addDataLayerInfo(cardType);
            }
            $timeout(() => {
                CommonsUtilService.setTitlePage('GIFT_CARD_CONFIGURATION_REBKCF_TITLE');
            }, 3000);

        }

        function checkSpecialCampaignConfiguration (theme) {
            const specialCampaign = localStorageService.get('specialCampaign');
            const cardSelectedModels = PmtConstants.CARD_SELECTED_MODELS;
            const isCorrectSpecialCampaign = Object.keys(cardSelectedModels).some(key => key === specialCampaign);

            return specialCampaign && isCorrectSpecialCampaign ? specialCampaign : theme;
        }

        function  buildCardViewModel  (theme) {
            const specialCampaign = checkSpecialCampaignConfiguration(theme);
            const conditionalTheme = 'FATHER';
            theme = (specialCampaign && theme === conditionalTheme) ? specialCampaign : theme;
            const dataModel = PmtConstants.CARD_SELECTED_MODELS[theme];

            return {
                ...dataModel
            };
        }

        function getExtendDatalayerInfo () {
            const extendedDatalayerInfo = {};
            extendedDatalayerInfo[DatalayerConstants.DATALAYER_INFO.STEP] = 'confirmacion';
            return extendedDatalayerInfo;
        }

        function getExtendDigitalDataInfo () {
            const extendedDigitalData = {};
            extendedDigitalData[DatalayerGeneralConstants.STEP] = 'confirmacion';
            return extendedDigitalData;
        }

        function checkFormatDate (dateToCheck) {
            const trakingCode = localStorageService.get('TrackingCode');
            const language = trakingCode.split('/')[0];
            const isInvalidDate = language === 'es';

            if(!isInvalidDate) {
                return dateToCheck;
            }else {
                const [datePart, ...time] = dateToCheck.split(' ');
                const dateSplited = datePart.split('/');
                return `${dateSplited[1]}/${dateSplited[0]}/${dateSplited[2]} ${time}`;
            }
        }

        function calculateUTC0DateTimeGiftCardGroup (dateToCalculate) {
            const localDate = new Date();
            const minutesDifferenceWithUTC = localDate.getTimezoneOffset();
            const dateTemp = new Date(dateToCalculate);
            if(isNaN(dateTemp)) {
                vm.model.issueOrderInfo.data.giftCardInfo.delivery.dateTimeLocalUTC = dateToCalculate.split(' ')[0].replace('/', '-');
            }else {
                const diferenceHours = parseInt(localDate.getTimezoneOffset().toString().replace('-', '').replace('+', ''));
                minutesDifferenceWithUTC > 0 ? dateTemp.setHours(dateTemp.getHours() - (diferenceHours / 60)).toString()  : dateTemp.setHours(dateTemp.getHours() + (diferenceHours / 60 ) );
                const dateReturn = `${dateTemp.getFullYear()}-${(dateTemp.getMonth() +1).toString().length === 1 ? `0${(dateTemp.getMonth() +1)}`: `${(dateTemp.getMonth() +1)}`}-${dateTemp.getDate().toString().length === 1 ? `0${dateTemp.getDate()}`: `${dateTemp.getDate()}`} ${dateTemp.getHours().toString().length === 1 ? `0${dateTemp.getHours()}`: `${dateTemp.getHours()}`}:00`;
                vm.model.issueOrderInfo.data.giftCardInfo.delivery.dateTimeLocalUTC = dateReturn;
            }
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

}

)();
