import angular from 'angular';
import type { PmtPageController } from '../ib-pmt-controller';

    /**
     * This functions is executed after pmt error when user dont have nothing for pay and generate model to show pmt-view.
     * In this case if we want show pmt-view is neccesary remove the linea code 'this.submitPayment()', because this produce that flow continue
     * and dont stop in ptm view.
     * */
export function noPaymentImpl(ctrl: PmtPageController, event, paymentData) {
        let flowApp = ctrl.localStorageService.get('flowApp'), donationData = ctrl.localStorageService.get('donation'), currency, fareData = ctrl.localStorageService.get('fareData'), bookingInfo = ctrl.localStorageService.get('bookingInfo'),
            flowId = bookingInfo.flowId ? bookingInfo.flowId : ctrl.localStorageService.get('flowId');
        if (flowApp === ctrl.PmtConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE || flowApp === ctrl.PmtConstants.APP_TYPES.MANAGEMYBOOKING_UNIFIED) {
            ctrl.PmtModalService.finishWaiting();
            ctrl.PmtModalService.showWaitingModal('ib-modal-pmt-cards', 'ib-modals ib-modals--transparent', true);
            ctrl.updateDatalayerWithQuadrigam(ctrl.localStorageService.get('pmtModelInfo').quadrigams.payments, null, ctrl.PmtUtilsService.isUserLogged());
            /* INIT DELETE GA4 MIGRATION */
            ctrl.DatalayerUtilsService.sendDatalayerEvent(ctrl.PmtDatalayerConstants.DATALAYER_EVENT_TYPES.VIEW);
            /* FINISH DELETE GA4 MIGRATION */
            ctrl.DigitalDataService.emitViewEvent();
            //ctrl.DatalayerUtilsService.updateDatalayerEvent(ctrl.PmtDatalayerConstants.DATALAYER_EVENT_TYPES.VIEW, '', '', '');
            ctrl.MonetateUtilsService.updateMonetateWithQuadrigam(ctrl.PmtConstants.MONETATE_INFO.SETPAGETYPE, ctrl.localStorageService.get('pmtModelInfo').quadrigams.payments);
            ctrl.$timeout(() => {
                ctrl.$rootScope.$broadcast('sendUpdateToMonetate');
            });
            currency = ctrl.CurrencyService.getCurrencyObject(fareData ? fareData.contextMetadata.currencies[0] : ctrl.localStorageService.get('bookingInfo').contextMetadata.currencies);
            ctrl.PmtService.getConditionService(flowId, ctrl.$rootScope.serviceURI).then((conditionsData) => {
                ctrl.model = ctrl.PmtTransformer.noPaymentModel(currency, paymentData, conditionsData);
                ctrl.model.summaryInfo.passengers.noPaymentSummary = true;
                ctrl.model.noPaymentSummary = true;
                ctrl.localStorageService.set('noPaymentSummary', true);
                ctrl.applyStoredDonation(donationData);
                ctrl.$timeout(() => {
                    if (ctrl.localStorageService.get('selectedFlex') && ctrl.$rootScope.ancOffers) {
                        ctrl.model.paymentInfo.price.formattedTotalPrice = ctrl.localStorageService.get('headerModel').headerModel.shoppingBasket.total.formatted;
                        ctrl.model.paymentInfo.price.totalPrice = ctrl.localStorageService.get('headerModel').headerModel.shoppingBasket.total.original;
                    }
                });
                ctrl.localStorageService.set('modelPaymentData', ctrl.model);
                ctrl.localStorageService.set('noPaymentVCFlow', true);
                ctrl.submitPayment();
            }, () => {
                const conditionsData = {
                    data: {
                        error: 'unauthorized',
                        error_description: 'Invalid token'
                    },
                    errorCode: 403
                };
                ctrl.model = ctrl.PmtTransformer.noPaymentModel(currency, paymentData, conditionsData);
                ctrl.model.summaryInfo.passengers.noPaymentSummary = true;
                ctrl.model.noPaymentSummary = true;
                ctrl.localStorageService.set('noPaymentSummary', true);
                ctrl.applyStoredDonation(donationData);
                ctrl.PmtModalService.finishWaiting();
                ctrl.$timeout(() => {
                    if (ctrl.localStorageService.get('selectedFlex') && ctrl.$rootScope.ancOffers) {
                        ctrl.model.paymentInfo.price.formattedTotalPrice = ctrl.localStorageService.get('headerModel').headerModel.shoppingBasket.total.formatted;
                        ctrl.model.paymentInfo.price.totalPrice = ctrl.localStorageService.get('headerModel').headerModel.shoppingBasket.total.original;
                    }
                });
                ctrl.localStorageService.set('modelPaymentData', ctrl.model);
                ctrl.PmtModalService.showWaitingModal('ib-modal-pmt-cards', 'ib-modals ib-modals--transparent', true);
                ctrl.submitPayment();
            });
        }
}

    /**
     * This functions is launched when in the function this.submitPayment() detected that user dont have nothing for pay.
     * This will execute the call to orderChange for flow CV.
     *  */
export function noPaymentConfirmImpl(ctrl: PmtPageController) {
        ctrl.PmtService.noPaymentConfirm(ctrl.$rootScope.serviceURI).then((response) => {
            ctrl.numberCallEvent = 0;
            ctrl.localStorageService.set('fullIssuedPaiment', response);
            ctrl.PmtModalService.finishWaiting();
            if (ctrl.asComponent) {
                ctrl.$scope.$emit('changeStep', ctrl.PmtConstants.COMPONENT_PAGE.PAYMENTS_PAGE, ctrl.PmtConstants.COMPONENT_PAGE.CONFIRMATION_PAGE);
            } else {
                ctrl.$location.path(ctrl.PmtConstants.PAGES_URL.CONFIRMATION_PAGE);
            }
            ctrl.localStorageService.remove('updateSeatLocal');
        }, () => {
            ctrl.numberCallEvent = 0;
            ctrl.PmtModalService.finishWaiting();
        });
}

export function goToHomeImpl(ctrl: PmtPageController) {
        if (ctrl.localStorageService.get('flowApp') !== ctrl.PmtConstants.APP_TYPES.MANAGEMYBOOKING_BIDS) {
            ctrl.localStorageService.remove('paySucces');
            ctrl.$window.location.href = ctrl.$window.location.origin;
        }
}

export function updateTotalFeesImpl(ctrl: PmtPageController) {
        if (ctrl.model && ctrl.model.summaryInfo.orderFees) {
            ctrl.model.summaryInfo.orderFees.total = 0;
            angular.forEach(ctrl.model.summaryInfo.orderFees, (orderFee) => {
                ctrl.model.summaryInfo.orderFees.total += orderFee.totalFee;
            });
            if(ctrl.model.summaryInfo.orderFees.total ===0) {
                ctrl.model.summaryInfo.orderFees = [];
            }
            ctrl.model.summaryInfo.orderFees.totalFormatted = ctrl.CurrencyService.formatPrice(ctrl.model.paymentInfo.currency, ctrl.model.summaryInfo.orderFees.total, true).trim();
        }
}
