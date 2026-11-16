export interface DiscountItem {
    type: string;
    description: string;
    totalDiscount: number;
    discountFormatted: string;
    percentDiscount?: number;
    dynamicDiscountRuleId?: string;
    accountCode?: string;
}

export interface DiscountsModel {
    hasDiscounts: boolean;
    total: number;
    discounts: Record<string, DiscountItem>;
    totalFormated: string;
    totalFormatted: string;
}

export interface PreparedDiscount {
    items: {
        description: string;
        total: number;
        totalFormatted: string;
    }[];
    total: number;
    totalFormatted: string;
}

export interface AncillaryRow {
    category: string;
    quantity: number;
    total: number | string;
}

export interface AncillaryInfo {
    rows: AncillaryRow[];
    totalPrice: number;
    totalFormatted: string;
}

export type PaxItem = {
    paxType: string,
    titles: string[],
    taxes: TaxItem[],
    price: PriceItem,
    qty: number,

};

type PriceItem = {
    currency: string,
    fare: number,
    tax:number,
    ticketingFee: number,
    total: number,
    allPassengersTotal: number,
    allPassengersTax: number,
    allPassengersFare: number,
    formattedTotals: FormattedTotals,
    formattedPrices: FormattedPrices
};

type FormattedPrices = {
    fareFormatted: string,
    taxFormatted: string,
    totalFormatted: string,
};
type FormattedTotals = {
    allPassengersFareFormatted: string
    allPassengersTaxFormatted: string
    allPassengersTotalFormatted: string
};

type TaxItem = {
    amount: number,
    carries: null | string,
    code: string,
    country: string,
    currency: string,
    description: string,
    origin:string,
    subcode: string,
    totalFormatted: string
};

export type TotalsType = { 
    taxes: TotalSubType,
    fares: TotalSubType,
} | null;

export type TotalSubType = {
    total: number,
    totalFormatted: string
};

export type PriceDetailAncillaries = {
    rows: AncillaryRow[];
    totalPrice: number;
    totalFormatted: string;
} | null;