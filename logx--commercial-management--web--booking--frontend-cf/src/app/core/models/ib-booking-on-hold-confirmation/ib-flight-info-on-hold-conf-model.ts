import { FlightDetails } from './ib-general-info-on-hold-conf-model';

export type Country = {
    code: string;
    description: string;
};

export type City = {
    code: string;
    description: string;
    countryCode: string;
    country: Country;
};

export type Airport = {
    code: string;
    name: string;
    terminal: string;
    city: City;
};

export type DateParsed = {
    dateTime: string;
    weekDay: string;
    day: number;
    monthNumber: number;
    month: string;
    year: number;
    originalDate: string;
    formatedDate: string;
};

export type Carrier = {
    code: string;
    name: string;
};

export type Aircraft = {
    code: string;
    description: string;
};

export type Flight = {
    marketingCarrier: Carrier;
    operationalCarrier: Carrier;
    marketingFlightNumber: string;
    operationalFlightNumber: string;
    operationalDisclosure: string;
    aircraft: Aircraft;
};

export type Cabin = {
    rbd: string;
    description: string;
    remainingSeats: number;
    fareFamily: string;
    code: string;
    type: string;
    brandCode: string;
    bookingClass: string;
};

export type FareFamilyCondition = {
    cabin: string;
    cabinType: string;
    code: string;
    icon?: string;
    name: string;
    title: string;
    message: string;
    units: number | null;
};

export type Segment = {
    departureCity: Airport;
    arrivalCity: Airport;
    departureDateParsed: DateParsed;
    companyURL: string;
    overnight: boolean;
    departureDateTimeParsed: string;
    arrivalDateTimeParsed: string;
    departure: Airport;
    arrival: Airport;
    flight: Flight;
    durationParsed: string;
    arrive: boolean;
    cabin: Cabin;
    fareFamilyConditions: FareFamilyCondition[];
};

export type FlightRoute = {
    departureCity: Airport;
    arrivalCity: Airport;
    segments: Segment[];
    departureDateParsed: DateParsed;
    arrive: boolean;
};

export type FlightInfo = {
    [key: string]: FlightRoute;
};

export interface SortedFlightInfo {
    key: string;
    value: FlightDetails
}
