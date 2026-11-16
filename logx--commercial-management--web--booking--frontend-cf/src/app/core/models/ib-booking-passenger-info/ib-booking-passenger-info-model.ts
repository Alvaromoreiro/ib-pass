export type PassengerCount = {
    type: string;
    number: number;
};
export interface TemporalPNR {
    passengers: PassengerCount[];
    flightId: string;
    timeLimitUTC: Date;
    slices: SimpleSlice[];
    retrieveBkiURL: string;
    price: PassengerPricePrice,
    currency: CurrencyElement,
    languages: Language[],
    market: Market
}

export interface SimpleSlice {
    arrivalDateTime:   string;
    departureDateTime: string;
    segments:          SimpleSegment[];
}

export interface SimpleSegment {
    arrival:   Trip;
    departure: Trip;
}

export interface Trip {
    code:     string;
    name:     string;
    terminal: null | string;
    city:     City;
}

export interface City {
    code:        string;
    description: string;
    countryCode: string;
    country:     Country;
}

export interface Country {
    code:        string;
    description: string;
}

export interface OrderData {
    order:                          Order;
    passengers:                     Passenger[];
    tickets:                        any[];
    warnings:                       WarningsOrder[];
    paymentsInfo:                   any[];
    contextMetadata:                ContextMetadata;
    relatedContent:                 any[];
    feeInformations:                any[];
    errorsWithAdditionalInfo:       null;
    identificator:                  null;
    syncHasChangedPassengerName:    boolean;
    flowType:                       string;
    orderFlags:                     OrderFlag[];
    infoValidationFF:               InfoValidationFF;
    syncHasChangedSpecialNeeds:     boolean;
    syncHasChangedBaggage:          boolean;
    syncHasChangedSeats:            boolean;
    syncHasChangedPriorityBoarding: boolean;
    kpiDisruption:                  null;
    checkInInfo:                    null;
    locSurEncrypt:                  string;
}

export type WarningsOrder = {
    code: string;
    description: string;
};
export interface ContextMetadata {
    language:   string;
    country:    string;
    currencies: CurrencyElement[];
}

export interface CurrencyElement {
    code:               CurrencyEnum;
    description:        string;
    symbol:             string;
    alignment:          string;
    groupingSeparator:  string;
    decimalSeparator:   string;
    decimals:           number;
    recommendedDisplay: string;
}

export enum CurrencyEnum {
    Eur = 'EUR'
}

export interface InfoValidationFF {
    validatedFF:       boolean;
    name:              string;
    firstSurname:      string;
    frequentFlyerInfo: null;
}

export interface Order {
    orderId:                  string;
    bookingReferences:        BookingReference[];
    orderItems:               OrderItem[];
    slices:                   Slice[];
    price:                    PassengerPricePrice;
    primaryContactInfo:       PrimaryContactInfo;
    timeLimit:                Date;
    privateFareImformations:  any[];
    commissions:              any[];
    apisRequired:             boolean;
    specialDiscounts:         any[];
    extSenderReference:       null;
    bookingOffice:            string;
    accountCodes:             any[];
    checkedBagAllowances:     Allowance[];
    carryOnBaggageAllowances: Allowance[];
    brandedFares:             null;
    voucherCompensation:      null;
    pricingConfig:            null;
    status:                   null;
    cancelledOrderItems:      any[];
    orderProviderDisplayName: null;
    changeSegmentsByAmadeus:  boolean;
    orderType:                null;
    discountsApplied?:        DiscountApplied;
    voucherDiscount?:        VoucherDiscount;
}

export interface BookingReference {
    provider:  string;
    reference: string;
}

export interface Allowance {
    baggageAllowanceId: string;
    totalQuantity:      number;
    segmentIds:         string[];
    pieceAllowances?:   PieceAllowance[];
}

export interface PieceAllowance {
    totalQuantity:  number;
    commercialName: string;
    descriptions:   string[];
    type:           string;
    subcode:        null;
}

export interface OrderItem {
    type:              string;
    orderItemId:       string;
    bookingReferences: BookingReference[];
    price:             PassengerPricePrice;
    sliceIds:          string[];
    passengerPrices:   PassengerPrice[];
}

export interface PassengerPrice {
    fareCalculation:   string;
    passengerId:       string;
    price:             PassengerPricePrice;
    segmentPrices:     SegmentPrice[];
    taxes:             Tax[];
    passengerDiscount: null;
}

export interface PassengerPricePrice {
    fare:         number;
    tax:          number;
    total:        number;
    currency:     CurrencyEnum;
    ticketingFee: number;
}

export interface SegmentPrice {
    price:            SegmentPricePrice;
    fareCode:         string;
    segmentsIds:      string[];
    ticketDesignator: null;
    penalties:        Penalty[];
    penaltyFlags:     null;
}

export interface Penalty {
    type:          Type;
    application:   Application;
    minPrice:      Price;
    maxPrice:      Price;
    nonrefundable: boolean;
    cancelFeeInd:  boolean;
    changeFeeInd:  boolean;
    isRefundable:  boolean;
    isChangeable:  boolean;
}

