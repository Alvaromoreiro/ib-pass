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

export type insuranceSelected = {
    countriesList: CountriesList[];
    insuranceCountry: InsuranceCountry;
    id: string;
    price: string;
    priceZero: string;
    originalPrice: number;
    passengers: Passenger[];
    conditionsUri: string;
    isModalLoading: boolean;
    countryInsurance: string;
    insurancePatterns: InsurancePatterns;
    consent: string;
    issueCountry: string;
    oldInsuranceCountry: InsuranceCountry;
    policyHolder: Passenger;
    passengerDocument: string;
    birthDateDay: string;
    birthDateMonth: string;
    birthDateYear: BirthDateYear;
};

interface BirthDateYear {
    year: number;
}

interface InsurancePatterns {
    IT: string;
}

interface Passenger {
    passengerType: string;
    personalInfo: PersonalInfo;
    passengerId: string;
    seat: null;
    resiberId: string;
    isComplete: boolean;
    document: string;
}

interface PersonalInfo {
    name: string;
    surname: string;
    lastSurname: string;
    surnameSuffix: string;
    infant: null;
}

interface InsuranceCountry {
    country: Country;
    passengerRequiredFields: PassengerRequiredField[];
}

interface CountriesList {
    country: Country;
    passengerRequiredFields: PassengerRequiredField[];
}

interface PassengerRequiredField {
    passengerType: string;
    requiredFieldsGroups: RequiredFieldsGroup[];
    requiredForAll: boolean;
}

interface RequiredFieldsGroup {
    requiredFields: RequiredField[];
}

interface RequiredField {
    requiredField: string;
    pattern: null | string;
}

export interface BookingHttpErrorModel extends ProcessedHttpError {
    errorCode: number;
    requestURL: string;
    data?: BookingHttpErrorModelData;
    serviceError?: BookingHttpErrorModelData;
}

export type BookingHttpErrorModelData = {
    errors?: BookingHttpErrorDataGeneralDataErrors[];
    error?: BookingHttpErrorDataGeneralDataErrors;
};

export type BookingHttpErrorDataGeneralDataErrors = {
    reason: string;
    code: string;
    errorDescription?: string;
    errorCode?: string;
};

export type BookingHttpResponse<T> = {
    code: number;
    data: T;
};

export interface BookingErrorHandlerControl extends CommonsErrorsModel.CommonsErrorsResponseGeneral {
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

export interface ReactComponentData<PropsT> {
    props: PropsT,
    component: (props: PropsT) => import('react/jsx-runtime').JSX.Element;
}
export interface LoyaltyProgramEarnModel { 
    avios: number, elitePoints: number,  programName: 'IBPLUS'|'IBZERO' 
}

export interface BookingURLParams {
    modeWeb?:             string;
    searchOrigin?:        string;
    tripType?:            string;
    senior?:              string;
    adult?:               number;
    young?:               string;
    teenager?:            string;
    child?:               string;
    infant?:              string;
    resident?:            string;
    largeFamilyType?:     string;
    flexDates?:           string;
    preferredCabin?:      string;
    payWithAvios?:        string;
    payWithPoints?:       string;
    ibGroup?:             string;
    referralId?:          string;
    displayedPrice?:      number;
    slices?:              Array<string[]>;
    userCurrency?:        string;
    priceCurrency?:       string;
    numTrips?:            string;
    originDestinations?:  OriginDestination[];
    bookingCode1?:        string;
    backToUrl?:           string;
    codeTracking?:        string;
    travelAgent?:         string;
    fromMarket?:          string;
    fromLanguage?:        string;
    metasearchMainCabin?: string;
}

export interface OriginDestination {
    origin:      string;
    destination: string;
    date:        Date;
}