export interface Currency {
    code: string;
    [key: string]: unknown;
}

export interface FailedItemError {
    description?: string;
}

export interface FailedItemSegment {
    error?: FailedItemError;
}

export interface FailedPaymentItem {
    type?: string;
    segments?: FailedItemSegment[];
    pasengers?: FailedItemSegment[];
    error?: FailedItemError;
}

export interface CancelData {
    failedToDelete?: FailedPaymentItem[];
}

export interface FareFamily {
    commercialCode?: string;
    [key: string]: unknown;
}

export type FareFamilyConditions = Record<string, FareFamily>;

export interface AncillaryItem {
    type?: string;
    orderId?: string;
    status?: string;
    bookingCode?: string;
    total?: number;
    bags?: number;
}

export interface DisruptionContactApi {
    disruptionContact?: {
        email?: string;
    };
}

export interface BobProduct {
    type: 'checkin';
    quantity?: number;
    price?: number;
    tax: number;
}

export interface BobSummary {
    number: null;
    type: null;
    status?: string;
    amount?: number;
    products: BobProduct[];
    date: null;
    slot: null;
    address: null;
    email?: string;
}

export interface BobOrder {
    id?: string;
    status?: string;
    bookingCode?: string;
    summary: BobSummary[];
}

export interface UpgradeInfoStorage {
    currency?: unknown;
}

export interface UpgradeOfferSegment {
    segmentId: number;
    cabinClass: {
        description: string;
    };
}

export interface UpgradingAncillary {
    type?: string;
    total?: number;
    upgrading?: {
        offerSegmentsClass?: UpgradeOfferSegment[];
    };
}

export interface UpgradingTrip {
    segmentId: string | number;
    cabin: string;
    origin: SegmentAirportInfo | null;
    destination: SegmentAirportInfo | null;
}

export interface UpgradingHeaderInfo {
    upgradingTrips: UpgradingTrip[];
    total: number | null;
    totalFormatted: string | null;
}

export interface CurrencyObject {
    [key: string]: unknown;
}

export interface CurrencyService {
    getCurrencyObject(currency: unknown): CurrencyObject;
    formatPrice(currency: CurrencyObject, amount: number, includeSymbol: boolean): string;
}

export type SegmentInfoSource = Pick<CkiBookingInfo.Segment, 'id' | 'departure' | 'arrival'>;

export interface SegmentAirportInfo {
    code: string;
    description: string;
}

export interface SegmentInfo {
    id: string;
    origin: SegmentAirportInfo;
    destination: SegmentAirportInfo;
}

export interface HeaderCountry {
    code: string;
    description: string;
}

export interface HeaderCity {
    code: string;
    description: string;
    timezone: string;
    country: HeaderCountry;
}

export interface HeaderFlightDates {
    outboundFlight: string;
    formatedOutboundFlight: string;
    returnFlight: string;
    formatedReturnFlight: string;
}

export interface PassengerHeaderCounters {
    passengers: number;
    numAdults: number;
    numSeniors: number;
    numYoung: number;
    numTeenager: number;
    numInfant: number;
    numChilds: number;
    numberPassengrsWithoutInfant: number;
}

export interface HeaderSegmentInfo extends PassengerHeaderCounters {
    originCity: HeaderCity;
    destinationCity: HeaderCity;
    dates: HeaderFlightDates;
}

export interface FlightDateParts {
    year: number;
    monthNumber: number;
    monthDay: number;
}

export type FlightDate = string | FlightDateParts | null | undefined;

export interface DateFormatValue {
    year: number;
    monthNumber: number;
    monthDay: number;
}

export interface HeaderTripInfo {
    originCode: string;
    destinyCode: string;
    dateFlight: string;
}

export type PassengerTypeCounter = 'numAdults' | 'numSeniors' | 'numYoung' | 'numInfant' | 'numChilds';
