import angular from 'angular';
import type { PmtPageController } from '../ib-pmt-controller';

    /**
     * Process the payment with iberia pay.
     * When you receive the iframe event that the tokenization went well, execute the payment function
     * @param {Event} success event to launch the function, this event is sent by the iframe of iberia pay
     */
export function iberiaPayTokenizeSuccesImpl(ctrl: PmtPageController, event) {
        ctrl.localStorageService.set('ibPayTrace', event.detail);
        ctrl.ibPayTrace = event.detail;
        if (ctrl.quotaIbPayCall) {
            delete ctrl.quotaIbPayCall;
            ctrl.numberCallEvent++;
            ctrl.getIberiaPayQuotaOptions();
        } else if (ctrl.numberCallEvent === 0) {
            ctrl.submitPayment(null, false, true);
        }
}

export function isIberiaPayPaymentType(ctrl: PmtPageController, type: string): boolean {
        return type === ctrl.PmtConstants.PAYMENT_TYPES.IBERIA_PAY
            || type === ctrl.PmtConstants.PAYMENT_TYPES.ONHOLD_IBERIA_PAY;
}

function getPaymentMethods(ctrl: PmtPageController) {
        return ctrl?.model?.paymentInfo?.paymentMethods || null;
}

function getSelectedTabIndex(ctrl: PmtPageController) {
        return ctrl.model?.selectedData?.selectedTab;
}

function getSelectedPaymentMethod(ctrl: PmtPageController) {
        const paymentMethods = getPaymentMethods(ctrl);
        if (!paymentMethods) {
            return null;
        }
        const selectedTab = getSelectedTabIndex(ctrl);
        if (typeof selectedTab !== 'number') {
            return null;
        }
        const selectedMethod = paymentMethods[selectedTab];
        return selectedMethod || null;
}

export function isSelectedPaymentIberiaPayImpl(ctrl: PmtPageController): boolean {
        const selectedMethod = getSelectedPaymentMethod(ctrl);
        if (!selectedMethod) {
            return false;
        }
        return isIberiaPayPaymentType(ctrl, selectedMethod.type);
}

export function cancelPendingIberiaPayIframeLoadImpl(ctrl: PmtPageController): void {
        ctrl.clearIberiaPayIframeLoadTimeout();
        if (ctrl.model?.paymentInfo) {
            ctrl.model.paymentInfo.iberiaPayLoadingIframe = false;
        }
        ctrl.iframeReadyCount = 0;
}

export function abortIberiaPayIframeLoadOnTabChangeImpl(
        ctrl: PmtPageController,
        previousTabIndex: number,
        nextTabIndex: number
): void {
        const paymentMethods = getPaymentMethods(ctrl);
        if (!paymentMethods) {
            return;
        }
        const previousMethod = paymentMethods[previousTabIndex];
        const nextMethod = paymentMethods[nextTabIndex];
        if (!previousMethod) {
            return;
        }
        if (!isIberiaPayPaymentType(ctrl, previousMethod.type)) {
            return;
        }
        if (!nextMethod) {
            cancelPendingIberiaPayIframeLoadImpl(ctrl);
            return;
        }
        if (isIberiaPayPaymentType(ctrl, nextMethod.type)) {
            return;
        }
        cancelPendingIberiaPayIframeLoadImpl(ctrl);
}

export function updateIberiaPayLoadingIframeStatusImpl(ctrl: PmtPageController, event, status) {
        if (!ctrl.model?.paymentInfo) {
            return;
        }
        ctrl.model.paymentInfo.iberiaPayLoadingIframe = status;
        if (status) {
            ctrl.startIberiaPayIframeLoadTimeout();
        } else {
            ctrl.clearIberiaPayIframeLoadTimeout();
        }
}

