import { DiscountItem } from '@src/app/shared/components/ib-booking-price-detail-modal/price-detail-modal-models';
import type { GeneralInfo, Passenger, WarningDetails, Currency as GeneralCurrency } from './ib-general-info-on-hold-conf-model';
export interface OnHoldComponentRequirements {
    importOrderData : OHImportResponse;
}

export interface OnHoldModel {
    generalInfo: GeneralInfo,
    passengers: Passenger[],
    warnings: WarningDetails[]
}

export interface OHImportResponse {
    flowId:                                   string;
    order:                                    Order;
    passengers:                               Passenger[];
    warnings:                                 Warning[];
    contextMetadata:                          ContextMetadata;
    fareFamilyConditions:                     FareFamilyCondition[];
    channel:                                  string;
    onHoldInformation:                        OnHoldInformation;
    relatedContent:                           RelatedContent[];
    qualifiers:                               unknown[];
    reportingWeb:                             ReportingWeb;
    flexibilizationCapabilitiesInformation:   unknown;
    genericDisruptionCapabilitiesInformation: unknown;
    upgInformation:                           UpgInformation;
    orderFlags:                               Flag[];
    paymentItems?:                            any;
    tickets?:                                 any;
}

export type ContextMetadata = {
    language:   string;
    country:    string;
    currencies: Currency[];
};

export type Currency = {
    code:               string;
    description:        string;
    symbol:             string;
    alignment:          string;
    groupingSeparator:  string;
    decimalSeparator:   string;
    decimals:           number;
    recommendedDisplay: string;
};

export type FareFamilyCondition = {
    cabinType:          string;
    cabinDescription:   string;
    commercialCode:     string;
    commercialName:     string;
    commercialNameES:   string;
    priority:           number;
    conditions:         Condition[];
    conditionsPriority: string[];
};

export type Condition = {
    code:          string;
    name:          string;
    text:          string;
    units?:        number | null;
    extendedInfo?: ExtendedInfo;
};

export type ExtendedInfo = {
    title:           string;
    message:         string;
    code:            string;
    conditionStatus: boolean;
};

export type OnHoldInformation = {
    timeLimits:         string;
    referenceTimeLimit: string;
    referenceCity:      City;
    paidDeposit:        PaidDeposit;
    remainingTime:      number;
};

export type PaidDeposit = {
    fare:     number;
    currency: string;
};

export type City = {
    code:        string;
    description: string;
    countryCode: string;
    country?:    Warning;
    timeZone?:   string;
};

export type Warning = {
    code:        string;
    description: string;
};

export type Order = {
    orderId:                                      string;
    status:                                       string;
    clientLocator:                                string;
    bookingReferences:                            BookingReference[];
    orderItems:                                   OrderItem[];
    slices:                                       Slice[];
    price:                                        Price;
    primaryContactInfo:                           ContactInfo;
    optionalInformation:                          unknown[];
    cashAviosPossibilities:                       CashAviosPossibility[];
    specialDiscounts:                             DiscountItem[];
    checkedBagAllowances:                         CheckedBagAllowance[];
    accrualQuote:                                 unknown;
    bookingCreationDates:                         BookingCreationDate[];
    sender:                                       unknown;
    officeIata:                                   string;
    availableForCheckin:                          boolean;
    earlyCheckinDone:                             boolean;
    changeSegmentsByAmadeus:                      boolean;
    orderType:                                    string;
    flightRatio:                                  string;
    referralId:                                   unknown;
    closedUserGroup:                              unknown;
    aviosRedeemed:                                unknown;
    pointsRedeemed:                               unknown;
    indirectCheckedBagAllowances:                 IndirectCheckedBagAllowance[];
    voluntaryRefundProcessedDirectlyByCallCenter: boolean;
    voucherDiscount:                              VoucherDiscount;
};

export type BookingCreationDate = {
    creationDate: string;
    provider:     string;
};

export type BookingReference = {
    provider:  string;
    reference: string;
};

export type CashAviosPossibility = {
    totalDiscount:         number;
    currency:              string;
    aviosRequired:         number;
    offerAvailable:        boolean;
    perPassengerDiscounts: PerPassengerDiscount[];
};

export type PerPassengerDiscount = {
    discount:           number;
    passengerType:      string;
    numberOfPassengers: number;
};

export type CheckedBagAllowance = {
    type:          string;
    segmentIds:    string[];
    totalQuantity: number;
};

export type IndirectCheckedBagAllowance = {
    baggageAllowanceId: unknown;
    totalQuantity:      number;
    pieceAllowances:    PieceAllowance[];
    segmentIds:         string[];
};

