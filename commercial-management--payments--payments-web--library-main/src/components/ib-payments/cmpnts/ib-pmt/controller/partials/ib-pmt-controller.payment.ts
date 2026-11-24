import angular from 'angular';
import type { PmtPageController } from '../ib-pmt-controller';
import { findCreditCardTypeByCode } from '../../service/ib-pmt-credit-card.utils';

    /**
     * This function Continue with pay calling service
     * @param {Event} submitedPaymentEvent event to lunch function
     * @param {Boolean} isRecal Parameter that indicates if the payment is 3ds and it is necessary to perform the callback
     * @param {Boolean} tokenizeSucces Parameter that indicates if the payment with Iberia pay has been successful and continues with the payment flow
     * @param {Boolena} onHoldPaymentPcc Parameter that indicates if the user select option onhold when issue return 449 error pcc
     */
export function submitPaymentImpl(ctrl: PmtPageController, event?, isRecal?, tokenizeSucces?, onHoldPaymentPcc?) {
        const fullAviosError = (error) => {
            ctrl.PmtModalService.finishWaiting();
            ctrl.model.paymentInfo.fullAvios = false;
        };
        const getPaymentType = () => {
            let paymentType = null;
            const paymentInfo = ctrl.localStorageService.get('paymentsInfo');
            if (ctrl.model.paymentInfo.paymentMethods[ctrl.model.selectedData.selectedTab].type === ctrl.PmtConstants.PAYMENT_TYPES.VOUCHER) {
                paymentType = ctrl.model.paymentInfo.paymentMethods[ctrl.model.selectedData.selectedTab].type;
            } else if (paymentInfo.fullAvios) {
                paymentType = ctrl.PmtConstants.PAYMENT_TYPES.FULL_AVIOS;
            } else {
                paymentType = ctrl.model.paymentInfo.paymentMethods[ctrl.model.selectedData.selectedTab].description +
                    ((ctrl.model.paymentInfo.paymentMethods[ctrl.model.selectedData.selectedTab].type === 'CREDITCARD' || ctrl.model.paymentInfo.paymentMethods[ctrl.model.selectedData.selectedTab].type === 'IBERIA_PAY') && ctrl.model.paymentInfo.selectedPaymentInfo.selectedCard ? ' ' + ctrl.model.paymentInfo.selectedPaymentInfo.selectedCard.description : '');
                ctrl.localStorageService.set('paymentProvider', ctrl.model.paymentInfo.paymentMethods[ctrl.model.selectedData.selectedTab].provider);
            }
            return paymentType;
        };
        /* INIT DELETE GA4 MIGRATION*/
        const datalayer_general = ctrl.$window.datalayer_general;
        /* FINISH DELETE GA4 MIGRATION*/
        ctrl.digital_data =  ctrl.$window.digital_data;
        let redirectionInfo = ctrl.localStorageService.get('redirectionPaymentCallback'), flowApp = ctrl.localStorageService.get('flowApp'), passengersContactData = null, typeFind,
            notTokenize = !!(ctrl.localStorageService.get('userLogged') && ctrl.model.paymentInfo.selectedPaymentInfo && ctrl.model.paymentInfo.selectedPaymentInfo.selectedLoggedCard && ctrl.model.paymentInfo.selectedPaymentInfo.selectedLoggedCard.cardTypeCode === 'TP'|| ctrl.model.paymentInfo.selectedPaymentInfo?.selectedLoggedCard?.cof),
            paymentTransition = ctrl.model.selectedData?.selectedTab? ctrl.model.paymentInfo?.paymentMethods[ctrl.model.selectedData.selectedTab]?.provider : 'CREDIT_CARD';
        let idDcc = null;
        if(ctrl.localStorageService.get('flowApp').indexOf('BKI') >= 0) {
            if(event) {
                ctrl.DatalayerEcommerceUtilsService.setDonationsAddToCart(ctrl.model.summaryInfo.orderFees);
            }
        }
        if (!ctrl.quotaIsLoading) {
            ctrl.localStorageService.set('noShowMessageBockBack', true);
            delete ctrl.quotaIbPayCall;
            ctrl.DatalayerUtilsService.removeDatalayerModalAttrs();
            ctrl.localStorageService.set('summaryAncillaries', ctrl.model.summaryInfo.ancillaries);
            if (!onHoldPaymentPcc && !ctrl.model.paymentInfo.fullAvios && ctrl.model.paymentInfo.appliedDiscounts && ctrl.model.paymentInfo.appliedDiscounts.status && ctrl.model.paymentInfo.appliedDiscounts.types.AVIOS && ctrl.model.paymentInfo.price.totalPrice === 0) {
                ctrl.PmtModalService.showWaitingModal('ib-modal-pmt-cards', 'ib-modals ib-modals--transparent', true, { transition: 'CREDIT_CARD' });
                ctrl.PmtService.checkFullAvios(ctrl.model.paymentInfo.appliedDiscounts.types.AVIOS.id).then((response) => {
                    if (response.isFullAvios) {
                        ctrl.model.paymentInfo.fullAvios = true;
                        const issueCountry = ctrl.localStorageService.get('selectedIssuerCountry') ? ctrl.localStorageService.get('selectedIssuerCountry').code : ctrl.model.generalData.issuerCountry.code;
                        ctrl.model.showOptions.loadingPaymentData = true;
                        ctrl.localStorageService.set('numeroAvios', ctrl.model.paymentInfo.appliedDiscounts.types.AVIOS.formatedAvios);
                        if (ctrl.localStorageService.get('creditCardFee')) {
                            ctrl.localStorageService.remove('creditCardFee');
                        }
                        ctrl.PmtService.submitFullAvios(ctrl.dataRequest.ident, issueCountry, ctrl.$rootScope.serviceURI).then((response) => {
                            ctrl.localStorageService.set('paymentType', getPaymentType());
                            const unregister = ctrl.$rootScope.$on('$routeChangeSuccess', () => {
                                ctrl.PmtModalService.finishWaiting();
                                unregister();
                            });
                            ctrl.goToConfirmationPage();
                        }, fullAviosError);
                    } else {
                        fullAviosError(response.fullAvios);
                    }
                }, fullAviosError);
                return;
            } else {
                if (paymentTransition === 'IDEAL') paymentTransition = 'SOFORT';
                ctrl.PmtModalService.showWaitingModal('ib-modal-pmt-cards', 'ib-modals ib-modals--transparent', true, {transition: paymentTransition});
                if (flowApp === ctrl.PmtConstants.APP_TYPES.CHECKIN && ctrl.paymentsForm && ctrl.model.paymentInfo.paymentMethods[ctrl.model.selectedData.selectedTab].type === ctrl.PmtConstants.PAYMENT_TYPES.EXTERNAL_CREDITCARD) {
                    passengersContactData = ctrl.localStorageService.get('passengersContactData');
                    if (passengersContactData) {
                        ctrl.model.paymentInfo.requiredAdditionalFields.info.EXTERNAL_CREDITCARD.PAYER.requiredFields.EMAIL = { email: passengersContactData[0].email };
                        ctrl.model.paymentInfo.requiredAdditionalFields.info.EXTERNAL_CREDITCARD.PAYER.requiredFields.PHONE = { phone: passengersContactData[0].phone };
                    }

                }
            }
            if (flowApp === ctrl.PmtConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE || flowApp === ctrl.PmtConstants.APP_TYPES.MANAGEMYBOOKING_UNIFIED) {
                ctrl.localStorageService.set('RechargeBookingInfo', true);
            }
            if (onHoldPaymentPcc) {
                ctrl.localStorageService.remove('summaryAncillaries');
                ctrl.dataRequest = ctrl.PmtTransformer.getPaymentsModel();
                ctrl.DatalayerEcommerceUtilsService.updateAddToCartInfoOnHold();
            }
            ctrl.numberCallEvent++;
            /* INIT DELETE GA4 MIGRATION*/
            if (datalayer_general && angular.isObject(datalayer_general)) {
                ctrl.localStorageService.set('confirmationDatalayerCallBack', datalayer_general);
                ctrl.localStorageService.set('confirmationDatalayerInfo', datalayer_general);
            }
            /* FINISH DELETE GA4 MIGRATION*/
            if (ctrl.digital_data && angular.isObject(ctrl.digital_data)) {
                ctrl.localStorageService.set('confirmationDigitalDataCallBack', ctrl.digital_data);
                ctrl.localStorageService.set('confirmationDigitalInfo', ctrl.digital_data);
            }
            if ((ctrl.model.paymentInfo.paymentMethods && (ctrl.model.paymentInfo.paymentMethods[ctrl.model.selectedData.selectedTab].type === ctrl.PmtConstants.PAYMENT_TYPES.IBERIA_PAY || ctrl.model.paymentInfo.paymentMethods[ctrl.model.selectedData.selectedTab].type === ctrl.PmtConstants.PAYMENT_TYPES.ONHOLD_IBERIA_PAY)) && !tokenizeSucces && !redirectionInfo && !onHoldPaymentPcc && !isRecal && !notTokenize) {
                if (!ctrl.$window.IBDC) {
                    ctrl.showPaymentInitReloadModal();
                    return;
                }
                const isResolvedCardTypeId = (cardTypeId) => Boolean(cardTypeId) && cardTypeId !== ctrl.PmtConstants.PAYMENT_TYPES.NEW_CARD;
                if (
                    isResolvedCardTypeId(ctrl.model.paymentInfo.selectedPaymentInfo.cardTypeId)
                    || isResolvedCardTypeId(ctrl.model.paymentInfo.selectedPaymentInfo.selectedCard && ctrl.model.paymentInfo.selectedPaymentInfo.selectedCard.cardTypeId)
                    || isResolvedCardTypeId(ctrl.model.paymentInfo.selectedPaymentInfo.selectedLoggedCard && ctrl.model.paymentInfo.selectedPaymentInfo.selectedLoggedCard.cardTypeId)
                ) {
                    ctrl.numberCallEvent = 0;
                    ctrl.$window.IBDC.tokenizeCreditCard();
                } else {
                    typeFind = findCreditCardTypeByCode(
                        ctrl.model.paymentInfo.paymentMethods[ctrl.model.selectedData.selectedTab].creditCardTypes,
                        ctrl.localStorageService.get('typeCardIberiaPay')
                    );
                    if (typeFind) {
                        ctrl.model.paymentInfo.selectedPaymentInfo.selectedCard = typeFind;
                        ctrl.numberCallEvent = 0;
                        ctrl.$window.IBDC.tokenizeCreditCard();
                    } else {
                        ctrl.iberiaPayErrorsControll({ detail: { resultValidCard: 500, message: 'no type for this card detected' } });
                    }
                }
            } else if (ctrl.numberCallEvent === 1) {
                if (ctrl.localStorageService.get('errorIssueService')) {
                    ctrl.model.paymentInfo.paymentId = ctrl.localStorageService.get('errorIssueService').data.paymentOptions.paymentId;
                }
                if (ctrl.model.noPaymentSummary) {
                    ctrl.noPaymentConfirm();
                } else {
                    if (!ctrl.model?.paymentInfo?.paymentMethods?.length) {
                        ctrl.showPaymentInitReloadModal();
                        return;
                    }
                    if (onHoldPaymentPcc && !ctrl.localStorageService.get('errorIssueService')?.data?.paymentOptions) {
                        ctrl.showPaymentInitReloadModal();
                        return;
                    }
                    ctrl.localStorageService.set('paymentType', getPaymentType());
                    if (getPaymentType() === 'Transferencia') {
                        ctrl.localStorageService.set('payFromTransfer', true);
                    }
                    if (ctrl.currentDccData && !ctrl.donationEnabled 
                        && (ctrl.currentDccData.selectedValue === ctrl.PmtConstants.PAYMENTS_DCC.DCC_ENABLED
                            || ctrl.currentDccData.selectedValue === undefined
                            && ctrl.currentDccData.creditCardType === ctrl.PmtConstants.PAYMENTS_DCC.VISA)
                    ) {
                        idDcc = ctrl.currentDccData.id;
                    }
                    ctrl.PmtService.submitPayment(ctrl.model, ctrl.$rootScope.serviceURI, isRecal, onHoldPaymentPcc, idDcc).then((response) => {
                        ctrl.numberCallEvent = 0;
                        ctrl.localStorageService.set('fullIssuedPaiment', response);
                        ctrl.deletePrivateData();
                        ctrl.localStorageService.remove('redirectionPaymentCallback');
                        ctrl.localStorageService.set('nextStepAllowed', false);
                        if (ctrl.asComponent) {
                            switch (flowApp) {
                                    case ctrl.PmtConstants.APP_TYPES.CHECKIN: ctrl.$scope.$emit('changeStep', ctrl.PmtConstants.COMPONENT_PAGE.PAYMENTS_PAGE, ctrl.PmtConstants.COMPONENT_PAGE.CKI_BOARDING_CARD_PAGE); break;
                                    case ctrl.PmtConstants.APP_TYPES.MANAGEMYBOOKING_ANCILLARIES: ctrl.$scope.$emit('changeStep', ctrl.PmtConstants.COMPONENT_PAGE.PAYMENTS_PAGE, ctrl.PmtConstants.COMPONENT_PAGE.MMB_CONFIRMATION_PAGE); break;
                                    case ctrl.PmtConstants.APP_TYPES.SUBSCRIPTIONMODELS: ctrl.$scope.$emit('changeStep', ctrl.PmtConstants.COMPONENT_PAGE.PAYMENTS_PAGE, ctrl.PmtConstants.COMPONENT_PAGE.SUBSCRIPTION_MODELS_CONFIRMATION_PAGE); break;
                                    default: ctrl.$scope.$emit('changeStep', ctrl.PmtConstants.COMPONENT_PAGE.PAYMENTS_PAGE, ctrl.PmtConstants.COMPONENT_PAGE.CONFIRMATION_PAGE); break;
                            }
                            ctrl.PmtModalService.finishWaiting();
                        } else {
                            const unregister = ctrl.$rootScope.$on('$routeChangeSuccess', () => {
                                ctrl.PmtModalService.finishWaiting();
                                unregister();
                            });
                            history.pushState(null, null, location.href);
                            switch (flowApp) {
                                    case ctrl.PmtConstants.APP_TYPES.CHECKIN: ctrl.updateDatalayerInformationCkiFlow();
                                        ctrl.$location.path(ctrl.PmtConstants.PAGES_URL.CKI_BOARDING_CARD_PAGE);
                                        break;
                                    case ctrl.PmtConstants.APP_TYPES.MANAGEMYBOOKING_ANCILLARIES:
                                        ctrl.$location.path(ctrl.PmtConstants.PAGES_URL.MMB_CONFIRMATION_PAGE);
                                        break;
                                    case ctrl.PmtConstants.APP_TYPES.GIFTCARDS:
                                        ctrl.$location.path(ctrl.PmtConstants.PAGES_URL.GIFTCARDS_CONFIRMATION_PAGE);
                                        break;
                                    case ctrl.PmtConstants.APP_TYPES.SUBSCRIPTIONMODELS:
                                        ctrl.$location.path(ctrl.PmtConstants.PAGES_URL.SUBSCRIPTION_MODELS_CONFIRMATION_PAGE);
                                        break;
                                    default: ctrl.$location.path(ctrl.PmtConstants.PAGES_URL.CONFIRMATION_PAGE);
                            }
                        }
                    }, () => {
                        ctrl.numberCallEvent = 0;
                        if (!ctrl.loadingOnlineBankingForm && !ctrl.loadingIframeForm) {
                            ctrl.PmtModalService.finishWaiting();
                        }
                    });
                }
            }
        }
}
