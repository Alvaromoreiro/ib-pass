namespace SliceData {
    export interface Slice {
        sliceId: string;
        type: string;
        departureDateTime: string;
        arrivalDateTime: string;
        duration: number;
        stopsNumber: number;
        price: Price;
        detailedPrices?: (DetailedPrice)[] | null;
        segments?: (Segment)[] | null;
        overnight: boolean;
        passengerFlags?: (PassengerFlag)[] | null;
    }
    export interface Price {
        fare: number;
        currency: string;
    }
    export interface DetailedPrice {
        fare: number;
        currency: string;
        passengerIds?: (string)[] | null;
        segmentPrices?: (SegmentPrice)[] | null;
    }
    export interface SegmentPrice {
        price: Price;
        fareCode: string;
        segmentsIds?: (string)[] | null;
        ticketDesignator?: string | null;
        penalties?: (null)[] | null;
    }
    export interface Segment {
        type: string;
        mmbAllowed: boolean;
        ckiStatus: CkiStatus;
        noShow: boolean;
        flyNow: boolean;
        flown: boolean;
        departure: Airport;
        arrival: Airport;
        departureCity: City;
        arrivalCity: City;
        flight: Flight;
        cabin: Cabin;
        overnight: boolean;
        id: string;
        duration: number;
        waitingTime: number;
        operatorLocator?: null;
        stop?: null;
        departureDateTime: string;
        departureUtcDateTime: string;
        arrivalDateTime: string;
        arrivalUtcDateTime: string;
        status: SegmentStatus;
    }

    export interface IWarning {
        code:string;
        description:string;
    }
    export interface CkiStatus {
        code: string;
        message?: null;
    }
    export interface Airport {
        code: string;
        name: string;
        terminal: string;
        city: City;
    }
    export interface City {
        code: string;
        description: string;
        countryCode: string;
        country: Country;
    }
    export interface SegmentStatus {
        code: string;
        description: string;
    }
    export interface Country {
        code: string;
        description: string;
    }
    export interface Aircraft {
        code: string;
        description: string;
    }
    export interface Flight {
        marketingCarrier: Carrier;
        operationalCarrier: Carrier;
        marketingFlightNumber: string;
        operationalFlightNumber: string;
        operationalDisclosure: string;
        aircraft: Aircraft;
    }
    export interface Carrier {
        code: string;
        name: string;
    }
    export interface Cabin {
        rbd: string;
        description: string;
        remainingSeats?: null;
        fareFamily: string;
        code: string;
        type: string;
        bookingClass: string;
    }
    export interface PassengerFlag {
        passengerId: string;
        flags?: (FlagsEntity)[] | null;
    }
    export interface FlagsEntity {
        type: string;
        enabled: boolean;
    }
}