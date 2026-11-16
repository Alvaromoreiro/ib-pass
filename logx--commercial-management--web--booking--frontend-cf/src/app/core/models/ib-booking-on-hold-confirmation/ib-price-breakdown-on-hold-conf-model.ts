export type PriceBreakdownModel = {
    originalPrice: string;
    paidDeposit: PaidDeposit;
    price: Price;
    passengerPrices: PassengerPrices;
    voucherDiscount?: VoucherDiscount;
};

export type PaidDeposit = {
    priceFormat: string;
    price: number;
};

export type PassengerPrices = {
    [key: string]: PassengerType;
};

export type PassengerType = {
    numberOfPassengers: number;
    fare: number;
    formattedFare: string;
    formattedInTax: string;
    formattedTotalTax: string;
    breakdownTaxes: TaxBreakdown[];
};

export type TaxBreakdown = {
    amount: string;
    carrier?: string;
    code: string;
    country: string;
    currency: string;
    description: string;
    subcode: string;
};

export type Price = {
    formatted: string;
    original: number;
    perPassenger: string;
};

export type VoucherDiscount = {
    amount: number;
    formattedAmount: string;
    priceWithDiscount: number
    type: string;
    voucherId?: number;
};
