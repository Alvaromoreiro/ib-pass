namespace commercialDataModel {
    export type commercialData = {
        currency: Currency;
        languages: Language[];
        market: Market;
        marketFlags: MarketFlags;
        sessionTimeLifeInMinutes: number;
        maxSearchTime: number;
        minSearchTime: number;
        passengerTypes: PassengerType[];
        discounts: Discount[];
        defaultValues: DefaultValues;
        roundingPolicy: string;
        availabilityPriceShowPolicy: string;
        mainCities: MainCities;
    };

    export type MainCities = {
        normal: Normal;
        redemption: Normal;
    };

    export type Normal = {
        code: string;
        description: string;
        timezone: string;
        country: Country;
    };

    export type Country = {
        code: string;
        description?: any;
    };

    export type DefaultValues = {
        defaultPaxType: string;
        defaultPaxTypeNumbers: DefaultPaxTypeNumber[];
        maxPaxNumber: number;
        defaultPhonePrefix: DefaultPhonePrefix;
    };

    export type DefaultPhonePrefix = {
        code: string;
        description: string;
        countryCode: string;
    };

    export type DefaultPaxTypeNumber = {
        passengerType: string;
        number: number;
    };

    export type Discount = {
        code: string;
        description: string;
        countries: string[];
        cities: City[];
        relatedField: string;
        type: string;
    };

    export type City = {
        code: string;
        description: string;
        countryCode: string;
        countryDescription?: any;
        timezone: string;
        gaCode: number;
        arCode: number;
        saCode: number;
        latitude: number;
        longitude: number;
    };

    export type PassengerType = {
        passengerType: string;
        description: string;
    };

    export type MarketFlags = {
        allowedNameCorrection: boolean;
        allowedAncillaries: boolean;
        allowedFlightChange: boolean;
        allowedRefund: boolean;
        allowedCashAndAviosWithVoucher: boolean;
    };

    export type Market = {
        code: string;
        description: string;
    };

    export type Language = {
        dateFormat: DateFormat;
        code: string;
        description: string;
    };

    export type DateFormat = {
        long: string;
        medium: string;
        short: string;
    };

    export type Currency = {
        code: string;
        description: string;
        symbol: string;
        alignment: string;
        groupingSeparator: string;
        decimalSeparator: string;
        decimals: number;
        recommendedDisplay: string;
    };
}