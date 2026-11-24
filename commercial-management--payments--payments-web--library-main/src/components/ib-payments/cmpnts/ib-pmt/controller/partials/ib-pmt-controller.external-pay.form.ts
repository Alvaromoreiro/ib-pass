import angular from 'angular';
import type { PmtPageController } from '../ib-pmt-controller';
import {
    hasRedirectComponent,
    isIdealComponentRedirect,
    isIataPayRedirect,
    isOnesaitProvider,
    resolveExternalFormId,
    resolveRedirectUrl,
    shouldSetAdyenComponentInfo
} from './ib-pmt-controller.external-pay.predicates';

function setAdyenComponentInfo(ctrl: PmtPageController, formData: any): void {
    if (!shouldSetAdyenComponentInfo(formData)) {
        return;
    }
    ctrl.model.paymentInfo.componentInfoAdyen = {};
    ctrl.model.paymentInfo.componentInfoAdyen.type = formData.component.type;
}

function redirectToPaymentUrl(ctrl: PmtPageController, formData: any): void {
    ctrl.localStorageService.set('redirectionPaymentCallback', { status: true, redirectStatus: false, data: ctrl.model });
    ctrl.$window.location.href = formData.redirectURL;
}

function buildRedirectionPaymentCallback(ctrl: PmtPageController, formData: any, isComponent: boolean): any {
    const redirectionPaymentCallback: any = { status: true, redirectStatus: false, data: ctrl.model };
    if (!isComponent) {
        return redirectionPaymentCallback;
    }
    redirectionPaymentCallback.syncPayment = true;
    if (isOnesaitProvider(formData)) {
        redirectionPaymentCallback.oneSiteSync = true;
    }
    return redirectionPaymentCallback;
}

function submitHiddenRedirectForm(ctrl: PmtPageController, formData: any, formId: string, redirectURL: string): void {
    let form = `<form id="${formId}" action="${ctrl.$sce.trustAsResourceUrl(redirectURL)}" method="post">`;
    angular.forEach(formData.redirectData, (inputInfo, inputName) => {
        form += `<input type="hidden" name="${inputName}" value="${inputInfo}" />`;
    });
    form += '<input type="submit" id="submit_hidden_form" class="u-hide" /></form>';
    angular.element(ctrl.$document).find('body').append(ctrl.$compile(form)(ctrl.$rootScope));
    ctrl.$timeout(() => {
        angular.element(angular.element(ctrl.$document).find(`#${formId}`).find('#submit_hidden_form')).trigger('click');
    });
}

type PostRedirectFormContext = {
    formData: any;
    formId: string;
    redirectURL: string;
    isComponent: boolean;
};

function handlePostRedirectForm(ctrl: PmtPageController, ctx: PostRedirectFormContext): void {
    ctrl.localStorageService.set(
        'redirectionPaymentCallback',
        buildRedirectionPaymentCallback(ctrl, ctx.formData, ctx.isComponent)
    );
    submitHiddenRedirectForm(ctrl, ctx.formData, ctx.formId, ctx.redirectURL);
}

/**
 * Manage the 3DS Event to generate form and redirect to external page
 */
export function externalPayFormImpl(ctrl: PmtPageController, event, formData) {
    const isComponent = hasRedirectComponent(formData);
    const redirectURL = resolveRedirectUrl(formData);
    const formId = resolveExternalFormId(formData, redirectURL);
    ctrl.loadingIframeForm = true;

    setAdyenComponentInfo(ctrl, formData);
    if (isIataPayRedirect(formData)) {
        redirectToPaymentUrl(ctrl, formData);
        return;
    }
    if (isIdealComponentRedirect(formData)) {
        redirectToPaymentUrl(ctrl, formData);
        return;
    }
    if (angular.element(ctrl.$document).find(`#${formId}`).length !== 0) {
        return;
    }
    handlePostRedirectForm(ctrl, { formData, formId, redirectURL, isComponent });
}
