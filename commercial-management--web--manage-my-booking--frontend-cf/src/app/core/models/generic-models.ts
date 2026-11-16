import { ProcessedHttpError } from 'ib-web-commons/dist/models';

namespace IbBookingGenericModel {
    export type PartnersModalModel = {
        idModal: string;
        title: string,
        howToSelect: object,
        partners: partnerDiscountInfoBKI[];
        partnerSelected: string,
        dontAskAgain: boolean
    };

}
type Currency = {
    code: string;
    description: string;
    symbol: string;
    alignment: string;
    groupingSeparator: string;
    decimalSeparator: string;
    decimals: number;
    recommendedDisplay: string;
};
type DateFormat = {
    long: string;
    medium: string;
    short: string;
};
type Language = {
    dateFormat: DateFormat;
    code: string;
    description: string;
};
type Market = {
    code: string;
    description: string;
};
type MarketFlags = {
    allowedNameCorrection: boolean;
    allowedAncillaries: boolean;
    allowedFlightChange: boolean;
    allowedRefund: boolean;
    allowedCashAndAviosWithVoucher: boolean;
};
type PassengerType = {
    passengerType: string;
    description: string;
};
type CommercialDataCity = {
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
export type CommercialDataDiscounts = {
    code: string;
    description: string;
    countries: string[];
    cities: CommercialDataCity[];
    relatedField: string;
    type: string;
};
type DefaultPaxTypeNumber = {
    passengerType: string;
    number: number;
};

type DefaultPhonePrefix = {
    code: string;
    description: string;
    countryCode: string;
};
type DefaultValues = {
    defaultPaxType: string;
    defaultPaxTypeNumbers: DefaultPaxTypeNumber[];
    maxPaxNumber: number;
    defaultPhonePrefix: DefaultPhonePrefix;
};
type Normal = {
    code: string;
    description: string;
    timezone: string;
    country: Country;
};
type Country = {
    code: string;
    description: string;
};
type Redemption = {
    code: string;
    description: string;
    timezone: string;
    country: Country;
};
type MainCities = {
    normal: Normal;
    redemption: Redemption;
};

export type CommercialDataMarket = {
    currency: Currency;
    languages: Language[];
    market: Market;
    marketFlags: MarketFlags;
    sessionTimeLifeInMinutes: number;
    maxSearchTime: number;
    minSearchTime: number;
    passengerTypes: PassengerType[];
    discounts: CommercialDataDiscounts[];
    defaultValues: DefaultValues;
    roundingPolicy: string;
    availabilityPriceShowPolicy: string;
    mainCities: MainCities;
    availabilityType: string;
};

export type MmBHttpErrorModel = {
    errorCode: number;
    requestURL: string;
} | ProcessedHttpError;

export type MmBHttpResponse<T> = {
    code: number;
    data: T;
};

export interface ReactComponentData<PropsT> {
    props: PropsT,
    component: (props: PropsT) => import('react/jsx-runtime').JSX.Element;
}

export interface MmbErrorHandlerControl extends CommonsErrorsModel.CommonsErrorsResponseGeneral {
    serviceError?: HandlerServiceErrorsType;
}
export type HandlerServiceErrorsType = {
    errors: HandlerServiceErrorType[];
};

export type HandlerServiceErrorType = {
    code: string;
    reason: string;
    timeStamp: string;
    uuid: any;
};

export interface MmbHttpErrorModel extends ProcessedHttpError {
    errorCode: number;
    requestURL: string;
    data?: MmbHttpErrorModelData;
    serviceError?: MmbHttpErrorModelData;
    internalErrorCode?: string;
}

export type MmbHttpErrorModelData = {
    errors?: MmbHttpErrorDataGeneralDataErrors[];
    error?: MmbHttpErrorDataGeneralDataErrors;
    flowId?: string;
    otp?: {
        email?: string;
        sessionToken?: string;
    }
};

export type MmbHttpErrorDataGeneralDataErrors = {
    reason: string;
    code: string;
    errorDescription?: string;
    errorCode?: string;
};