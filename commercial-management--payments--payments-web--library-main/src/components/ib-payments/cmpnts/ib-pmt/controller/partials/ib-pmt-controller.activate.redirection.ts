import type { PmtPageController } from '../ib-pmt-controller';
import {
    isAfopPaymentCallback,
    isMmbVoluntaryChangeSuccessRedirect,
    isRedirectPaymentCallback,
    shouldSendRedirectionDatalayerEvents
} from './ib-pmt-controller.activate.predicates';

function getAdyenCallbackData(ctrl: PmtPageController): { md: string; paRes: string } {
    const mdParam = ctrl.PmtUtilsService.getURLFirstParameterByName(ctrl.PmtConstants.URL_PARAMS_NAMES.PAYMENT_3DS2_CALLBACK_MD);
    const paResParam = ctrl.PmtUtilsService.getURLFirstParameterByName(ctrl.PmtConstants.URL_PARAMS_NAMES.PAYMENT_3DS2_CALLBACK_PARES);
    const storedAdyen = ctrl.localStorageService.get('componentInfoAdyen');
    return {
        md: mdParam || storedAdyen.md,
        paRes: paResParam || storedAdyen.paRes
    };
}

function submitAdyenRedirectionPayment(ctrl: PmtPageController): void {
    ctrl.model.paymentInfo.componentInfoAdyen.data = getAdyenCallbackData(ctrl);
    ctrl.submitPayment(null, '3ds2Adyen');
}

function submitAfopRedirectionPayment(ctrl: PmtPageController): void {
    if (ctrl.model.paymentInfo.componentInfoAdyen) {
        const redirectResult = ctrl.PmtUtilsService.getURLFirstParameterByName('redirectResult')
            || ctrl.localStorageService.get('redirectResult');
        ctrl.model.paymentInfo.componentInfoAdyen.redirectResult = redirectResult;
    }
    ctrl.submitPayment(null, 'iberiaPayAfop');
}

function submitMmbVoluntaryChangeRedirect(ctrl: PmtPageController): void {
    ctrl.$scope.$emit('changeStep', ctrl.PmtConstants.COMPONENT_PAGE.PAYMENTS_PAGE, ctrl.PmtConstants.COMPONENT_PAGE.CONFIRMATION_PAGE);
}

function submitOneSiteSyncRedirection(ctrl: PmtPageController): void {
    ctrl.submitPayment(null, '3dsOneSiteSync');
}

function submitOneSiteIframeRedirection(ctrl: PmtPageController): void {
    ctrl.submitPayment(null, '3ds2OneSite');
}

export function sendRedirectionDatalayerEvents(ctrl: PmtPageController): void {
    if (!shouldSendRedirectionDatalayerEvents(ctrl)) {
        return;
    }
    ctrl.updateDatalayerWithQuadrigam(
        ctrl.localStorageService.get('pmtModelInfo').quadrigams.payments,
        ctrl.localStorageService.get('confirmationDatalayerInfo'),
        ctrl.PmtUtilsService.isUserLogged()
    );
    ctrl.DatalayerUtilsService.sendDatalayerEvent(ctrl.PmtDatalayerConstants.DATALAYER_EVENT_TYPES.VIEW);
    ctrl.DigitalDataService.emitViewEvent();
}

export function submitRedirectionPayment(ctrl: PmtPageController, redirectionInfo: any, isRedirectComponent: boolean): void {
    if (isMmbVoluntaryChangeSuccessRedirect(ctrl)) {
        submitMmbVoluntaryChangeRedirect(ctrl);
        return;
    }
    if (isRedirectComponent && ctrl.model.paymentInfo.componentInfoAdyen) {
        submitAdyenRedirectionPayment(ctrl);
        return;
    }
    if (isRedirectComponent && redirectionInfo.oneSiteSync) {
        submitOneSiteSyncRedirection(ctrl);
        return;
    }
    if (isRedirectComponent && redirectionInfo.oneSiteIframe) {
        submitOneSiteIframeRedirection(ctrl);
        return;
    }
    if (isAfopPaymentCallback(redirectionInfo.paymentTypeCallback)) {
        submitAfopRedirectionPayment(ctrl);
        return;
    }
    ctrl.submitPayment(null);
}

export function processRedirectionScriptsResponse(ctrl: PmtPageController, redirectionInfo: any): void {
    sendRedirectionDatalayerEvents(ctrl);
    if (!isRedirectPaymentCallback(redirectionInfo)) {
        ctrl.localStorageService.remove('redirectionPaymentCallback');
        ctrl.reloadPage();
        return;
    }
    const isRedirectComponent = redirectionInfo.paymentTypeCallback === 'REDIRECT' || redirectionInfo.syncPayment;
    ctrl.localStorageService.set('redirectionPaymentCallback', redirectionInfo);
    submitRedirectionPayment(ctrl, redirectionInfo, isRedirectComponent);
    ctrl.localStorageService.set('noShowMessageBockBack', true);
}

function normalizePaymentTransition(paymentTransition: string): string {
    return paymentTransition === 'IDEAL' ? 'SOFORT' : paymentTransition;
}

export function handleRedirectionPaymentFlow(ctrl: PmtPageController, redirectionInfo: any, paymentTransition: string, paymentTypeCallback: string): void {
    const transition = normalizePaymentTransition(paymentTransition);
    ctrl.PmtModalService.showWaitingModal('ib-modal-pmt-cards', 'ib-modals ib-modals--transparent', true, { transition });
    redirectionInfo.paymentStatus = ctrl.PmtUtilsService.getURLFirstParameterByName(ctrl.PmtConstants.URL_PARAMS_NAMES.PAYMENT_STATUS);
    redirectionInfo.paymentTypeCallback = paymentTypeCallback;
    ctrl.model = redirectionInfo.data;
    ctrl.ibPayTrace = ctrl.localStorageService.get('ibPayTrace');
    ctrl.model.paymentInfo.relatedContent = ctrl.PmtUtilsService.getPaymentRelatedContent(
        ctrl.model.paymentInfo.relatedContent.original.termsAndConditions,
        ctrl.model.paymentInfo.relatedContent.original.totalPriceText
    );
    redirectionInfo.redirectStatus = true;
    ctrl.dataRequest = ctrl.localStorageService.get('pmtModelInfo');
    ctrl.PmtService.getScripts(ctrl.model.paymentInfo, ctrl.model.selectedData.selectedTab).then((response) => {
        ctrl.model.paymentInfo = response.paymentInfo;
        ctrl.model.selectedData.selectedTab = response.selectedTab;
        processRedirectionScriptsResponse(ctrl, redirectionInfo);
    });
}