export type PieceAllowance = {
    totalQuantity:  number;
    commercialName: unknown;
    descriptions:   unknown;
    type:           string;
    subcode:        unknown;
};

export type OrderItem = {
    type:               string;
    orderItemId:        string;
    bookingReferences?: BookingReference[];
    price:              Price;
    sliceIds?:          string[];
    segmentId?:         string;
    passengerPrices?:   PassengerPrice[];
    passengerId?:       string;
    sliceId?:           string;
    serviceCode?:       string;
    text?:              string;
    status?:            Warning;
    name?:              string;
    description?:       string;
    onHoldTimeLimit?:   unknown| null;
};

export type PassengerPrice = {
    fareCalculation:       string;
    passengerId:           string;
    price:                 Price;
    segmentPrices:         SegmentPrice[];
    taxes:                 AvailabilityTransformerModel.Tax[];
    orderItemPaymentInfos: any[];
};

export type Price = {
    fare:         number;
    tax:          number;
    total:        number;
    currency:     string;
    ticketingFee: number;
};

export type SegmentPrice = {
    price:            PaidDeposit;
    fareCode:         string;
    segmentsIds:      string[];
    ticketDesignator: string;
    penalties:        unknown[];
    penaltyFlags:     unknown;
};



export type ContactInfo = {
    phone:                  string;
    phoneDetails:           PhoneDetails;
    email:                  string;
    phoneType:              string;
    confirmationMailOption: unknown;
    refundEmail:            null | string;
    language:               null | string;
};

export type PhoneDetails = {
    number:      string;
    countryCode: string;
};

export type Slice = {
    sliceId:              string;
    type:                 string;
    departureDateTime:    string;
    arrivalDateTime:      string;
    duration:             number;
    stopsNumber:          number;
    detailedPrices:       DetailedPrice[];
    segments:             Segment[];
    overnight:            boolean;
    passengerFlags:       PassengerFlag[];
    originDestinationKey: unknown;
};

export type DetailedPrice = {
    fare:          number;
    currency:      string;
    passengerIds:  string[];
    segmentPrices: SegmentPrice[];
};

export type PassengerFlag = {
    passengerId: string;
    flags:       Flag[];
};

export type Flag = {
    type:    string;
    enabled: boolean;
};

export type Segment = {
    type:                 string;
    mmbAllowed:           boolean;
    ckiStatus:            CkiStatus;
    noShow:               boolean;
    flyNow:               boolean;
    flown:                boolean;
    departure:            Arrival;
    arrival:              Arrival;
    departureCity:        City;
    arrivalCity:          City;
    flight:               Flight;
    cabin:                Cabin;
    overnight:            boolean;
    id:                   string;
    duration:             number;
    waitingTime:          number;
    operatorLocator:      unknown;
    stop:                 unknown;
    departureDateTime:    string;
    departureUtcDateTime: string;
    arrivalDateTime:      string;
    arrivalUtcDateTime:   string;
    status:               Warning;
};

export type Arrival = {
    code:     string;
    name:     string;
    description?: string;
    terminal: null | string;
    city:     City;
};

export type Cabin = {
    rbd:            string;
    description:    string;
    remainingSeats: number;
    fareFamily:     string;
    code:           string;
    type:           string;
    brandCode:      string;
    bookingClass:   string;
};

export type CkiStatus = {
    code:    string;
    message: string;
};

export type Flight = {
    marketingCarrier:        Carrier;
    operationalCarrier:      Carrier;
    marketingFlightNumber:   string;
    operationalFlightNumber: string;
    operationalDisclosure:   string;
    aircraft:                Warning;
};

export type Carrier = {
    code: string;
    name: string;
};

export type ExternalPersonalInfo = {
    name:         string;
    firstSurname: string;
    lastSurname:  string;
};

export type PersonalInfo = {
    name:      string;
    surname:   string;
    birthDate: null;
};

export type SecurityInformation = {
    relatedContent: null;
};

export type RelatedContent = {
    key:   string;
    value: string;
};

export type ReportingWeb = {
    device:      string;
    idColective: string;
    officeIata:  string;
    iata:        string;
    product:     string;
};

export type UpgInformation = {
    url:                unknown;
    flightsInformation: unknown;
    bidable:            boolean;
};

export type CurrencyAndOrderItems = {
    currency: GeneralCurrency;
    orderItemsIds: string[];
};



export type VoucherDiscount = DiscountItem & {
    amount: number;
    formattedAmount: string;
    priceWithDiscount: number;
    totalBookingAmountWithDiscountApplied: number;
    voucherId: number;
};
