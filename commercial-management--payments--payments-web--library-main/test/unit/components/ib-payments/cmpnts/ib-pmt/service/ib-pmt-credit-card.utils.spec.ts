import { findCreditCardTypeByCode } from '../../../../../../../src/components/ib-payments/cmpnts/ib-pmt/service/ib-pmt-credit-card.utils';

describe('ib-pmt-credit-card.utils', () => {
    const creditCardTypes = [
        { cardTypeId: '1', cardTypeCode: 'VI' },
        { cardTypeId: '5', cardTypeCode: 'CA' },
        { cardTypeId: '4', cardTypeCode: 'DC' }
    ];

    describe('findCreditCardTypeByCode', () => {
        it('finds by exact code', () => {
            expect(findCreditCardTypeByCode(creditCardTypes, 'DC')?.cardTypeId).toBe('4');
        });

        it('returns undefined when there is no match', () => {
            expect(findCreditCardTypeByCode(creditCardTypes, 'ME')).toBeUndefined();
            expect(findCreditCardTypeByCode(creditCardTypes, 'UP')).toBeUndefined();
            expect(findCreditCardTypeByCode(creditCardTypes, null)).toBeUndefined();
        });
    });
});
