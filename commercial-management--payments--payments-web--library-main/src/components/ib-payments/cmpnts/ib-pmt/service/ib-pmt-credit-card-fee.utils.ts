import {
    OrderFeeIndexes,
    ResolveTotalPriceParams
} from '../models/ib-pmt-update-fee.model';
import { PmtConstants } from '../../../../../app/core/ib-pmt-constants';
import { MONETARY_AMOUNT_TOLERANCE } from '../constants/ib-pmt-credit-card-fee.constants';

export function isCardCleared (selectedCard): boolean {
    return !selectedCard || (!selectedCard.cardTypeCode && !selectedCard.cardTypeId);
}

export function findOrderFeeIndexes (orderFees: Array<{ code: string }> | undefined): OrderFeeIndexes {
    const indexes: OrderFeeIndexes = {
        creditCardFeeIndex: 0,
        donationIndex: 0,
        hasCreditCardFee: false,
        hasDonation: false
    };
    if (!orderFees?.length) return indexes;

    orderFees.forEach((orderFee, index) => {
        if (orderFee.code === PmtConstants.ORDER_ITEMS_TYPES.CREDIT_CARD_FEE) {
            indexes.hasCreditCardFee = true;
            indexes.creditCardFeeIndex = index;
        }
        if (orderFee.code !== PmtConstants.ORDER_ITEMS_TYPES.DONATION) return;
        indexes.hasDonation = true;
        indexes.donationIndex = index;
    });
    return indexes;
}

export function findDonationOrderFeeIndex (orderFees: Array<{ code: string }> | undefined): number {
    if (!orderFees?.length) return -1;
    return orderFees.findIndex((orderFee) => orderFee.code === PmtConstants.ORDER_ITEMS_TYPES.DONATION);
}

export function shouldAddCreditCardFee (selectedCard): boolean {
    return selectedCard.totalFee !== 0 && Boolean(selectedCard.fee);
}

export function shouldApplyDonationToPaymentMethod (
    paymentMethod,
    option,
    status: boolean,
    checkAvailableDonation: (possibilities, paymentMethod) => boolean,
    donationInfo
): boolean {
    const hasConflictingDonation = paymentMethod.selectedDonation &&
        option.option !== paymentMethod.selectedDonation.option.option;
    const canUpdateDonation = !paymentMethod.selectedDonation || hasConflictingDonation || !status;
    return canUpdateDonation && checkAvailableDonation(donationInfo.possibilities, paymentMethod);
}

export function resolveTotalPrice ({
    selectedCard,
    paymentMethod,
    originalTotal,
    cardFee,
    donationAmount
}: ResolveTotalPriceParams): number {
    const { totalToPay } = selectedCard;
    if (totalToPay == null) return paymentMethod.total;

    const isDonationMissingFromTotal =
        Boolean(paymentMethod.selectedDonation) &&
        Math.abs(totalToPay - (originalTotal + cardFee)) < MONETARY_AMOUNT_TOLERANCE;
    if (isDonationMissingFromTotal) return totalToPay + donationAmount;
    return totalToPay;
}

export function resolveOriginalOBPriceAfterCardFee (
    originalOBPrice: number,
    oldFee: number | null,
    cardFee: number,
    hasCreditCardFeeInStorage: boolean
): number {
    let price = originalOBPrice;
    if (oldFee) price -= oldFee;
    if (!hasCreditCardFeeInStorage) return price;
    return price + cardFee;
}

export function resolvePaymentMethodTotalWithCardFee ({
    originalTotal,
    donationAmount,
    status,
    cardFee,
    hasSelectedCard
}: {
    originalTotal: number;
    donationAmount: number;
    status: boolean;
    cardFee: number;
    hasSelectedCard: boolean;
}): number {
    if (status && hasSelectedCard && cardFee > 0) return originalTotal + donationAmount + cardFee;
    if (status) return originalTotal + donationAmount;
    if (hasSelectedCard && cardFee > 0) return originalTotal + cardFee;
    return originalTotal;
}

