

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
    description: string;
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
export type DiscountApplied = {
    originalPrice:      OriginalPriceClass;
    discounts:          Discount[];
    originalOrderItems: OrderItems[];
    totalDiscount:      number,
    originalOfferItems : OriginalOfferItem[];
};
export type OriginalOfferItem = {
    offerItemId: string
    passengerIds: string[]
    price: OriginalPriceClass
    originCurrencyPrice: any
    reshopDetailedTaxes: any[]
    fareComponents: any[]
    surcharges: any
};

export type Discount = {
    type:                  string;
    discountType:          string;
    description:           string;
    percentDiscount:       number;
    totalDiscount:         number;
    dynamicDiscountRuleId: string;
    accountCode:           string;
};
export type OriginalPriceClass = {
    fare:         number;
    tax:          number;
    total:        number;
    currency:     string;
    ticketingFee: number;
};

export interface Order {
    bookingOffice: string;
    bookingReferences: BookingReferences[];
    orderId: string;
    orderItems: OrderItems[];
    price: Price;
    slices: Slice[];
    voucherDiscount: VoucherDiscountOrder;
    discountsApplied?:        DiscountApplied;
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
    partnerId?:                             string;
    description?:                           string;


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