export function startIberiaPayIframeLoadTimeoutImpl(ctrl: PmtPageController) {
        ctrl.clearIberiaPayIframeLoadTimeout();
        ctrl.iberiaPayIframeLoadTimeout = ctrl.$timeout(() => {
            ctrl.iberiaPayIframeLoadTimeout = null;
            if (!ctrl.model?.paymentInfo?.iberiaPayLoadingIframe) {
                return;
            }
            ctrl.model.paymentInfo.iberiaPayLoadingIframe = false;
            if (isSelectedPaymentIberiaPayImpl(ctrl)) {
                ctrl.showPaymentInitReloadModal();
            }
        }, ctrl.IBERIA_PAY_IFRAME_LOAD_TIMEOUT_MS);
}

export function clearIberiaPayIframeLoadTimeoutImpl(ctrl: PmtPageController) {
        if (ctrl.iberiaPayIframeLoadTimeout) {
            ctrl.$timeout.cancel(ctrl.iberiaPayIframeLoadTimeout);
            ctrl.iberiaPayIframeLoadTimeout = null;
        }
}

function isPaymentGenericErrorModalOpen(ctrl: PmtPageController): boolean {
        return angular.element(ctrl.$document).find('#pmt-generic-error-payment-modal').length > 0;
}

function shouldShowIberiaPayReadyErrorModal(ctrl: PmtPageController): boolean {
        if (ctrl.iframeReadyCount < 4) {
            return false;
        }
        if (!isSelectedPaymentIberiaPayImpl(ctrl)) {
            return false;
        }
        return !isPaymentGenericErrorModalOpen(ctrl);
}

    /**
     * generate styles to label's iberia pay scripts (cvv and number credit card), calling this.$window.IBDC.setStyles function
     * @param {Event} ready event to launch the function, this event is sent by the iframe of iberia pay when iframes is loaded
     */
export function iberiaPayIframeReadyImpl(ctrl: PmtPageController, event) {
        if (!ctrl.$window.IBDC) {
            return;
        }
        let iFrameLoadingTime, labelStyle, message = ctrl.$filter('translate')('IBERIA_PAY_ERROR_GENERAL'), modalObject = {
            title: 'IBERIA_PAY_ERROR_GENERAL_TITLE',
            message: message,
            needsTranslate: false,
            showbuttons: {
                accept: {
                    status: true,
                    text: 'IBERIA_PAY_ERROR_GENERAL_BUTTON',
                    accessibleText: 'IBERIA_PAY_ERROR_GENERAL_BUTTON'
                }
            }
        };
        ctrl.$window.IBDC.setStyle('number.label', labelStyle, ctrl.$filter('translate')('CREDIT_CARD_FORM_CARD_NUMBER_LABEL'));
        const CvvLabel = ctrl.$rootScope.appMarket === 'US' ? ctrl.$filter('translate')('CREDIT_CARD_FORM_CVV_NUMBER_LABEL_US') : ctrl.$filter('translate')('CREDIT_CARD_FORM_CVV_NUMBER_LABEL');
        ctrl.$window.IBDC.setStyle('cvv.label', labelStyle, CvvLabel);
        if (!ctrl.model.paymentInfo.iberiaPayLoadingIframe) {
            ctrl.iframeReadyCount++;
            if (shouldShowIberiaPayReadyErrorModal(ctrl)) {
                ctrl.PmtModalService.showGenericError(modalObject, true, ctrl.PmtConstants.MODALS.GENERIC_ERROR_MODAL_PAYMENT).result.then(ctrl.reloadPage, ctrl.reloadPage);
            }
        } else {
            ctrl.iframeReadyCount = 0;
        }
        ctrl.$timeout(() => {
            ctrl.model.paymentInfo.iberiaPayLoadingIframe = false;
            ctrl.clearIberiaPayIframeLoadTimeout();
        });
        const actualDate: any = new Date();
        const initIframeLoading: any = new Date(ctrl.localStorageService.get('initIframeLoading'));
        iFrameLoadingTime= actualDate - initIframeLoading;
        ctrl.QuantumService.sendEvent('376', 0, iFrameLoadingTime/1000);
}

export function reloadPageImpl(ctrl: PmtPageController) {
        ctrl.$window.location.reload();
}

export function onIbdcScriptLoadErrorImpl(ctrl: PmtPageController) {
        if (!isSelectedPaymentIberiaPayImpl(ctrl)) {
            return;
        }
        console.error('[PMT][IberiaPay] IBDC script load error after retries');
        ctrl.showPaymentInitReloadModal();
}

