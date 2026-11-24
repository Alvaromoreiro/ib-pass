namespace DccModel {
    export type DccCurrency = {
        suffixSymbol: boolean;
        decimalSeparator: string;
        numberDecimals: number;
        groupingSeparator: string;
        currencySymbol: string;
        description: string;
        code: string;
    };

    export type DccPrice = {
        value: number;
        currencyCode: string;
    };

    export type DccConvertedPrice = {
        totalPrice: string;
        currencyCode: string;
    };

    export type DccResponseEvent = {
        result: DccResult;
    };

    export type DccResult = {
        id: string;
        rate: number;
        comissionPercentage: number;
        marginPercentage: number;
        source: string;
        sourceTimestamp: string;
        expiry: string;
        dccPrice: DccPrice;
    };

    export type DccResponse = {
        id: string;
        rate: number;
        marginPercentage: string;
        commissionPercentage: number;
        source?: string;
        sourceTimestamp: string;
        expiry?: string;
        DCCPrice: DccPrice;
        basePrice: {
            currency: DccCurrency
        },
        creditCardType: string,
    };

    export type CurrentDccData = DccResponse & {
        formattedBasePrice: DccConvertedPrice;
        formattedSourceTimestamp: string;
        totalPrice: string;
        currencyCode: string;
        selectedValue: string;

    };
}
