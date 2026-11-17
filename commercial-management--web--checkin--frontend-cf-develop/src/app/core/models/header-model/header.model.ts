export type ShoppingBasketDiscountObjectType = {
    description?: string;
    discountFormatted: string;
    discount?: number;
    discountType: string;
    percentDiscount?: number;
    totalDiscount: number;
    type: string;
};
export type GlobickTransfersInfo = {
    date: string,
    dateReturn?: string,
    transferCar: string,
    totalFormatted: string,
    totalFormattedReturn?: string
};
export interface HeaderModelLocalstorage {
    headerModel: HeaderModel;
    greyBarModel: GreyBarModel;
    shoppingBasket: ShoppingBasket;
}

export interface HeaderModel {
    flightType: string;
    redemption: string;
    trips?: (null)[] | null;
    isMultiflight: boolean;
    passengers?: null;
    shoppingBasket: ShoppingBasket;
    advancedSearch: boolean;
    showModalBackHome: boolean;
    currency: Currency;
    pendingPaymentItems: any[];
}

export interface ShoppingBasket {
    baggages: Baggages;
    bundle: Bundle;
    seats: Seats;
    insurance: Insurance;
    insuranceAllianzFusionInfo?: InsuranceAllianzFusionInfo,
    flexibilization: Flexibilization;
    upgrading: Upgrading;
    speqs: Speqs;
    priorityBoarding: PriorityBoarding;
    carbonFootprint: CarbonFootprint;
    globickTransfers: GlobickTransfers;
    globickActivities: GlobickActivities;
    discountsModel: DiscountsModel;
    othersModel: OthersModel;
    segmentsInfo?: (null)[] | null;
    showBasket: boolean;
    currency: Currency;
    total: Total;
}

export interface Baggages {
    segments?: (SegmentsBaggage)[] | null;
    hasBaggage: boolean;
    total?: Total1;
}

export interface SegmentsBaggage {
    segmentId: string;
    baggages?: (BaggagesEntity)[] | null;
    total: number;
    origin: OriginOrDestination;
    destination: OriginOrDestination;
}

export interface BaggagesEntity {
    type: string;
    quanty: number;
    description: string;
    passengers?: (string)[] | null;
    total: number;
    totalFormatted: string;
}

export interface CodeAndDescription {
    code: string;
    description: string;
}

export interface OriginOrDestination extends CodeAndDescription {
    countryCode: string;
    country: Country;
}

export interface Country {
    code: string;
    description: string;
}

export interface Total1 {
    total: number;
    totalFormatted: string;
}

export interface Bundle {
    info?: (null)[] | null;
    hasBundle: boolean;
}

export interface Seats {
    segments?: (SegmentsSeats)[] | null;
    hasSeats: boolean;
    total?: Total1;
}

export interface SegmentsSeats {
    segmentId: string;
    isEarly: boolean;
    seats?: (SeatsEntity)[] | null;
    origin: OriginOrDestination;
    destination: OriginOrDestination;
    quanty: number;
    total: number;
    totalFormatted: string;
}

export interface SeatsEntity {
    type: string;
    description: string;
    quanty: number;
    passengers?: (PassengersEntityOrPaymentPassengerEntity)[] | null;
    amount: number;
    totalFormatted: string;
    freePassenger?: (null)[] | null;
    totalAmountFreePassenger: string;
    paymentPassenger?: (PassengersEntityOrPaymentPassengerEntity)[] | null;
    totalAmountPaymentPassenger: string;
}

export interface PassengersEntityOrPaymentPassengerEntity {
    id: string;
    amount: number;
    amountFormatted: string;
}

export interface Insurance {
    info?: InfoInsurance;
    hasInsurance: boolean;
    total?: Total1;
}

export interface InsuranceAllianzFusionInfo {
    code: string;
    hasInsuranceAllianzFusion: boolean;
    info?: InfoInsuranceAllianzFusionInfo;
    total?: Total1;
}
export interface InfoInsuranceAllianzFusionInfo {
    description: string;
    totalFormatted: string;
}

export interface InfoInsurance {
    offer: string;
    passengers: number;
    type: string;
}

export interface Flexibilization {
    info?: any;
    hasFlexibilization: boolean;
}

export interface CabinClass extends CodeAndDescription {
    type: string;
}

export interface SegmentsUpg {
    segment: number; //ID
    cabinClass?: CabinClass;
    origin: CodeAndDescription;
    destination: CodeAndDescription;
}

export interface Upgrading extends Total1 {
    hasUpgrading: boolean;
    segments?: (SegmentsUpg)[] | null;
}

export interface Speqs {
    segments?: (SegmentsSpeq)[] | null;
    hasSpeqs: boolean;
    total?: Total1;
}

export interface SegmentsSpeq {
    segmentId: string;
    speqs?: (SpeqsEntity)[] | null;
    total: number;
    origin: OriginOrDestination;
    destination: OriginOrDestination;
}

export interface SpeqsEntity {
    type: string;
    quanty: number;
    description: string;
    passengers?: (string)[] | null;
    total: number;
    totalFormatted: string;
}

export interface PriorityBoarding {
    info?: InfoPriorityBoarding | null;
    hasPriorityBoarding: boolean;
}

export interface InfoPriorityBoarding {
    type: string;
    title: string;
    category: string;
    currency: Currency;
    amount: number;
    items?: (null)[] | null;
    delete?: (DeleteEntity)[] | null;
    trips?: (TripsEntity)[] | null;
    priceFormatted: string;
}

export interface DeleteEntity {
    type: string;
}

export interface TripsEntity {
    id: string;
    arrival: OriginOrDestination;
    departure: OriginOrDestination;
    amount: number;
    priceFormatted: string;
    quantity: number;
}

export interface CarbonFootprint {
    info?: null;
    hasCarbonFootprint: boolean;
}

export interface GlobickTransfers {
    hasTransfersGlobick: boolean;
    info?: GlobickTransfersInfo;
    total?: Total1;
}

export interface GlobickActivities {
    info?: null;
    hasActivitiesGlobick: boolean;
}

export interface DiscountsModel {
    hasDiscounts: boolean;
    total: number;
    discounts: DiscountsOrLoginOrLoggedData;
}

export interface DiscountsOrLoginOrLoggedData {
}

export interface OthersModel {
    hasElements: boolean;
    others?: (null)[] | null;
    total: Total1;
}

export interface Currency {
    suffixSymbol: boolean;
    decimalSeparator: string;
    numberDecimals: number;
    groupingSeparator: string;
    currencySymbol: string;
    description: string;
}

export interface Total {
    formatted: string;
    totalPrice: number;
    original: number;
}

export interface GreyBarModel {
    login: DiscountsOrLoginOrLoggedData;
    loggedData: DiscountsOrLoginOrLoggedData;
    userLogged: boolean;
    isONB: boolean;
    isLogged: boolean;
    show: boolean;
}

export interface CheckInsurance {
    insurance: Insurance,
    insuranceAllianzFusionInfo: InsuranceAllianzFusionInfo
}
