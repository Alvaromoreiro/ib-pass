export interface VoucherDiscountOrder {
    accountableAmount?: number;
    amount?: number;
    currency?: string;
    voucherId?: string;
    type?: string;
    totalBookingAmountWithDiscountApplied?: number;
    campaignCommercialCode?: string;
    totalAccountable?: number;
    totalMarketing?: number;
    voucherFopType?: string;
    voucherDateRegistration?: string;
    remainingAmount?: number;
    marketingAmount?: number;
    expenses?: string;
    voucherEmail?: string;
    rewardCode?: string;
}

export interface AviosDiscountOrder {
    amount?: number;
    remainingAmount?: number;
}

export interface VoucherDiscountRealAmount {
    totalRealAmount: number;
    perPassengerDiscounts: PerPassengerDiscount[];
    perPassengerEstimatedRealAmount: number;
}

export interface PerPassengerDiscount {
    passengerType: string;
    realAmount: number;
}

export interface Order {
    bookingOffice: string;
    bookingReferences: BookingReferences[];
    orderId: string;
    orderItems: any
    price: any
    slices: any
    voucherDiscount: VoucherDiscountOrder;
}
export interface BookingReferences {
    passengerPrices: string;
    reference: string;
}
