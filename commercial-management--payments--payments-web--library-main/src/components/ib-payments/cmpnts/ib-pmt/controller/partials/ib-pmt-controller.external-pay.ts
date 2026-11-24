import angular from 'angular';
import type { PmtPageController } from '../ib-pmt-controller';
import { hasRedirectComponent, resolveRedirectUrl } from './ib-pmt-controller.external-pay.predicates';

export { adyenComponentImpl } from './ib-pmt-controller.external-pay.adyen';
export { externalPayFormImpl } from './ib-pmt-controller.external-pay.form';
export { generateExternalButtonFormImpl } from './ib-pmt-controller.external-pay.button';

export function cleanAdyenComponentImpl(ctrl: PmtPageController) {
    if (ctrl.activeAdyenComponent && ctrl.activeAdyenComponent.unmount) {
        ctrl.activeAdyenComponent.unmount();
        ctrl.activeAdyenComponent = null;
    }
    ctrl.adyenCheckout = null;
}

export function oneSiteIframeImpl(ctrl: PmtPageController, event, formData) {
    ctrl.loadingIframeForm = true;
    ctrl.PmtModalService.finishWaiting();
    const isComponent = hasRedirectComponent(formData);
    const redirectURL = resolveRedirectUrl(formData);
    const redirectionPaymentCallback: any = { status: true, redirectStatus: false, data: ctrl.model };
    if (isComponent) {
        redirectionPaymentCallback.oneSiteSync = true;
        redirectionPaymentCallback.syncPayment = true;
    } else {
        redirectionPaymentCallback.oneSiteIframe = true;
    }
    ctrl.localStorageService.set('redirectionPaymentCallback', redirectionPaymentCallback);
    ctrl.PmtModalService.showGenericModal(
        false,
        'ib-modal-payment-3ds2.html',
        { iframeUrl: ctrl.$sce.trustAsResourceUrl(redirectURL) },
        'ib-modals--desktop ib-modals--reset'
    ).result.then(angular.noop, angular.noop);
}

/**
 * Generate form into modal to pay in LATAM markets
 */
export function generateIframeFormImpl(ctrl: PmtPageController, event, formData) {
    let form = `<form id="iframeForm" action="${ctrl.$sce.trustAsResourceUrl(formData.redirectURL)}" method="post" target="iframeExternalPayment">`;
    ctrl.localStorageService.set('redirectionPaymentCallback', { status: true, redirectStatus: false, data: ctrl.model });
    angular.forEach(formData.redirectData, (inputInfo, inputName) => {
        form += `<input type="hidden" name="${inputName}" value="${inputInfo}" />`;
    });

    form += '<input type="submit" id="submit_hidden_form" class="u-hide" /></form>';
    ctrl.$rootScope.$broadcast('endLoadingPlaneEvent');
    ctrl.PmtModalService.finishWaiting();
    ctrl.$timeout(() => {
        ctrl.PmtModalService.showGenericModal(false, 'external-payment-modal.html', {
            title: 'IBPURC_EXTERNAL_PAYMENT_IFRAME_BANKING_SELECT_BANK_TITLE',
            subtitle: 'IBPURC_EXTERNAL_PAYMENT_IFRAME_BANKING_SELECT_BANK_SUBTITLE',
            accept: 'PAYMENT_BUTTON_MODAL_EXTERNAL'
        }).result.then(angular.noop, angular.noop);
    });
    ctrl.$timeout(() => {
        angular.element(ctrl.$document).find('#externalPaymentModal').append(ctrl.$compile(form)(ctrl.$scope));
        angular.element(ctrl.$document).find('#iframeForm').submit();
    });
}
