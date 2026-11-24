export type ResolveTotalPriceSelectedCard = {
    totalToPay?: number;
    totalFee?: number;
};

export type ResolveTotalPricePaymentMethod = {
    total: number;
    selectedDonation?: {
        option?: {
            option?: number;
        };
    };
};

export type ResolveTotalPriceParams = {
    selectedCard: ResolveTotalPriceSelectedCard;
    paymentMethod: ResolveTotalPricePaymentMethod;
    originalTotal: number;
    cardFee: number;
    donationAmount: number;
};

export type OrderFeeIndexes = {
    creditCardFeeIndex: number;
    donationIndex: number;
    hasCreditCardFee: boolean;
    hasDonation: boolean;
};

export type UpdateFeeContext = {
    selectedCard: ResolveTotalPriceSelectedCard & Record<string, unknown>;
    oldFee: number | null;
    orderFeeIndexes: OrderFeeIndexes;
    hasBasketDiscountsApplied: boolean;
    headerModelData: unknown;
};

export type DonationOption = {
    option: number;
    formatedPrice: string;
};

export type DonationPaymentMethodUpdateParams = {
    paymentMethodIndex: number;
    status: boolean;
    option: DonationOption;
    donationInfo: { partner: string; possibilities: unknown };
    newsletter: unknown;
    donationForm: unknown;
    hasBasketDiscountsApplied: boolean;
};

export type DonationPriceChangeParams = {
    paymentMethodIndex: number;
    totalPrice: number;
    status: boolean;
    option: DonationOption;
    withFormattedOldPrice: boolean;
};

export type CheckDonationParams = {
    status: boolean;
    option: DonationOption;
    donationInfo: { partner: string; possibilities: unknown };
    newsletter: unknown;
    donationForm: unknown;
};

export type IbPmtFeeHost = {
    model: any;
    getOriginalOBPrice: () => number;
    setOriginalOBPrice: (price: number) => void;
    setNoDiscountOBPrice: (formattedPrice: string) => void;
    setAppliedCCFee: (applied: boolean) => void;
    setDonationEnabled: (enabled: boolean) => void;
    updateTotalFees: () => void;
};
