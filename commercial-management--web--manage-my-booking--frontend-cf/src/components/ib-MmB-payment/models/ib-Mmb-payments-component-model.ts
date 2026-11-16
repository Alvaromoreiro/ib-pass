export type PriceSubscriptionModel = {
    total: number;
    currency: Currency;
    charges: PriceEntries[];
    discounts: DiscountsEntries[];
    currencyConversion : CurrencyConversion;
};

export type CurrencyConversion = {
    currency: string;
    total: number;
}

export type Currency = {
    code: string;
    format: CurrencyDisplayFormat;
};

export type CurrencyDisplayFormat = {
    symbol?: {
        value?: string;
        alignment?: Alignment;
    };
    decimalDigits?: {
        value?: number;
        rounding?: Rounding;
    };
    separator?: {
        decimal?: string;
        grouping?: string;
    };
};
export type Alignment = 'L' | 'R';
export type Rounding = 'UP' | 'DOWN';

export type PriceEntries = {
    name: string;
    total: number;
    id: string;
};

export type DiscountsEntries = {
    id: string;
    total: number;
    type: 'DISCOUNTS' | 'OTHER_CHARGES' | 'JOURNEY' | 'OFFERS' | 'GIFT_CARD' | 'SUBSCRIPTION_MODELS' | 'ONHOLD';
    rewardValue?: number;
    rewardCurrency?: string;
    description?: string;
    partner?: Partner;
    rewardCode?: string;
};

export interface Partner {
    id: string;
    name?: string;
    description?: string;
}
