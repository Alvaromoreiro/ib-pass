import { PmtConstants } from '../../../../../app/core/ib-pmt-constants';

export type ApplyCreateOrderDiscountsParams = {
    appliedDiscounts: { types: Record<string, any> };
    createOrderData: { order?: { discountsApplied?: { discounts?: Array<any> } } };
    flowApp: string;
    currency: { code?: string };
    formatPrice: (currency: { code?: string }, amount: number) => string;
    isDiscountTypePartnerEquivalent: (discountType: string) => boolean;
};

function mapCreateOrderDiscountType (discountType: string): string {
    return PmtConstants.DISCOUNT_TYPES.PARTNER !== discountType
        ? discountType
        : PmtConstants.DISCOUNT_TYPES.VOUCHER;
}

function shouldApplyCreateOrderDiscount (
    flowApp: string,
    discountType: string,
    isDiscountTypePartnerEquivalent: (type: string) => boolean
): boolean {
    if (flowApp === PmtConstants.APP_TYPES.ONHOLD) {
        return true;
    }

    return !isDiscountTypePartnerEquivalent(discountType) &&
        discountType !== PmtConstants.DISCOUNT_TYPES.PARTNER &&
        discountType !== PmtConstants.DISCOUNT_TYPES.VOUCHER;
}

function applyCreateOrderDiscount (
    appliedDiscounts: { types: Record<string, any> },
    discount: { type: string; totalDiscount: number },
    currency: { code?: string },
    formatPrice: (currency: { code?: string }, amount: number) => string
): void {
    const maptype = mapCreateOrderDiscountType(discount.type);
    const formattedDiscount = formatPrice(currency, discount.totalDiscount);

    appliedDiscounts.types[maptype] = discount;
    appliedDiscounts.types[maptype].originalDiscount = discount.totalDiscount;
    appliedDiscounts.types[maptype].discount = formattedDiscount;
    appliedDiscounts.types[maptype].discountFormatted = formattedDiscount;
}

export function hasRestorableCreateOrderDiscounts ({
    createOrderData,
    flowApp,
    isDiscountTypePartnerEquivalent
}: Pick<ApplyCreateOrderDiscountsParams, 'createOrderData' | 'flowApp' | 'isDiscountTypePartnerEquivalent'>): boolean {
    const discounts = createOrderData?.order?.discountsApplied?.discounts;

    if (!discounts?.length) {
        return false;
    }

    return discounts.some((discount) =>
        shouldApplyCreateOrderDiscount(flowApp, discount.type, isDiscountTypePartnerEquivalent)
    );
}

export function applyDiscountsFromCreateOrderData ({
    appliedDiscounts,
    createOrderData,
    flowApp,
    currency,
    formatPrice,
    isDiscountTypePartnerEquivalent
}: ApplyCreateOrderDiscountsParams): void {
    const discounts = createOrderData?.order?.discountsApplied?.discounts;
    if (!discounts?.length) {
        return;
    }

    discounts.forEach((discount) => {
        if (!shouldApplyCreateOrderDiscount(flowApp, discount.type, isDiscountTypePartnerEquivalent)) {
            return;
        }

        applyCreateOrderDiscount(appliedDiscounts, discount, currency, formatPrice);
    });
}