export function showPaymentInitReloadModalImpl(ctrl: PmtPageController) {
        if (ctrl.paymentInitReloadModalShown) {
            return;
        }
        if (isPaymentGenericErrorModalOpen(ctrl)) {
            return;
        }
        console.error('[PMT] Payment init reload modal shown');
        ctrl.paymentInitReloadModalShown = true;
        ctrl.PmtModalService.finishWaiting();
        const modalObject = {
            title: 'IBERIA_PAY_ERROR_GENERAL_TITLE',
            message: 'IBERIA_PAY_ERROR_GENERAL',
            needsTranslate: true,
            showbuttons: {
                accept: {
                    status: true,
                    text: 'IBERIA_PAY_ERROR_GENERAL_BUTTON',
                    accessibleText: 'IBERIA_PAY_ERROR_GENERAL_BUTTON'
                }
            }
        };
        ctrl.PmtModalService.showGenericError(modalObject, true, ctrl.PmtConstants.MODALS.GENERIC_ERROR_MODAL_PAYMENT).result.then(ctrl.reloadPage, ctrl.reloadPage);
}

export function hasIberiaPayPaymentMethodImpl(ctrl: PmtPageController) {
        return !!ctrl.model?.paymentInfo?.paymentMethods?.some((paymentMethod) => {
            return paymentMethod.type === ctrl.PmtConstants.PAYMENT_TYPES.IBERIA_PAY
                || paymentMethod.type === ctrl.PmtConstants.PAYMENT_TYPES.ONHOLD_IBERIA_PAY;
        });
}

export function canPayIberiaPayWithoutIbdcImpl(ctrl: PmtPageController) {
        const selectedLoggedCard = ctrl.model?.paymentInfo?.selectedPaymentInfo?.selectedLoggedCard;
        return !!(ctrl.localStorageService.get('userLogged') && selectedLoggedCard && (selectedLoggedCard.cof || selectedLoggedCard.cardTypeCode === 'TP'));
}

export function shouldShowIberiaPayInitReloadModalImpl(ctrl: PmtPageController) {
        if (!ctrl.hasIberiaPayPaymentMethod()) {
            return false;
        }
        if (ctrl.$window.IBDC) {
            return false;
        }
        return !ctrl.canPayIberiaPayWithoutIbdc();
}

const IBERIA_PAY_SCRIPT_WAIT_TIMEOUT_MS = 3000;

export function validateIberiaPayAfterInitImpl(ctrl: PmtPageController) {
        if (!ctrl.shouldShowIberiaPayInitReloadModal()) {
            return;
        }
        ctrl.$timeout(() => {
            if (!ctrl.shouldShowIberiaPayInitReloadModal()) {
                return;
            }
            console.error(`[PMT][IberiaPay] IBDC still missing after wait ${IBERIA_PAY_SCRIPT_WAIT_TIMEOUT_MS}`);
            ctrl.showPaymentInitReloadModal();
        }, IBERIA_PAY_SCRIPT_WAIT_TIMEOUT_MS);
}

    /**
     * This function added error message to field CREDITCARD_NUMBER or CVV according error code.
     * @param {event} Error Event to launch the function , Is a event send by iFrame IberiaPay if detected any error in  in fields CREDITCARD_NUMBER or CVV
     */
export function iberiaPayErrorsControllImpl(ctrl: PmtPageController, event) {
        const errorCode = event.detail.resultValidCard;
        ctrl.localStorageService.set('ibPayTrace', event.detail);
        ctrl.ibPayTrace = event.detail;
        if (ctrl.quotaIbPayCall) {
            ctrl.$scope.$broadcast('unCheckQuotas');
            delete ctrl.quotaIbPayCall;
        }

        ctrl.$scope.$broadcast('iberiaPayError', errorCode);
        ctrl.$timeout(() => {
            if(ctrl.model.paymentInfo.price.totalPrice !==0)
                ctrl.PmtModalService.finishWaiting();
        });
}
