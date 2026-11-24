import {
    addDonationAmountToDatalayer,
    getLastStoredDonationOption,
    isCardCleared,
    isFeeAlreadyInPaymentMethodTotal,
    resolveDonationChangeTotalPrice,
    resolvePaymentMethodTotalWithCardFee,
    resolvePaymentMethodTotalWithoutCardFee,
    resolvePreviousDonationAmount,
    resolveTotalPrice,
    subtractDonationAmountFromDatalayer
} from 'src/components/ib-payments/cmpnts/ib-pmt/service/ib-pmt-credit-card-fee.utils';

describe('ib-pmt-credit-card-fee.utils', () => {
    const originalTotal = 100;
    const cardFee = 10;
    const donationAmount = 5;

    describe('isCardCleared', () => {
        it('returns true when selected card is null', () => {
            expect(isCardCleared(null)).toBeTrue();
        });

        it('returns true when card has no type identifiers', () => {
            expect(isCardCleared({})).toBeTrue();
        });

        it('returns false when card has cardTypeCode', () => {
            expect(isCardCleared({ cardTypeCode: 'VI' })).toBeFalse();
        });
    });

    describe('resolveTotalPrice', () => {
        it('adds donation when totalToPay only includes original and card fee', () => {
            const totalPrice = resolveTotalPrice({
                selectedCard: { totalToPay: originalTotal + cardFee },
                paymentMethod: { total: originalTotal + donationAmount + cardFee, selectedDonation: { option: { option: donationAmount } } },
                originalTotal,
                cardFee,
                donationAmount
            });

            expect(totalPrice).toBe(originalTotal + cardFee + donationAmount);
        });

        it('uses totalToPay when donation is already included', () => {
            const totalToPay = originalTotal + donationAmount + cardFee;
            const totalPrice = resolveTotalPrice({
                selectedCard: { totalToPay },
                paymentMethod: { total: totalToPay, selectedDonation: { option: { option: donationAmount } } },
                originalTotal,
                cardFee,
                donationAmount
            });

            expect(totalPrice).toBe(totalToPay);
        });

        it('falls back to payment method total when totalToPay is missing', () => {
            const totalPrice = resolveTotalPrice({
                selectedCard: {},
                paymentMethod: { total: 150 },
                originalTotal,
                cardFee,
                donationAmount: 0
            });

            expect(totalPrice).toBe(150);
        });
    });

    describe('resolvePaymentMethodTotalWithCardFee', () => {
        it('includes donation and fee when donation is checked and card has fee', () => {
            const total = resolvePaymentMethodTotalWithCardFee({
                originalTotal,
                donationAmount,
                status: true,
                cardFee,
                hasSelectedCard: true
            });

            expect(total).toBe(originalTotal + donationAmount + cardFee);
        });

        it('keeps only card fee when donation is unchecked', () => {
            const total = resolvePaymentMethodTotalWithCardFee({
                originalTotal,
                donationAmount,
                status: false,
                cardFee,
                hasSelectedCard: true
            });

            expect(total).toBe(originalTotal + cardFee);
        });

        it('returns original total when card is cleared', () => {
            const total = resolvePaymentMethodTotalWithCardFee({
                originalTotal,
                donationAmount,
                status: false,
                cardFee: 0,
                hasSelectedCard: false
            });

            expect(total).toBe(originalTotal);
        });
    });

    describe('resolvePaymentMethodTotalWithoutCardFee', () => {
        it('subtracts avios discount and adds donation', () => {
            expect(resolvePaymentMethodTotalWithoutCardFee({
                originalTotal: 100,
                donationAmount: 5,
                aviosDiscount: 20
            })).toBe(85);
        });

        it('adds donation when avios discount is zero', () => {
            expect(resolvePaymentMethodTotalWithoutCardFee({
                originalTotal: 100,
                donationAmount: 5
            })).toBe(105);
        });
    });

    describe('resolveDonationChangeTotalPrice', () => {
        it('uses payment method total when card has no fee', () => {
            const totalPrice = resolveDonationChangeTotalPrice({
                paymentMethod: { total: originalTotal + donationAmount },
                originalTotal,
                selectedCard: { totalToPay: originalTotal, totalFee: 0 },
                cardFee: 0,
                donationAmount
            });

            expect(totalPrice).toBe(originalTotal + donationAmount);
        });

        it('reflects donation removal when card has no fee', () => {
            const totalPrice = resolveDonationChangeTotalPrice({
                paymentMethod: { total: originalTotal },
                originalTotal,
                selectedCard: { totalToPay: originalTotal + donationAmount, totalFee: 0 },
                cardFee: 0,
                donationAmount: 0
            });

            expect(totalPrice).toBe(originalTotal);
        });

        it('does not duplicate fee when it is already in payment method total', () => {
            const paymentMethodTotal = originalTotal + cardFee;

            const totalPrice = resolveDonationChangeTotalPrice({
                paymentMethod: { total: paymentMethodTotal },
                originalTotal,
                selectedCard: { totalFee: cardFee },
                cardFee,
                donationAmount: 0
            });

            expect(totalPrice).toBe(paymentMethodTotal);
        });

        it('returns payment method total when there is no selected card', () => {
            const totalPrice = resolveDonationChangeTotalPrice({
                paymentMethod: { total: originalTotal },
                originalTotal,
                selectedCard: null,
                cardFee: 0,
                donationAmount: 0
            });

            expect(totalPrice).toBe(originalTotal);
        });

        it('detects fee already included with donation', () => {
            expect(isFeeAlreadyInPaymentMethodTotal(
                originalTotal + donationAmount + cardFee,
                originalTotal,
                donationAmount,
                cardFee
            )).toBeTrue();
        });
    });

    describe('getLastStoredDonationOption', () => {
        it('returns null when donation option amount is missing', () => {
            expect(getLastStoredDonationOption(null)).toBeNull();
            expect(getLastStoredDonationOption({ option: { selected: true } })).toBeNull();
        });

        it('returns stored donation option when amount exists', () => {
            const option = { option: 5, formatedPrice: '5 EUR' };
            expect(getLastStoredDonationOption({ option })).toBe(option);
        });
    });

    describe('resolvePreviousDonationAmount', () => {
        it('uses stored donation option when available', () => {
            expect(resolvePreviousDonationAmount({ option: 3 }, [{ totalFee: 5 }], 0)).toBe(3);
        });

        it('falls back to existing order fee when storage is empty', () => {
            expect(resolvePreviousDonationAmount(null, [{ totalFee: 5 }], 0)).toBe(5);
        });

        it('returns zero when no previous donation exists', () => {
            expect(resolvePreviousDonationAmount(null, [], -1)).toBe(0);
        });
    });

    describe('datalayer donation helpers', () => {
        const datalayerConstants = {
            DATALAYER_INFO: {
                TOTAL_PRICE: 'total_price',
                TOTAL_PRICE_WITHOUT_FEE: 'total_price_without_fee'
            }
        };

        it('skips datalayer updates when datalayer is missing', () => {
            expect(() => addDonationAmountToDatalayer(null, datalayerConstants, 5)).not.toThrow();
            expect(() => subtractDonationAmountFromDatalayer(undefined, datalayerConstants, 5)).not.toThrow();
        });

        it('updates datalayer totals when donation amount changes', () => {
            const datalayerGeneral = {
                total_price: 100,
                total_price_without_fee: 90
            };

            addDonationAmountToDatalayer(datalayerGeneral, datalayerConstants, 5);
            expect(datalayerGeneral.total_price).toBe(105);
            expect(datalayerGeneral.total_price_without_fee).toBe(95);

            subtractDonationAmountFromDatalayer(datalayerGeneral, datalayerConstants, 5);
            expect(datalayerGeneral.total_price).toBe(100);
            expect(datalayerGeneral.total_price_without_fee).toBe(90);
        });
    });
});
