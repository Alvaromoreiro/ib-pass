import angular from 'angular';
import type { PmtPageController } from '../ib-pmt-controller';

declare global {
    class AdyenCheckout {
        constructor(obj: unknown);
    }
}

function extract3ds2AdditionalDetails(state: any): string | null {
    if (state.data.details['threeds2.fingerprint']) {
        return state.data.details['threeds2.fingerprint'];
    }
    if (state.data.details['threeds2.challengeResult']) {
        return state.data.details['threeds2.challengeResult'];
    }
    return null;
}

function buildAdyenConfiguration(ctrl: PmtPageController, onAdditionalDetails: (state: any) => void) {
    return {
        locale: ctrl.PmtUtilsService.getLanguagePaypal(),
        environment: ctrl.$rootScope.production ? 'live' : 'test',
        clientKey: ctrl.$rootScope.production
            ? ctrl.PmtConstants.ADYEN_CLIENT_KEY.production
            : ctrl.PmtConstants.ADYEN_CLIENT_KEY.test,
        onAdditionalDetails
    };
}

function mountAdyenRedirect(ctrl: PmtPageController, serviceData: any): void {
    const div = '<div id="pmt-adyen-redirect" class="sr-only"></div>';
    angular.element(ctrl.$document).find('body').append(ctrl.$compile(div)(ctrl.$rootScope));
    serviceData.component.data = {
        MD: serviceData.component.providerData.md,
        PaReq: serviceData.component.providerData.paReq,
        TermUrl: serviceData.component.providerData.termUrl
    };
    serviceData.component.type = serviceData.component.authenticationType;
    delete serviceData.component.providerData;
    delete serviceData.component.authenticationType;
    ctrl.localStorageService.set('redirectionPaymentCallback', {
        status: true,
        redirectStatus: false,
        data: ctrl.model,
        syncPayment: true
    });
    ctrl.activeAdyenComponent = ctrl.adyenCheckout.createFromAction(serviceData.component).mount('#pmt-adyen-redirect');
}

function mountAdyenFingerprint(ctrl: PmtPageController, serviceData: any): void {
    angular.element(ctrl.$document[0].getElementById('pmt-adyen-finger-print')).remove();
    angular.element(ctrl.$document[0].getElementsByClassName('adyen-checkout-risk__device-fingerprint--wrapper')).remove();
    const div = '<div id="pmt-adyen-finger-print" class="sr-only"></div>';
    angular.element(ctrl.$document).find('body').append(ctrl.$compile(div)(ctrl.$rootScope));
    serviceData.component.type = serviceData.component.authenticationType;
    delete serviceData.component.authenticationType;
    ctrl.activeAdyenComponent = ctrl.adyenCheckout.createFromAction(serviceData.component).mount('#pmt-adyen-finger-print');
}

function mountAdyenChallenge(ctrl: PmtPageController, serviceData: any): any {
    ctrl.PmtModalService.finishWaiting();
    const challengeModal = ctrl.PmtModalService.showGenericModal(true, 'ib-modal-payment-3ds2.html', {}, 'ib-modals--adyen');
    challengeModal.result.then(angular.noop, () => {
        ctrl.cleanAdyenComponent();
        ctrl.model.paymentInfo.componentInfoAdyen.data = 'eyJ0cmFuc1N0YXR1cyI6Ik4ifQ==';
        ctrl.submitPayment(null, '3ds2Adyen');
    });
    const config3ds2Window = { size: ctrl.$window.innerWidth >= 560 ? '03' : '01' };
    serviceData.component.type = serviceData.component.authenticationType;
    delete serviceData.component.authenticationType;
    const componentData = serviceData.component;
    ctrl.$timeout(() => {
        ctrl.activeAdyenComponent = ctrl.adyenCheckout.createFromAction(componentData, config3ds2Window).mount('#pmt-adyen-3ds2-component');
    });
    return challengeModal;
}

const ADYEN_COMPONENT_HANDLERS: Record<string, (ctrl: PmtPageController, serviceData: any) => void> = {
    REDIRECT: mountAdyenRedirect,
    FINGERPRINT: mountAdyenFingerprint
};

export function adyenComponentImpl(ctrl: PmtPageController, event, serviceData) {
    ctrl.cleanAdyenComponent();
    let challengeModal: any;
    ctrl.CommonsKeepAliveUtilsService.keepSessionAlive();
    ctrl.loadingIframeForm = true;
    ctrl.model.paymentInfo.componentInfoAdyen = {};
    ctrl.model.paymentInfo.componentInfoAdyen.type = serviceData.component.type;

    const handleOnAdditionalDetails = (state) => {
        ctrl.model.paymentInfo.componentInfoAdyen.data = extract3ds2AdditionalDetails(state);
        if (state.data.details['threeds2.challengeResult'] && challengeModal) {
            challengeModal.close();
        }
        ctrl.$timeout(() => {
            ctrl.submitPayment(null, '3ds2Adyen');
        });
    };

    ctrl.adyenCheckout = new AdyenCheckout(buildAdyenConfiguration(ctrl, handleOnAdditionalDetails));

    if (serviceData.component.type === 'CHALLENGE') {
        challengeModal = mountAdyenChallenge(ctrl, serviceData);
        return;
    }
    const handler = ADYEN_COMPONENT_HANDLERS[serviceData.component.type];
    if (handler) {
        handler(ctrl, serviceData);
    }
}
