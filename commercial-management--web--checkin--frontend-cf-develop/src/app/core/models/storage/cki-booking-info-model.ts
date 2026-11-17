declare namespace CkiBookingInfo {
    export type FlightHaulCode = 'SH' | 'MH' | 'LH';

    export interface BookingInfo {
        checkinId: string;
        resiberLocator: string;
        gdsLocator: string;
        checkinFlowMode: string;
        passengers: Passenger[];
        checkinSegmentsInGroup: number[];
        outwardSegments: Segment[];
        returnSegments: Segment[];
        airShuttleSegments: Segment[];
        deepLinkInformation: unknown;
        primaryContact?: PrimaryContact;
        carrierConnectEnabled: boolean;
        ancillariesDisabled: boolean;
        relatedContent: unknown[];
        flightHaul?: FlightHaulCode;
        subscriptionEnabled: boolean;
    }

    export interface Infant {
        name: string;
        surname: string;
    }

    export interface Passenger {
        id: number;
        name: string;
        surname: string;
        title?: string;
        gender?: 'MALE' | 'FEMALE' | string;
        type: string;
        frequentFlyer?: FrequentFlyer;
        resident: boolean;
        requiredInformation: string[];
        optionalInformation: string[];
        status: Status;
        infant?: Infant;
        pendingPayment: boolean;
    }

    export interface FrequentFlyer {
        iataCompanyCode?: string;
        level?: string;
        number?: string;
        topTier?: string;
    }

    export interface Status {
        code: string;
        reason?: unknown;
    }

    export interface PrimaryContact {
        email: string;
        phone: string;
        phonePrefix: string;
    }

    export interface Segment {
        id: number;
        departure: AirportInfo;
        arrival: AirportInfo;
        boarding?: unknown;
        passengers: PassengerDetails[];
        operatingFlightNumber: OperatingFlightNumber;
        marketingFlightNumber?: OperatingFlightNumber;
        cabinClass: CabinClass;
        estimatedFlightTime: string;
        typeOfTransport: string;
        flown: boolean;
        aircraft: Aircraft;
        airCheckURL?: string;
        checkInStatusTime?: CheckInStatusTime;
        airCheck: boolean;

        // only airShuttleSegments
        type?: 'OPEN' | 'CONFIRMED';
    }

    export interface CheckInStatusTime {
        window: 'OPEN' | 'CLOSE';
        openDateTime: string;
        closeDateTime: string;
    }

    export interface AirportInfo {
        date: string;
        utcDate: string;
        airport: Airport;
        terminal: string;
    }

    export interface Airport {
        code: string;
        description: string;
        country: string;
    }

    export interface PassengerDetails {
        id: number;
        seat?: Seat | null;
        extraSeat?: unknown;
        altLocator?: unknown;
        noShow: boolean;
        flyNow: boolean;
        status: StatusDetail;
        mmbAvailable: boolean;
        ticket: Ticket;
        infantTicket?: unknown;
        farebasis: string;
        items: unknown[];
        inhibitBoardingCard: unknown[];
        sequenceNumber?: number | string;
        airCheckDocumentationRequired: boolean;
    }

    export interface Seat {
        row: string;
        column: string;
    }

    export interface StatusDetail {
        code: string;
        message?: string;
    }

    export interface Ticket {
        number: string;
        coupon: string;
        issueDate?: string;
        expiryDate?: string;
        status?: string;
    }

    export interface OperatingFlightNumber {
        company: Company;
        number: string;
    }

    export interface Company {
        code: string;
        description: string;
    }

    export interface CabinClass {
        code: string;
        type: string;
        description: string;
        fareFamily?: unknown;
        mainClass: string;
    }

    export interface Aircraft {
        model: string;
        cabins: string[];
    }

    export interface SelectableEntity {
        id: number;
        isSelected: boolean;
    }
}
