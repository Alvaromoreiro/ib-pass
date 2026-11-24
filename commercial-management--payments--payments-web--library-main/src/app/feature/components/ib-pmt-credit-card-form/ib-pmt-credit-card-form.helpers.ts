import type { IbPmtCreditCardFormController } from './ib-pmt-credit-card-form';

export function bindCreditCardFormDependencies (ctrl: IbPmtCreditCardFormController, injected: unknown[]): void {
    [
        ctrl.$window,
        ctrl.PmtConstants,
        ctrl.PmtUtilsService,
        ctrl.$scope,
        ctrl.$route,
        ctrl.PmtModalService,
        ctrl.NewMainHeaderFacade,
        ctrl.$document,
        ctrl.localStorageService,
        ctrl.CommonsUserUtilsService,
        ctrl.CurrencyService,
        ctrl.$rootScope,
        ctrl.DccService
    ] = injected as [
        typeof ctrl.$window,
        typeof ctrl.PmtConstants,
        typeof ctrl.PmtUtilsService,
        typeof ctrl.$scope,
        typeof ctrl.$route,
        typeof ctrl.PmtModalService,
        typeof ctrl.NewMainHeaderFacade,
        typeof ctrl.$document,
        typeof ctrl.localStorageService,
        typeof ctrl.CommonsUserUtilsService,
        typeof ctrl.CurrencyService,
        typeof ctrl.$rootScope,
        typeof ctrl.DccService
    ];
}

export function matchesBinCardTypeCode (
    cardTypeCode: string | undefined,
    creditCardType: string | undefined,
    errorCode: unknown,
    typeCardIberiaPay: string | null | undefined
): boolean {
    if (cardTypeCode === creditCardType) {
        return true;
    }
    if (errorCode && cardTypeCode === typeCardIberiaPay) {
        return true;
    }
    if (creditCardType === 'ME' && cardTypeCode === 'CA') {
        return true;
    }
    return false;
}

export function findSelectedCardTypeFromBin<T extends { cardTypeCode?: string }> (
    creditCardTypes: T[] | null | undefined,
    creditCardType: string | undefined,
    errorCode: unknown,
    typeCardIberiaPay: string | null | undefined
): T | undefined {
    if (!creditCardTypes?.length) {
        return undefined;
    }
    return creditCardTypes.find((cardType) =>
        matchesBinCardTypeCode(cardType.cardTypeCode, creditCardType, errorCode, typeCardIberiaPay)
    );
}

export function resolveBinCcFee (ccFee: number | undefined, flowApp: string, isFlowAppWithFee: (flowApp: string) => boolean): number {
    if (!(ccFee > 0)) {
        return 0;
    }
    if (!isFlowAppWithFee(flowApp)) {
        return 0;
    }
    return ccFee;
}

export function shouldFetchGuestDccData (params: {
    userLogged: unknown;
    dccAvailable: boolean | undefined;
    flowApp: string;
    onholdAppType: string;
    originalDccAvailable: boolean | undefined;
}): boolean {
    if (!!params.userLogged) {
        return false;
    }
    if (params.dccAvailable) {
        return true;
    }
    if (params.flowApp !== params.onholdAppType) {
        return false;
    }
    return !!params.originalDccAvailable;
}

export function shouldRemoveIframeError (params: {
    statusNumberCard: boolean | null;
    errorCardNumberIbPay: number | null;
    errorCreditCard: boolean;
    statusCvv: boolean | null;
    errorCvvIbPay: number | null;
    errorCvv: boolean;
}): boolean {
    if (shouldRemoveFieldIframeError(params.statusNumberCard, params.errorCardNumberIbPay, params.errorCreditCard)) {
        return true;
    }
    return shouldRemoveFieldIframeError(params.statusCvv, params.errorCvvIbPay, params.errorCvv);
}

function shouldRemoveFieldIframeError (
    statusOk: boolean | null,
    errorIbPay: number | null,
    errorFlag: boolean
): boolean {
    if (statusOk) {
        return false;
    }
    if (!!errorIbPay) {
        return false;
    }
    return !!errorFlag;
}

export type CreditCardChangeAction =
    | { type: 'prohibited-short'; errorCardNumberIbPay: number }
    | { type: 'prohibited-long'; errorCardNumberIbPay: number }
    | { type: 'invalid'; errorCardNumberIbPay: number }
    | { type: 'clear' };

export function resolveCreditCardChangeAction (params: {
    isProhibitedCard: boolean;
    lengthNumberCard: number;
    submittedTab: boolean | undefined;
    isError: boolean;
    genericErrorCardNumber: number;
    prohibitedCardNumber: number;
}): CreditCardChangeAction {
    const prohibitedShort = resolveProhibitedShortAction(params);
    if (prohibitedShort) {
        return prohibitedShort;
    }
    const prohibitedLong = resolveProhibitedLongAction(params);
    if (prohibitedLong) {
        return prohibitedLong;
    }
    const invalid = resolveInvalidCardAction(params);
    if (invalid) {
        return invalid;
    }
    return { type: 'clear' };
}

function resolveErrorCardNumberByLength (lengthNumberCard: number, genericErrorCardNumber: number): number {
    return lengthNumberCard > 0 ? genericErrorCardNumber : 1;
}

function resolveProhibitedShortAction (params: {
    isProhibitedCard: boolean;
    lengthNumberCard: number;
    genericErrorCardNumber: number;
}): CreditCardChangeAction | null {
    if (!params.isProhibitedCard) {
        return null;
    }
    if (!(params.lengthNumberCard < 8)) {
        return null;
    }
    return {
        type: 'prohibited-short',
        errorCardNumberIbPay: resolveErrorCardNumberByLength(params.lengthNumberCard, params.genericErrorCardNumber)
    };
}

function resolveProhibitedLongAction (params: {
    isProhibitedCard: boolean;
    lengthNumberCard: number;
    submittedTab: boolean | undefined;
    prohibitedCardNumber: number;
}): CreditCardChangeAction | null {
    if (!params.isProhibitedCard) {
        return null;
    }
    if (!(params.lengthNumberCard > 8)) {
        return null;
    }
    if (!params.submittedTab) {
        return null;
    }
    return {
        type: 'prohibited-long',
        errorCardNumberIbPay: params.prohibitedCardNumber
    };
}

function resolveInvalidCardAction (params: {
    isError: boolean;
    submittedTab: boolean | undefined;
    lengthNumberCard: number;
    genericErrorCardNumber: number;
}): CreditCardChangeAction | null {
    if (!params.isError) {
        return null;
    }
    if (!params.submittedTab) {
        return null;
    }
    return {
        type: 'invalid',
        errorCardNumberIbPay: resolveErrorCardNumberByLength(params.lengthNumberCard, params.genericErrorCardNumber)
    };
}

export function isProhibitedChileDebit (issuerCountryCode: string, cardType: string): boolean {
    if (issuerCountryCode.toUpperCase() !== 'CL') {
        return false;
    }
    return cardType.toUpperCase() === 'DEBIT';
}

export function resolveTypeCardLoadingState (length: number, foundCard: boolean): boolean {
    if (!(length > 0)) {
        return false;
    }
    if (!foundCard) {
        return true;
    }
    return length < 8;
}

export function shouldClearSelectedCardOnShorten (
    previousLength: number,
    length: number,
    cardTypeCode: string | undefined
): boolean {
    if (!(previousLength > length)) {
        return false;
    }
    if (!(length < 8)) {
        return false;
    }
    return !!cardTypeCode;
}
