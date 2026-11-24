import { applyDiscountsFromCreateOrderData, hasRestorableCreateOrderDiscounts } from 'src/components/ib-payments/cmpnts/ib-pmt/service/ib-pmt-discount.utils';
import { PmtConstants } from 'src/app/core/ib-pmt-constants';

describe('ib-pmt-discount.utils', () => {
    const currency = { code: 'EUR' };
    const formatPrice = jasmine.createSpy('formatPrice').and.callFake((_currency, amount) => `-${amount}`);

    const buildParams = (overrides: Partial<Parameters<typeof applyDiscountsFromCreateOrderData>[0]> = {}) => ({
        appliedDiscounts: { types: {} },
        createOrderData: {
            order: {
                discountsApplied: {
                    discounts: []
                }
            }
        },
        flowApp: 'PAOB',
        currency,
        formatPrice,
        isDiscountTypePartnerEquivalent: () => false,
        ...overrides
    });

    beforeEach(() => {
        formatPrice.calls.reset();
    });

    it('does nothing when createOrderData has no discounts', () => {
        const params = buildParams();

        applyDiscountsFromCreateOrderData(params);

        expect(params.appliedDiscounts.types).toEqual({});
        expect(formatPrice).not.toHaveBeenCalled();
    });

    it('applies non-voucher discounts outside ONHOLD flow', () => {
        const specialPromotion = {
            type: 'SPECIAL_PROMOTION',
            totalDiscount: 9.15,
            description: 'Special promotion'
        };
        const params = buildParams({
            createOrderData: {
                order: {
                    discountsApplied: {
                        discounts: [specialPromotion]
                    }
                }
            }
        });

        applyDiscountsFromCreateOrderData(params);

        expect(params.appliedDiscounts.types.SPECIAL_PROMOTION).toEqual({
            ...specialPromotion,
            originalDiscount: 9.15,
            discount: '-9.15',
            discountFormatted: '-9.15'
        });
    });

    it('maps partner discounts to voucher type', () => {
        const partnerDiscount = {
            type: PmtConstants.DISCOUNT_TYPES.PARTNER,
            totalDiscount: 20
        };
        const params = buildParams({
            flowApp: PmtConstants.APP_TYPES.ONHOLD,
            createOrderData: {
                order: {
                    discountsApplied: {
                        discounts: [partnerDiscount]
                    }
                }
            }
        });

        applyDiscountsFromCreateOrderData(params);

        expect(params.appliedDiscounts.types[PmtConstants.DISCOUNT_TYPES.VOUCHER]).toEqual({
            ...partnerDiscount,
            originalDiscount: 20,
            discount: '-20',
            discountFormatted: '-20'
        });
    });

    it('skips voucher discounts outside ONHOLD flow', () => {
        const params = buildParams({
            createOrderData: {
                order: {
                    discountsApplied: {
                        discounts: [{
                            type: PmtConstants.DISCOUNT_TYPES.VOUCHER,
                            totalDiscount: 17.47
                        }]
                    }
                }
            }
        });

        applyDiscountsFromCreateOrderData(params);

        expect(params.appliedDiscounts.types).toEqual({});
        expect(formatPrice).not.toHaveBeenCalled();
    });

    it('detects restorable special discounts outside ONHOLD flow', () => {
        expect(hasRestorableCreateOrderDiscounts(buildParams({
            createOrderData: {
                order: {
                    discountsApplied: {
                        discounts: [{ type: 'SPECIAL_PROMOTION', totalDiscount: 9.15 }]
                    }
                }
            }
        }))).toBe(true);
    });

    it('does not treat voucher-only basket discounts as restorable outside ONHOLD flow', () => {
        expect(hasRestorableCreateOrderDiscounts(buildParams({
            createOrderData: {
                order: {
                    discountsApplied: {
                        discounts: [{
                            type: PmtConstants.DISCOUNT_TYPES.VOUCHER,
                            totalDiscount: 17.47
                        }]
                    }
                }
            }
        }))).toBe(false);
    });
});