export function resolvePaymentMethodTotalWithoutCardFee ({
    originalTotal,
    donationAmount,
    aviosDiscount = 0
}: {
    originalTotal: number;
    donationAmount: number;
    aviosDiscount?: number;
}): number {
    return originalTotal - aviosDiscount + donationAmount;
}

export function isFeeAlreadyInPaymentMethodTotal (
    paymentMethodTotal: number,
    originalTotal: number,
    donationAmount: number,
    cardFee: number
): boolean {
    return cardFee > 0 &&
        Math.abs(paymentMethodTotal - (originalTotal + donationAmount + cardFee)) < MONETARY_AMOUNT_TOLERANCE;
}

export function resolveDonationChangeTotalPrice ({
    paymentMethod,
    originalTotal,
    selectedCard,
    cardFee,
    donationAmount
}: {
    paymentMethod: ResolveTotalPriceParams['paymentMethod'];
    originalTotal: number;
    selectedCard: ResolveTotalPriceParams['selectedCard'] | null | undefined;
    cardFee: number;
    donationAmount: number;
}): number {
    if (!selectedCard) return paymentMethod.total;

    if (cardFee <= 0) return paymentMethod.total;

    if (isFeeAlreadyInPaymentMethodTotal(paymentMethod.total, originalTotal, donationAmount, cardFee)) {
        return paymentMethod.total;
    }

    return paymentMethod.total + cardFee;
}

export function hasOrderBasketDiscounts (createOrderData): boolean {
    return Boolean(createOrderData?.order?.discountsApplied?.discounts?.length > 0);
}

export function getStoredCreditCardFee (creditCardFeeStorage): number | null {
    return creditCardFeeStorage ? creditCardFeeStorage.totalFee : null;
}

export function getLastStoredDonationOption (storedDonation) {
    if (!storedDonation?.option?.option) return null;
    return storedDonation.option;
}

export function resolvePreviousDonationAmount (
    lastDonation,
    orderFees: Array<{ totalFee?: number }> | undefined,
    donationOrderFeeIndex: number
): number {
    if (lastDonation?.option != null) return lastDonation.option;
    if (donationOrderFeeIndex >= 0 && orderFees?.[donationOrderFeeIndex]?.totalFee != null) {
        return orderFees[donationOrderFeeIndex].totalFee;
    }
    return 0;
}

export function addDonationAmountToDatalayer (datalayerGeneral, datalayerConstants, donationAmount: number): void {
    if (!datalayerGeneral || !donationAmount) return;

    datalayerGeneral[datalayerConstants.DATALAYER_INFO.TOTAL_PRICE] =
        Math.round((datalayerGeneral[datalayerConstants.DATALAYER_INFO.TOTAL_PRICE] + donationAmount) * 100) / 100;
    datalayerGeneral[datalayerConstants.DATALAYER_INFO.TOTAL_PRICE_WITHOUT_FEE] =
        Math.round((datalayerGeneral[datalayerConstants.DATALAYER_INFO.TOTAL_PRICE_WITHOUT_FEE] + donationAmount) * 100) / 100;
}

export function subtractDonationAmountFromDatalayer (datalayerGeneral, datalayerConstants, donationAmount: number): void {
    if (!datalayerGeneral || !donationAmount) return;

    datalayerGeneral[datalayerConstants.DATALAYER_INFO.TOTAL_PRICE] =
        Math.round((datalayerGeneral[datalayerConstants.DATALAYER_INFO.TOTAL_PRICE] - donationAmount) * 100) / 100;
    datalayerGeneral[datalayerConstants.DATALAYER_INFO.TOTAL_PRICE_WITHOUT_FEE] =
        Math.round((datalayerGeneral[datalayerConstants.DATALAYER_INFO.TOTAL_PRICE_WITHOUT_FEE] - donationAmount) * 100) / 100;
}
