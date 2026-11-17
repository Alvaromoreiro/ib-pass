export type PriceSubscriptionModel = {
    total: number;
    currency: Currency;
    charges: PriceEntries[];
    discounts: DiscountsEntries[];
};

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
    value: number;
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
};

export interface Partner {
    id: string;
    name?: string;
    description?: string;
}
