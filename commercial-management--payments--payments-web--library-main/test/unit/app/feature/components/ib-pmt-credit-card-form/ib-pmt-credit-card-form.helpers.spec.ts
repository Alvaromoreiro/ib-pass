import {
    findSelectedCardTypeFromBin,
    isProhibitedChileDebit,
    resolveBinCcFee,
    resolveCreditCardChangeAction,
    resolveTypeCardLoadingState,
    shouldClearSelectedCardOnShorten,
    shouldFetchGuestDccData,
    shouldRemoveIframeError
} from '../../../../../../src/app/feature/components/ib-pmt-credit-card-form/ib-pmt-credit-card-form.helpers';

describe('ib-pmt-credit-card-form.helpers', () => {
    const creditCardTypes = [
        { cardTypeId: '1', cardTypeCode: 'VI' },
        { cardTypeId: '5', cardTypeCode: 'CA' },
        { cardTypeId: '4', cardTypeCode: 'DC' }
    ];

    it('finds card by bin type with same rules as the previous while', () => {
        expect(findSelectedCardTypeFromBin(creditCardTypes, 'VI', null, null)?.cardTypeId).toBe('1');
        expect(findSelectedCardTypeFromBin(creditCardTypes, 'ME', null, null)?.cardTypeId).toBe('5');
        expect(findSelectedCardTypeFromBin(creditCardTypes, 'UP', 'ERR', 'DC')?.cardTypeId).toBe('4');
        expect(findSelectedCardTypeFromBin(creditCardTypes, 'UP', null, 'DC')).toBeUndefined();
    });

    it('resolves cc fee only for permitted flows', () => {
        expect(resolveBinCcFee(10, 'BBKI', () => true)).toBe(10);
        expect(resolveBinCcFee(10, 'OTHER', () => false)).toBe(0);
        expect(resolveBinCcFee(0, 'BBKI', () => true)).toBe(0);
    });

    it('resolves guest dcc fetch like the previous nested ifs', () => {
        expect(shouldFetchGuestDccData({
            userLogged: true,
            dccAvailable: true,
            flowApp: 'ONHOLD',
            onholdAppType: 'ONHOLD',
            originalDccAvailable: true
        })).toBe(false);
        expect(shouldFetchGuestDccData({
            userLogged: null,
            dccAvailable: true,
            flowApp: 'X',
            onholdAppType: 'ONHOLD',
            originalDccAvailable: false
        })).toBe(true);
        expect(shouldFetchGuestDccData({
            userLogged: null,
            dccAvailable: false,
            flowApp: 'ONHOLD',
            onholdAppType: 'ONHOLD',
            originalDccAvailable: true
        })).toBe(true);
    });

    it('resolves credit card change actions like the previous branches', () => {
        expect(resolveCreditCardChangeAction({
            isProhibitedCard: true,
            lengthNumberCard: 4,
            submittedTab: true,
            isError: false,
            genericErrorCardNumber: 999,
            prohibitedCardNumber: 6666
        })).toEqual({ type: 'prohibited-short', errorCardNumberIbPay: 999 });
        expect(resolveCreditCardChangeAction({
            isProhibitedCard: true,
            lengthNumberCard: 0,
            submittedTab: true,
            isError: false,
            genericErrorCardNumber: 999,
            prohibitedCardNumber: 6666
        })).toEqual({ type: 'prohibited-short', errorCardNumberIbPay: 1 });
        expect(resolveCreditCardChangeAction({
            isProhibitedCard: true,
            lengthNumberCard: 10,
            submittedTab: true,
            isError: false,
            genericErrorCardNumber: 999,
            prohibitedCardNumber: 6666
        })).toEqual({ type: 'prohibited-long', errorCardNumberIbPay: 6666 });
        expect(resolveCreditCardChangeAction({
            isProhibitedCard: true,
            lengthNumberCard: 10,
            submittedTab: false,
            isError: false,
            genericErrorCardNumber: 999,
            prohibitedCardNumber: 6666
        }).type).toBe('clear');
        expect(resolveCreditCardChangeAction({
            isProhibitedCard: true,
            lengthNumberCard: 8,
            submittedTab: true,
            isError: false,
            genericErrorCardNumber: 999,
            prohibitedCardNumber: 6666
        }).type).toBe('clear');
        expect(resolveCreditCardChangeAction({
            isProhibitedCard: false,
            lengthNumberCard: 10,
            submittedTab: true,
            isError: true,
            genericErrorCardNumber: 999,
            prohibitedCardNumber: 6666
        })).toEqual({ type: 'invalid', errorCardNumberIbPay: 999 });
        expect(resolveCreditCardChangeAction({
            isProhibitedCard: false,
            lengthNumberCard: 0,
            submittedTab: true,
            isError: true,
            genericErrorCardNumber: 999,
            prohibitedCardNumber: 6666
        })).toEqual({ type: 'invalid', errorCardNumberIbPay: 1 });
        expect(resolveCreditCardChangeAction({
            isProhibitedCard: false,
            lengthNumberCard: 10,
            submittedTab: false,
            isError: false,
            genericErrorCardNumber: 999,
            prohibitedCardNumber: 6666
        }).type).toBe('clear');
    });

    it('decides when to remove iframe errors like !(!!error)', () => {
        expect(shouldRemoveIframeError({
            statusNumberCard: false,
            errorCardNumberIbPay: null,
            errorCreditCard: true,
            statusCvv: true,
            errorCvvIbPay: 0,
            errorCvv: false
        })).toBe(true);
        expect(shouldRemoveIframeError({
            statusNumberCard: false,
            errorCardNumberIbPay: 0,
            errorCreditCard: true,
            statusCvv: true,
            errorCvvIbPay: 0,
            errorCvv: false
        })).toBe(true);
        expect(shouldRemoveIframeError({
            statusNumberCard: true,
            errorCardNumberIbPay: null,
            errorCreditCard: true,
            statusCvv: false,
            errorCvvIbPay: null,
            errorCvv: true
        })).toBe(true);
        expect(shouldRemoveIframeError({
            statusNumberCard: true,
            errorCardNumberIbPay: 1,
            errorCreditCard: true,
            statusCvv: true,
            errorCvvIbPay: 1,
            errorCvv: true
        })).toBe(false);
    });

    it('keeps prohibited chile debit and typecard loading rules', () => {
        expect(isProhibitedChileDebit('CL', 'DEBIT')).toBe(true);
        expect(isProhibitedChileDebit('ES', 'DEBIT')).toBe(false);
        expect(resolveTypeCardLoadingState(0, false)).toBe(false);
        expect(resolveTypeCardLoadingState(4, false)).toBe(true);
        expect(resolveTypeCardLoadingState(4, true)).toBe(true);
        expect(resolveTypeCardLoadingState(8, true)).toBe(false);
        expect(shouldClearSelectedCardOnShorten(10, 4, 'VI')).toBe(true);
        expect(shouldClearSelectedCardOnShorten(4, 10, 'VI')).toBe(false);
    });
});
