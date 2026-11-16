import type { DiscountApplied } from '../ib-booking-passenger-info/ib-booking-passenger-info-model';
import type { Price } from '../ib-booking-payments/ib-booking-summary-model';
export interface FareDataModel {
    offers: OffersFareDataModel[];
    responseId?: string;
    advices?: any[];
    warnings?: WarningsFare[];
    brandedFares?: any | any[] | null;
    providerDisplayName?: any | any[] | null;
    flightsOfTheHouse?: boolean;
    relatedContent?: RelatedContentItem[];
    passengers?: Passenger[];
    fareFamilyConditions?: AvailabilityTransformerModel.FareFamilyCondition[];
    services?: any[];
    
}

export type WarningsFare ={
    code: string;
    description: string;
    message: string;
    title: string;
};

export interface RelatedContentItem {
    key: string;
    value: string;
}

export interface Passenger {
    passengerId: string;
    passengerType: string;
    firstName?: string | null;
    surname?: string | null;
    frequentFlyerInfo?: string | null;
}
export interface ExtendedInfo {
    title: string;
    message: string;
    code: string;
    conditionStatus: boolean;
    observationCode: string;
}

export interface Condition {
    code: string;
    name: string;
    text: string;
    units?: number;
    extendedInfo: ExtendedInfo;
    key?:number;
    previewStatus?:boolean;
}

export interface Observation {
    observationCode: number;
    observationText: string;
}
export interface OffersFareDataModel {
    onHoldOptions: FareOnHoldOptions[];
    offerId: string;
    offerItems: AvailabilityTransformerModel.OfferItem[];
    originDestinations: AvailabilityTransformerModel.OfferOriginDestination[];
    timeLimits: Date;
    paymentTimeLimit?: any;
    specialDiscountsApplied: any[];
    providerOfferId: string;
    privateFare: boolean;
    offerType: string;
    flightModificationOnDemand: boolean;
    discountsApplied?: DiscountApplied;
    excludePenalties: boolean;
    price: Price;
    slices?: AvailabilityTransformerModel.Slice[];
    flightRatio?: string;
    accrualQuote: any;
    priceSpecialDiscount?: any;
    cashAviosPossibilities?: any;
}

export interface FareOnHoldOptions {
    onHoldOptionId: string;
    hours: number;
    securityMargin: number;
    timeLimits: string;
    referenceTimeLimit: string;
    referenceCity: ReferenceCity;
    price: Price;
    transformedTimeDateLimit?: TransformedTimeDateLimit;
    onHoldPricePerPassenger?: number;
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

export type FareRedemptionDataModel = {
    fareCashPerPassenger: number;
    fareAviosPerPassenger: number;
    tax: number;
    taxPerPassenger: number;
    redemptionOptionId: string;
    price: {
        totalCash: string;
        totalAvios: string;
    };
    promotionApplied: boolean;
    couponApplied: boolean;
};
