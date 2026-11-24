import type { PmtPageController } from '../ib-pmt-controller';

function getSelectedPaymentInfo(ctrl: PmtPageController) {
    return ctrl.model.paymentInfo.selectedPaymentInfo;
}

export function hasValidQuotaPaymentInfo(ctrl: PmtPageController): boolean {
    const paymentInfo = getSelectedPaymentInfo(ctrl);
    const hasSavedCard = Boolean(
        paymentInfo.selectedLoggedCard
        && paymentInfo.selectedLoggedCard.cardTypeId !== 'newCard'
    );
    const hasManualCardDetails = Boolean(
        paymentInfo.selectedCard
        && paymentInfo.month
        && paymentInfo.year
    );
    return hasSavedCard || hasManualCardDetails;
}

export function isIberiaPaySelectedTab(ctrl: PmtPageController): boolean {
    return ctrl.model.paymentInfo.paymentMethods[ctrl.model.selectedData.selectedTab].type
        === ctrl.PmtConstants.PAYMENT_TYPES.IBERIA_PAY;
}

export function isSavedCardForQuota(ctrl: PmtPageController): boolean {
    const selectedLoggedCard = getSelectedPaymentInfo(ctrl)?.selectedLoggedCard;
    return Boolean(selectedLoggedCard && selectedLoggedCard.cardTypeId !== 'newCard');
}

export function hasQuotaErrorReason(error: any): boolean {
    return Boolean(error.data?.errors?.length);
}

export function isEmptyQuotaError(error: any): boolean {
    return hasQuotaErrorReason(error) && error.data.errors[0].code === 'PMT_PPM_13100';
}
