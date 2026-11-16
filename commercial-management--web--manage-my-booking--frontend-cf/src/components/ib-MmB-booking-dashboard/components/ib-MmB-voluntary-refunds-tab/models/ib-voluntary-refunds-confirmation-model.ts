import { ArrivalOrDeparture, BookingReferencesEntity, Cabin, CountryOrAircraftOrStatus, DetailedPricesEntity, Flight, PassengerPricesEntity, PrimaryContactInfo } from "./ib-voluntary-refunds-model";

export interface VoluntaryRefundsConfirmationModel {
    order: Order;
    refundPrice: RefundPrice;
    refundTickets?: RefundTicketsEntity[] | null;
    warnings?: null[] | null;
    contextMetadata: ContextMetadata;
    hasReversePayment: boolean;
    kpiDisruption?: null;
    caseNumber?: string;
}

export interface Order {
    orderId: string;
    bookingReferences?: BookingReferencesEntity[] | null;
    orderItems?: OrderItemsEntity[] | null;
    slices?: SlicesEntity[] | null;
    price: PriceOrTaxedPrice;
    primaryContactInfo: PrimaryContactInfo;
    timeLimit?: null;
    privateFareImformations?: null[] | null;
    commissions?: null[] | null;
    apisRequired: boolean;
    specialDiscounts?: null[] | null;
    extSenderReference?: null;
    bookingOffice: string;
    accountCodes?: null;
    checkedBagAllowances?: CheckedBagAllowancesEntity[] | null;
    carryOnBaggageAllowances?: null[] | null;
    brandedFares?: null[] | null;
    voucherCompensation?: null;
    pricingConfig?: null;
    status: string;
    cancelledOrderItems?: null[] | null;
    orderProviderDisplayName?: null;
    changeSegmentsByAmadeus: boolean;
    orderType: string;
    additionalBookingInstructions?: null[] | null;
}

export interface OrderItemsEntity {
    type: string;
    orderItemId: string;
    bookingReferences?: BookingReferencesEntity[] | null;
    price: PriceOrTaxedPrice;
    sliceIds?: string[] | null;
    passengerPrices?: PassengerPricesEntity[] | null;
}

export interface PriceOrTaxedPrice {
    fare: number;
    tax: number;
    total: number;
    currency: string;
    ticketingFee: number;
}

export interface SegmentPricesEntity {
    price: PriceOrTicketOrEmdsOrTotalOrRefundPrice;
    fareCode: string;
    segmentsIds?: string[] | null;
    ticketDesignator?: string | null;
    penalties?: null[] | null;
    penaltyFlags?: null;
}

export interface PriceOrTicketOrEmdsOrTotalOrRefundPrice {
    fare: number;
    currency: string;
}

export interface TaxesEntity {
    code: string;
    amount: number;
    currency: string;
    description: string;
    subcode?: null;
    country?: null;
    carrier?: null;
}

export interface SlicesEntity {
    sliceId: string;
    departureDateTime: string;
    arrivalDateTime: string;
    duration: number;
    stopsNumber: number;
    price?: null;
    detailedPrices?: DetailedPricesEntity[] | null;
    segments?: SegmentsEntity[] | null;
    overnight: boolean;
    origin?: null;
    destination?: null;
    originDestinationKey?: null;
}

export interface SegmentsEntity {
    departure: ArrivalOrDeparture;
    arrival: ArrivalOrDeparture;
    flight: Flight;
    cabin: Cabin;
    overnight: boolean;
    id: string;
    duration: number;
    waitingTime: number;
    providerId: string;
    ticketDesignator: string;
    secureFlightInformed: boolean;
    secureFlight: boolean;
    departureDateTime: string;
    arrivalDateTime: string;
    status: CountryOrAircraftOrStatus;
    relatedDisruptedSegmentId?: null;
    stop?: null;
}

export interface City {
    code: string;
    description: string;
    countryCode: string;
    country: CountryOrAircraftOrStatus;
}

export interface CheckedBagAllowancesEntity {
    baggageAllowanceId?: null;
    totalQuantity: number;
    pieceAllowances?: PieceAllowancesEntity[] | null;
    segmentIds?: string[] | null;
}

export interface PieceAllowancesEntity {
    totalQuantity: number;
    commercialName?: null;
    descriptions?: null;
    type: string;
    subcode?: null;
}

export interface RefundTicketsEntity {
    ticketInfo: TicketInfo;
    refundPrice: RefundPrice;
}

export interface TicketInfo {
    ticketNumbers?: string[] | null;
    type: string;
    orderItemId: string;
    passengerId: string;
    passengerType: string;
    issueDateTime: string;
    fareCalculation: string;
    taxedPrice: PriceOrTaxedPrice;
    exchange: string;
    taxes?: TaxesEntity[] | null;
    couponInfoList?: CouponInfoListEntity[] | null;
    iataCode: string;
    issueCity: string;
    emdsList?: null[] | null;
    ticketPaymentInfo: TicketPaymentInfo;
}

export interface CouponInfoListEntity {
    arrival: string;
    departure: string;
    departureDate: string;
    status: string;
    fareBasis: string;
    carrier: string;
    flightNumber: string;
    flightStatus: string;
    operatingCarrier: string;
    bookingCode: string;
    designator: string;
    couponNumber: string;
    remark?: null;
    baggageDetail: BaggageDetail;
    disruptedRefundable: boolean;
}

export interface BaggageDetail {
    freeAllowance: number;
    quantityCode: string;
    unitQualifier: string;
}

export interface TicketPaymentInfo {
    type: string;
    amount: number;
}

export interface RefundPrice {
    ticket: PriceOrTicketOrEmdsOrTotalOrRefundPrice;
    emds: PriceOrTicketOrEmdsOrTotalOrRefundPrice;
    total: PriceOrTicketOrEmdsOrTotalOrRefundPrice;
}

export interface ContextMetadata {
    language: string;
    country: string;
    currencies?: null[] | null;
}
