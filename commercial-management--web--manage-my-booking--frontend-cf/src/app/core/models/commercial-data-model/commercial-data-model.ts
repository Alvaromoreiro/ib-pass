export interface CommercialData {
    currency: Currency;
    languages?: (LanguagesEntity)[] | null;
    market: Market;
    marketFlags: MarketFlags;
    sessionTimeLifeInMinutes: number;
    maxSearchTime: number;
    minSearchTime: number;
    passengerTypes?: (PassengerTypesEntity)[] | null;
    availabilityType: string;
    discounts?: (DiscountsEntity)[] | null;
    defaultValues: DefaultValues;
    roundingPolicy: string;
    availabilityPriceShowPolicy: string;
    mainCities: MainCities;
}

export interface Currency {
    code: string;
    description: string;
    symbol: string;
    alignment: string;
    groupingSeparator: string;
    decimalSeparator: string;
    decimals: number;
    recommendedDisplay: string;
}

export interface LanguagesEntity {
    dateFormat: DateFormat;
    code: string;
    description: string;
}

export interface DateFormat {
    long: string;
    medium: string;
    short: string;
}

export interface Market {
    code: string;
    description: string;
}

export interface MarketFlags {
    allowedNameCorrection: boolean;
    allowedAncillaries: boolean;
    allowedFlightChange: boolean;
    allowedRefund: boolean;
    allowedCashAndAviosWithVoucher: boolean;
}

export interface PassengerTypesEntity {
    passengerType: string;
    description: string;
}

export interface DiscountsEntity {
    code: string;
    description: string;
    countries?: (string)[] | null;
    cities?: (CitiesEntity | null)[] | null;
    relatedField: string;
    type: string;
}

export interface CitiesEntity {
    code: string;
    description: string;
    countryCode: string;
    countryDescription?: null;
    timezone: string;
    gaCode: number;
    arCode: number;
    saCode: number;
    latitude: number;
    longitude: number;
}

export interface DefaultValues {
    defaultPaxType: string;
    defaultPaxTypeNumbers?: (DefaultPaxTypeNumbersEntity)[] | null;
    maxPaxNumber: number;
    defaultPhonePrefix: DefaultPhonePrefix;
}

export interface DefaultPaxTypeNumbersEntity {
    passengerType: string;
    number: number;
}

export interface DefaultPhonePrefix {
    code: string;
    description: string;
    countryCode: string;
}

export interface MainCities {
    normal: NormalOrRedemption;
    redemption: NormalOrRedemption;
}

export interface NormalOrRedemption {
    code: string;
    description: string;
    timezone: string;
    country: Country;
}

export interface Country {
    code: string;
    description?: null;
}
  