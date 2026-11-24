import type { PmtPageController } from '../ib-pmt-controller';

const AFOP_PAYMENT_CALLBACKS = new Set([
    'AFOP_BIZUM',
    'AFOP_SOFORT',
    'AFOP_IDEAL',
    'AFOP_MERCADO_PAGO'
]);

const BOOKING_SEARCH_FLIGHT_TYPES = new Set(['availabilityFlight', 'metasearchFlight']);

const ON_HOLD_PAYMENT_TYPES = new Set(['ONHOLD', 'ONHOLD_CREDITCARD', 'ONHOLD_IBERIA_PAY']);

export function isAfopPaymentCallback(paymentTypeCallback: string): boolean {
    return AFOP_PAYMENT_CALLBACKS.has(paymentTypeCallback);
}

export function isRedirectPaymentCallback(redirectionInfo: any): boolean {
    return redirectionInfo.paymentStatus === 'OK'
        || redirectionInfo.paymentStatus === 'KO'
        || redirectionInfo.paymentTypeCallback === 'REDIRECT'
        || isAfopPaymentCallback(redirectionInfo.paymentTypeCallback);
}

export function shouldHandleRedirectionFlow(redirectionInfo: any, dataIssueError: any): boolean {
    return Boolean(redirectionInfo && (!dataIssueError || !dataIssueError.otherPayment));
}

export function shouldHandleOtherPaymentError(dataIssueError: any): boolean {
    return Boolean(dataIssueError?.otherPayment);
}

export function shouldHandleShuttleIssueError(ctrl: PmtPageController, dataIssueError: any): boolean {
    return Boolean(dataIssueError && ctrl.isShuttleFlow && dataIssueError.errorCode === 412);
}

export function shouldPersistPaymentLocationSearch(ctrl: PmtPageController, redirectionInfo: any, paymentTypeCallback: string): boolean {
    return !redirectionInfo && !paymentTypeCallback && ctrl.localStorageService.get('actualStepFlow') !== 'ibpurc';
}

export function shouldUpdateMonetateForBookingSearch(ctrl: PmtPageController): boolean {
    if (ctrl.$rootScope.isPointsOBFlow || ctrl.$rootScope.isRedemptionFlow) {
        return false;
    }
    const flowApp = ctrl.localStorageService.get('flowApp');
    if (flowApp !== 'BBKI' && flowApp !== 'BBKIOH') {
        return false;
    }
    return BOOKING_SEARCH_FLIGHT_TYPES.has(ctrl.localStorageService.get('searchFlightType'));
}

export function shouldSendRedirectionDatalayerEvents(ctrl: PmtPageController): boolean {
    if (ctrl.isShuttleFlow) {
        return false;
    }
    return ctrl.flowApp !== ctrl.PmtConstants.APP_TYPES.GIFTCARDS
        && ctrl.flowApp !== ctrl.PmtConstants.APP_TYPES.SUBSCRIPTIONMODELS;
}

export function shouldUpdateMonetateOnPaymentLoad(ctrl: PmtPageController): boolean {
    const flowApp = ctrl.localStorageService.get('flowApp');
    return flowApp !== ctrl.PmtConstants.APP_TYPES.MANAGEMYBOOKING
        || flowApp !== ctrl.PmtConstants.APP_TYPES.MANAGEMYBOOKING_ONHOLD;
}

export function isMmbVoluntaryChangeSuccessRedirect(ctrl: PmtPageController): boolean {
    return Boolean(ctrl.localStorageService.get('paySucces'))
        && (ctrl.flowApp === ctrl.PmtConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE
            || ctrl.flowApp === ctrl.PmtConstants.APP_TYPES.MANAGEMYBOOKING_UNIFIED);
}

export function isOnHoldPaymentMethodType(type: string): boolean {
    return ON_HOLD_PAYMENT_TYPES.has(type);
}

export function hasPartnerVoucherDiscount(ctrl: PmtPageController): boolean {
    const voucherDiscount = ctrl?.model?.paymentInfo?.appliedDiscounts?.types?.[ctrl.PmtConstants.DISCOUNT_TYPES.VOUCHER];
    return Boolean(voucherDiscount && voucherDiscount.type === ctrl.PmtConstants.DISCOUNT_TYPES.PARTNER);
}

export function hasAncillariesSummary(data: any): boolean {
    return Object.keys(data.summaryInfo).length > 0
        && Boolean(data.summaryInfo.ancillaries)
        && Object.keys(data.summaryInfo.ancillaries).length > 0;
}

export function shouldFinishWaitingOnPaymentLoadError(ctrl: PmtPageController, error: any): boolean {
    // Keep exact boolean from 0f66b1b (including De Morgan quirks).
    const flowApp = ctrl.localStorageService.get('flowApp');
    const errors = error.errorData?.data?.errors;
    const hasReason = Array.isArray(errors) && errors.length > 0;
    return (flowApp !== 'MMBVC' && flowApp !== 'MMBUNIF')
        || (error.errorData?.errorCode !== 412 && hasReason && errors[0]?.code !== 'PMT_PPM_9009');
}

export function hasTicketingFee(fareData: any): boolean {
    return Boolean(fareData?.offers?.[0]?.price?.ticketingFee);
}

export function shouldSetBookingCurrency(ctrl: PmtPageController): boolean {
    const isBookingOrOnHold = ctrl.flowApp === ctrl.PmtConstants.APP_TYPES.BOOKING
        || ctrl.flowApp === ctrl.PmtConstants.APP_TYPES.ONHOLD;
    return isBookingOrOnHold && !ctrl.localStorageService.get('currency');
}
