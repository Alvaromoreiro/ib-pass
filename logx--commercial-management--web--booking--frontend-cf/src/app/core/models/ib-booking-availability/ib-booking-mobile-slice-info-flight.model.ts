export interface SliceSegment {
    segmentId?: string;
    id?: string;
    providerId?: string;
    departureDateTime: string;
    arrivalDateTime: string;
    departure: Departure;
    arrival: Departure;
    flight: Flight;
    overnight: boolean;
    waitingTime: number;
    duration: number;
    delayInformation?: DelayInformation;
    stop?: StopInformation;
    durationParsed?: string;
    isMoreThan2h?: boolean;
    waitingTimeParsed?: string;
    departureDateTimeParsed?: string;
    departureDateParsed?: DateParsed;
    arrivalDateTimeParsed?: string;
    companyURL?: string;
    companyURLMin?: string;
    warnings?: DefaultInfoWarning[];
    cabin?: CabinsMetaSearch;
    ticketDesignator?: string;
    accrualQuote?: string;
    secureFlightInformed?: boolean;
    secureFlight?: boolean;
}

export type Flight = {
    marketingCarrier: MarketingCarrier;
    operationalCarrier: MarketingCarrier;
    marketingFlightNumber: string;
    operationalFlightNumber?: any;
    operationalDisclosure: string;
    aircraft: Aircraft;
};

export type Departure = {
    code: string;
    name: string;
    terminal: string;
    city: City;
};

export type DelayInformation = {
    companyCode?: string;
    flightNumber?: string;
    lastLoad?: string;
    percent30?: number;
    percent60?: number;
    percentCancelled: boolean;
    code?: string;
    timeInformation?: string;
    delayed30?: number;
    delayed60?: number;
};

export type StopInformation = {
    city: City;
    durationParsed: string;
    duration: string;
};

export type DateParsed = {
    weekDay: string;
    hour: number;
    minutes: number;
    day: number;
    monthNumber: number;
    month: string;
    year: number;
    formatedDate: string;
};

export type DefaultInfoWarning = {
    code: string;
    description: string;
};

export type CabinsMetaSearch = {
    remainingSeats: number;
    fareFamily: string;
    rbd: string;
    bookingCode: string;
    bookingClass: string;
    fareBasis: string;
    seatDisplays: string;
    extendedFareCode: string;
    ticketDesignator: string
    brandCode: string,
    cabinDescription: string;
};

export type MarketingCarrier = {
    code: string;
    name: string;
};

export type Aircraft = {
    code: string;
    description: string;
};

export type City = {
    code: string;
    description: string;
    countryCode: string;
    country: Country;
};
