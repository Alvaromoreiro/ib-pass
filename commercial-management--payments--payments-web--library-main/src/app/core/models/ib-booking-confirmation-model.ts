export interface SummaryTripFareItem {
    code: string;
    title: string;
    text: string;
}
export interface SummaryTripFare {
    title: string;
    items: SummaryTripFareItem[]
}
export interface SummaryTripFligth {
    title: string;
    operatedBy: string;
    airplane: string;
}
export interface SummaryTripDestination {
    city: string;
    date: string;
    airport: string;
    terminal: string;
    cabin?: string;
}
export interface SummaryTrip {
    id: string;
    routeFormatted: string;
    routeCodeFormatted: string;
    departure: SummaryTripDestination;
    arrival: SummaryTripDestination;
    flight: SummaryTripFligth;
    duration: string;
    fare: SummaryTripFare;
}
export interface Price {
    fare: number;
    currency: string;
    tax?: number;
    total?: number;
    ticketingFee?: number;
}
export interface MinMaxPrice {
    amount: number;
    currency: string;
}
export interface Penalty {
    type: string;
    application: string;
    minPrice: MinMaxPrice;
    maxPrice: MinMaxPrice;
    nonrefundable: boolean;
    cancelFeeInd: boolean;
    changeFeeInd: boolean;
    isRefundable: boolean;
    isChangeable: boolean;
}
export interface SegmentPrice {
    price: Price;
    fareCode: string;
    segmentsIds: string[];
    ticketDesignator?: unknown;
    penalties: Penalty[];
    penaltyFlags?: unknown;
}
export interface DetailedPrice {
    fare: number;
    currency: string;
    passengerIds: string[];
    segmentPrices: SegmentPrice[];
}
export interface Country {
    code: string;
    description: string;
}
export interface City {
    code: string;
    description: string;
    countryCode: string;
    country: Country;
}
export interface Destination {
    code: string;
    name: string;
    terminal: string;
    city: City;
}

export interface MarketingCarrier {
    code: string;
    name: string;
}
export interface OperationalCarrier {
    code: string;
    name: string;
}
export interface Aircraft {
    code: string;
    description: string;
}
export interface Flight {
    marketingCarrier: MarketingCarrier;
    operationalCarrier: OperationalCarrier;
    marketingFlightNumber: string;
    operationalFlightNumber: string;
    operationalDisclosure: string;
    aircraft: Aircraft;
}
export interface Cabin {
    rbd: string;
    bookingCode: string;
    bookingClass: string;
    remainingSeats: number;
    fareFamily: string;
    seatDisplays?: unknown;
    brandCode?: unknown;
    description?: string;
}
export interface Segment {
    departure: Destination;
    arrival: Destination;
    flight: Flight;
    cabin: Cabin;
    overnight: boolean;
    id: string;
    duration: number;
    waitingTime: number;
    providerId?: unknown;
    ticketDesignator: string;
    secureFlightInformed: boolean;
    secureFlight: boolean;
    departureDateTime: string;
    arrivalDateTime: string;
}
export interface Slice {
    sliceId: string;
    departureDateTime: string;
    arrivalDateTime: string;
    duration: number;
    stopsNumber: number;
    price: Price;
    detailedPrices: DetailedPrice[];
    segments: Segment[];
    overnight: boolean;
    origin: string;
    destination: string;
    originDestinationKey?: unknown;
    id?: string;
}
export interface PassesgerPersonalInfo {
    name: string;
    surname: string;
    lastSurname: string;
    surnameSuffix: string;
    infant?: string | null;
}
export interface Passenger {
    passengerId: string;
    passengerType: string;
    personalInfo: PassesgerPersonalInfo;
    resiberId?: string | null;
    seat?: string | null;
}
export interface Taxes {
    amount: number;
    description: string;
    carrier?: string | null;
    code?: string;
    country?: string;
    currency?: string;
    subcode?: string;
}
export interface SegmentPrices {
    fareCode: string;
    penalties: Penalty[];
    penaltyFlags: string[] | null;
    price: Price;
    segmentsIds: string[] | null;
    ticketDesignator: string | null;
}
export interface PassengerPrices {
    fareCalculation: string;
    passengerDiscount: string | null;
    passengerId: string;
    price: Price;
    segmentPrices: SegmentPrices[];
    taxes: Taxes[];
}
export interface BookingReferences {
    passengerPrices: string;
    reference: string;
}
export interface OrderItems {
    orderItemId: string;
    passengerPrices: PassengerPrices[];
    price: Price;
    sliceIds: string[];
    type: string;
}
export interface Order {
    bookingOffice: string;
    bookingReferences: BookingReferences[];
    orderId: string;
    orderItems: OrderItems[];
    price: Price;
    slices: Slice[];
    voucherDiscount: VoucherDiscountOrder;
}
export interface VoucherDiscountOrder {
    amount:                                number;
    currency:                              string;
    voucherId:                             string;
    voucherDiscountRealAmount:             VoucherDiscountRealAmount;
    type:                                  string;
    totalBookingAmountWithDiscountApplied: number;
    campaignCommercialCode:                string;
    totalAccountable:                      number;
    totalMarketing:                        number;
    voucherFopType:                        string;
    voucherDateRegistration:               string;
    remainingAmount:                       number;

}

export interface VoucherDiscountRealAmount {
    totalRealAmount:                 number;
    perPassengerDiscounts:           PerPassengerDiscount[];
    perPassengerEstimatedRealAmount: number;
}

export interface PerPassengerDiscount {
    passengerType: string;
    realAmount:    number;
}

export type NemuruChange = ( fraction: number ) => void;
export type ShowPassegenerTaxesModal = ( passegener: string ) => void;

import { SummaryProps } from 'commercial-management--digital--web-components-design--library';

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

export type BookingHttpResponse<T> = {
    code: number;
    data: T;
};

export interface ReactComponentData<PropsT> {
    props: PropsT,
    component: (props: PropsT) => import('react/jsx-runtime').JSX.Element;
}

export interface ReferenceCity {
    code: string;
    description: string;
    countryCode: string;
}

export interface TransformedTimeDateLimit {
    dateTime: string;
    weekDay: string;
    hour: number;
    minutes: number;
    day: number;
    monthNumber: number;
    month: string;
    year: number;
    formatedDate: string;
}

export interface FareOnHoldOptions {
    onHoldOptionId: string;
    hours: number;
    securityMargin: number;
    timeLimits: string;
    referenceTimeLimit: string;
    referenceCity: ReferenceCity;
    price: Price;
    transformedTimeDateLimit: TransformedTimeDateLimit;
    onHoldPricePerPassenger: number;
}

export interface SetSummaryInfoProps {
    nemuruChange?: NemuruChange;
    showPassegenerTaxesModal?: ShowPassegenerTaxesModal;
    selectedOnHold?: FareOnHoldOptions;
}