export enum Application {
    AfterDeparture = 'AFTER-DEPARTURE',
    BeforeDeparture = 'BEFORE-DEPARTURE'
}

export interface Price {
    amount:   number;
    currency: CurrencyEnum;
}

export enum Type {
    Cancel = 'Cancel',
    Change = 'Change'
}

export interface SegmentPricePrice {
    fare:     number;
    currency: CurrencyEnum;
}

export interface Tax {
    code:        string;
    amount:      number;
    currency:    CurrencyEnum;
    description: string;
    subcode:     string;
    country:     string;
    carrier:     null;
}

export interface PrimaryContactInfo {
    phone:                  string;
    email:                  string;
    phoneType:              string;
    hashEID:                string;
    confirmationMailOption: null;
}

export interface Slice {
    sliceId:              string;
    departureDateTime:    string;
    arrivalDateTime:      string;
    duration:             number;
    stopsNumber:          number;
    price:                SegmentPricePrice;
    detailedPrices:       DetailedPrice[];
    segments:             Segment[];
    overnight:            boolean;
    origin:               null;
    destination:          null;
    originDestinationKey: null;
}

export interface DetailedPrice {
    fare:          number;
    currency:      CurrencyEnum;
    passengerIds:  string[];
    segmentPrices: SegmentPrice[];
}

export interface Segment {
    departure:                 Trip;
    arrival:                   Trip;
    flight:                    Flight;
    cabin:                     Cabin;
    overnight:                 boolean;
    id:                        string;
    duration:                  number;
    waitingTime:               number;
    providerId:                null;
    ticketDesignator:          string;
    secureFlightInformed:      boolean;
    secureFlight:              boolean;
    departureDateTime:         string;
    arrivalDateTime:           string;
    status:                    null;
    relatedDisruptedSegmentId: null;
    stop:                      null;
}

export interface Aircraft {
    code:        string;
    description: string;
}

export interface Cabin {
    rbd:              string;
    bookingCode:      string;
    bookingClass:     string;
    remainingSeats:   number;
    fareFamily:       string;
    seatDisplays:     null;
    brandCode:        null;
    cabinDescription: string;
}

export interface Flight {
    marketingCarrier:        Carrier;
    operationalCarrier:      Carrier;
    marketingFlightNumber:   string;
    operationalFlightNumber: null | string;
    operationalDisclosure:   string;
    aircraft:                Aircraft;
}

export interface Carrier {
    code: string;
    name: string;
}

export interface OrderFlag {
    type:    string;
    enabled: boolean;
}

export interface Passenger {
    passengerType:                string;
    personalInfo:                 PersonalInfo;
    passengerId:                  string;
    idInfo:                       null;
    contactInfo:                  null;
    residenceAccreditationStatus: null;
    documentInfos:                null;
    redressInfo:                  null;
    emergencyContactInfo:         null;
    externalPersonalInfo:         ExternalPersonalInfo;
    indirectOnBusinessInfo:       null;
    frequentFlyerInfo:            null;
}

export interface ExternalPersonalInfo {
    name:         string;
    firstSurname: string;
    lastSurname:  string;
}

export interface PersonalInfo {
    firstName:     string;
    firstSurname:  string;
    lastSurname:   string;
    surnameSuffix: string;
}

export interface MandatoryDocs {
    code:        string;
    description: string;
    showFields:  ShowFields;
    number:      string;
}

export type ShowFields = {
    NUM_DOC?:    any;
    BIRTH_DATE?: any;
};

export interface TravelDocumentsResponse {
    meta:      Meta;
    documents: Document[];
}

export type Document = {
    document_type:   string;
    document_number: string;
    expiry_date:     string;
    country:         string;
    id:              string;
};

export type Meta = {
    timestamp:       Date;
    additional_info: string;
};

export type DiscountApplied = {
    originalPrice:      OriginalPriceClass;
    discounts:          Discount[];
    originalOrderItems: OrderItem[];
    totalDiscount:      number,
    originalOfferItems : OriginalOfferItem[];
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

type CreateOrderRequestOfferItems = {
    offerItemId: string;
    passengerIds: string[];
};
type CreateOrderRequestPassengers = {
    passengerId: string;
    passengerType: string;
    personalInfo: CreateOrderRequestPersonalInfo;
};
type CreateOrderRequestPersonalInfo = {
    firstName: string;
    firstSurname: string;
};
type CreateOrderRequestPrimaryContact = {
    email: string;
    phone: string;
    phoneType: string;
    phonePrefix: string;
    prefixCountryCode: string;
};
export type CreateOrderRequestData = {
    shoppingResponseId: string;
    offerItems: CreateOrderRequestOfferItems[];
    passengers: CreateOrderRequestPassengers[];
    primaryContact: CreateOrderRequestPrimaryContact;
    onHold: boolean;
    redemptionOptionId: string | null;
};
export type OrderDataError = {
    errorCode: number;
    internalErrorCode: string;
    message: string;
    needsTranslate: boolean,
    requestURL: string;
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
export type VoucherDiscount = Discount & {
    amount: number;
    formattedAmount: string;
    priceWithDiscount: number;
    totalBookingAmountWithDiscountApplied: number;
    voucherId: number;
};
