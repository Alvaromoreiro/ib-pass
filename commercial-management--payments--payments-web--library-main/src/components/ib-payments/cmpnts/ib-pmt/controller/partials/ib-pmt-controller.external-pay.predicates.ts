import type { PmtPageController } from '../ib-pmt-controller';

export function getSelectedPaymentMethod(ctrl: PmtPageController): any {
    return ctrl.model.paymentInfo.paymentMethods[ctrl.model.selectedData.selectedTab];
}

export function shouldSetAdyenComponentInfo(formData: any): boolean {
    return Boolean(formData.component?.type) && formData.provider !== 'ONESAIT';
}

export function isIataPayRedirect(formData: any): boolean {
    return formData.provider === 'IATA_PAY';
}

export function isIdealComponentRedirect(formData: any): boolean {
    return formData.component?.type === 'IDEAL';
}

export function isOnesaitProvider(formData: any): boolean {
    return formData.provider === 'ONESAIT';
}

export function isIdealButtonPayment(ctrl: PmtPageController): boolean {
    const paymentMethod = getSelectedPaymentMethod(ctrl);
    return paymentMethod.type === ctrl.PmtConstants.PAYMENT_TYPES.BUTTON
        && paymentMethod.provider === ctrl.PmtConstants.PAYMENTS_PROVIDER.IDEAL;
}

export function shouldSubmitIdealBankPayment(ctrl: PmtPageController, selectedBankOption: any): boolean {
    return isIdealButtonPayment(ctrl) && Boolean(selectedBankOption);
}

export function isJcbExternalCreditCard(ctrl: PmtPageController): boolean {
    const paymentMethod = getSelectedPaymentMethod(ctrl);
    return paymentMethod.type === ctrl.PmtConstants.PAYMENT_TYPES.EXTERNAL_CREDITCARD
        && paymentMethod.cardTypeCode === ctrl.PmtConstants.PAYMENTS_PROVIDER.JCB;
}

export function hasRedirectComponent(formData: any): boolean {
    return Boolean(formData?.component?.url);
}

export function resolveRedirectUrl(formData: any): string {
    return hasRedirectComponent(formData) ? formData.component.url : formData.redirectURL;
}

export function resolveExternalFormId(formData: any, redirectURL: string): string {
    if (formData.redirectData?.hash) {
        return formData.redirectData.hash;
    }
    const transactionId = redirectURL.match('[?&]transactionId=([^&]+).*$');
    if (transactionId) {
        return transactionId[1];
    }
    const authReference = redirectURL.match('[?&]authReference=([^&]+).*$');
    if (authReference) {
        return authReference[1];
    }
    return (Math.random().toString(36) + '00000000000000000').slice(2, 18);
}
