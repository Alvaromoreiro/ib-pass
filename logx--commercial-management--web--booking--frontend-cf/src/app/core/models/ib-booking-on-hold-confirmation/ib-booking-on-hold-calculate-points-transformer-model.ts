import { DiscountItem } from '@src/app/shared/components/ib-booking-price-detail-modal/price-detail-modal-models';

export type TicketResponse = {
    ticketingCarrier: TicketingCarrier;
    number: string;
    issuanceDate?: string | null;
};

export type TicketingCarrier = {
    code: string;
};

export type Ticket = {
    ticketNumbers: string[],
    issueDateTime: string,
    issuanceDate?: string | null;
};

export type PaymentItem = DiscountItem & {
    total: number
};

export type Amount = {
    amount: number;
    breakdownType?: string;
    currency: {
        code: string;
    }
};

export type FlightSegmentDetails = {
    id: string;
    operatingCarrier: {
        code: string;
    };
    marketingCarrier: {
        code: string;
    };
    ticketingCarrier?: {
        code: string;
    };
    schedule: FlightSegmentSchedule,
    bookingClass: {
        code: string;
    };
    bookingCabin: {
        code: string;
    };
    commercialCode?: string | null;
    fareProduct?: string
};

export type FlightSegmentSchedule = {
    departureAirportCode: string;
    arrivalAirportCode: string;
    departureDate: string;
};

export type FlightSliceDetails = {
    id: string;
    segments: FlightSegmentDetails[];
};

export type FlightDetails = {
    yq?: number;
    discounts?: DiscountItem[];
    slices: FlightSliceDetails[];
};

export type PassengerSegmentDetails = {
    id: string;
    couponNumber: string;
};

export type PassengerSliceDetails = {
    id: string;
    fare: number;
    totalFare: number;
};

export type PassengerFlightDetails = {
    slices: PassengerSliceDetails[];
    monetaryAmount?: Amount[];
};

export type SchemeDetails = {
    schemeIdentifier: {
        identifier: string;
    };
    recognitionLevel: {
        recognitionLevelIdentifier: {
            identifier: string;
        };
    };
};

export type PassengerDetails = {
    id: string;
    memberIdentifier?: string;
    scheme?: SchemeDetails;
    bookingSummary?: {
        bookingDate: string;
        ticketIssuanceDate?: string;
    };
    flight: PassengerFlightDetails;
};


export type GenCalAviosSummaryResponse = {
    flight: FlightDetails;
    passengers: PassengerDetails[];
    currency?: {
        code: string;
    };
};

export type PointsCalculationRequest = GenCalAviosSummaryResponse & {
    totalMonetaryAmount?: Amount[];
};

export type Ancillaries = {
    type: string,
    segmentId: string,
    subtype: string,
    amount: number,
    price: {
        fare: number
    },
    sliceId?: string | null,
    passengerId?: string,
};

export type CreateAncillaryObjectRes = {
    type: string;
    subtype: string | null;
    amounts: AncillaryAmounts[];
    slices: AncillarySlices[];
};

type AncillaryAmounts = {
    fare: number;
    quantity: number;
};

type AncillarySlices = {
    id: string;
    segments: {id: string}[];
};


export type AncillariesSlices = {
    id: string,
    segmentIds: string[],
};

export type getAncillaryInfoRes = {
    sliceId: string;
    segmentId: string
};

export type SliceResponse = {
    id: string;
    fare: number;
    totalFare: number;
};

export type CalcPointsResponse = {
    Avios: number;
    Elite: number;
};

export type CalcPointsForPassengerResponse = {
    id: string;
    memberIdentifier: string | null;
    avios: number;
    elite: number;
};

export type GenBookingSummaryResponse = {
    bookingDate: string;
    tickets: TicketResponse[];
};

export type GenFlightResponse = {
    slices: SliceResponse[];
};

