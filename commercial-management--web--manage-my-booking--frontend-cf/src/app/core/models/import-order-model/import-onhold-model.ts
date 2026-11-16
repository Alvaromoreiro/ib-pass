export interface OnHoldModel {
    generalInfo: GeneralInfo;
    passengers:  Passenger[];
    warnings:    Warning[];
}

export type GeneralInfo = {
    notConfirmable:         boolean;
    pnr:                    string;
    origin:                 Destination;
    destination:            Destination;
    departureTime:          DepartureTime;
    returnFlight:           null;
    tripType:               number;
    flightRatio:            string;
    passengersNumber:       number;
    currency:               Currency;
    relatedContent:         RelatedContent;
    backgroundImageUrl:     string;
    primaryContactInfo:     PrimaryContactInfo;
    passengerPrices:        PassengerPrices;
    cashAviosPossibilities: CashAviosPossibility[];
    passengerInfo:          PassengerInfo;
    flightInfo:             FlightInfo;
    orderItemsId:           string[];
    orderPrice:             OrderPrice;
    voucherDisscount:       null;
    flightType:             string;
    remainingTime:          Date;
    price:                  Price;
    paidDeposit:            PaidDeposit;
    originalPrice:          string;
    warnings:               Warnings;
}

export type CashAviosPossibility = {
    totalDiscount:         number;
    currency:              string;
    aviosRequired:         number;
    offerAvailable:        boolean;
    perPassengerDiscounts: PerPassengerDiscount[];
    currencySymbol:        string;
    formatedTotalDiscount: string;
    formatedAviosRequired: string;
}

export type PerPassengerDiscount = {
    discount:           number;
    passengerType:      string;
    numberOfPassengers: number;
}

export type Currency = {
    suffixSymbol:      boolean;
    decimalSeparator:  string;
    numberDecimals:    number;
    groupingSeparator: string;
    currencySymbol:    string;
    description:       string;
}

export type DepartureTime = {
    date: Date;
    time: string;
}

export type Destination = {
    code:     string;
    name:     string;
    terminal: null | string;
    city:     City;
}

export type City = {
    code:        string;
    description: string;
    countryCode: string;
    country:     string;
}


export type Warning = {
    code:        string;
    description: string;
}


export type FlightInfo = {
    LISBRU20240326123000: Lisbru20240326123000;
}

export type Lisbru20240326123000 = {
    departureCity:       Destination;
    arrivalCity:         Destination;
    segments:            Segment[];
    departureDateParsed: DepartureDateParsed;
    arrive:              boolean;
}

export type DepartureDateParsed = {
    dateTime:     string;
    weekDay:      string;
    day:          number;
    monthNumber:  number;
    month:        string;
    year:         number;
    originalDate: Date;
    formatedDate: string;
}

export type Segment = {
    departureCity:           Destination;
    arrivalCity:             Destination;
    departureDateParsed:     DepartureDateParsed;
    companyURL:              string;
    overnight:               boolean;
    departureDateTimeParsed: string;
    arrivalDateTimeParsed:   string;
    departure:               Destination;
    arrival:                 Destination;
    flight:                  Flight;
    durationParsed:          string;
    arrive:                  boolean;
    cabin:                   CabinClass;
    fareFamilyConditions:    FareFamilyCondition[];
}

export type CabinClass = {
    rbd:            string;
    description:    string;
    remainingSeats: number;
    fareFamily:     string;
    code:           string;
    type:           string;
    bookingClass:   string;
}

export type FareFamilyCondition = {
    cabin:     string;
    cabinType: string;
    code:      string;
    name:      string;
    title:     null | string;
    message:   null | string;
    units:     number | null;
}

export type Flight = {
    marketingCarrier:        Carrier;
    operationalCarrier:      Carrier;
    marketingFlightNumber:   string;
    operationalFlightNumber: string;
    operationalDisclosure:   string;
    aircraft:                Warning;
}

export type Carrier = {
    code: string;
    name: string;
}

export type OrderPrice = {
    fare:         number;
    tax:          number;
    total:        number;
    currency:     string;
    ticketingFee: number;
}

export type PaidDeposit = {
    priceFormat: string;
    price:       number;
}

export type PassengerInfo = {
    ADULT_01: Adult01;
}

export type Adult01 = {
    type:             string;
    name:             string;
    surname:          string;
    loyaltyCard:      string;
    specialNeedFound: boolean;
    specialNeeds:     SpecialNeed[];
}

export type SpecialNeed = {
    departureCity:   Destination;
    arrivalCity:     Destination;
    specialNeeds:    any[];
    showSpecialNeed: boolean;
}

export type PassengerPrices = {
    ADULT: Adult;
}

export type Adult = {
    fare:               number;
    formattedFare:      string;
    formattedInTax:     string;
    breakdownTaxes:     BreakdownTax[];
    tax:                number;
    numberOfPassengers: number;
    totalTax:           number;
    formattedTotalTax:  string;
}

export type BreakdownTax = {
    code:        string;
    amount:      string;
    currency:    string;
    description: string;
    subcode:     null;
    country:     null;
    carrier:     null;
}

export type Price = {
    original:     number;
    formatted:    string;
    perPassenger: string;
}

export type PrimaryContactInfo = {
    email: string;
    phone: string;
}

export type RelatedContent = {
    CONFIRM_ONHOLD_CONDITIONS: Warnings;
}

export type Warnings = {
}

export type Passenger = {
    passengerType:                string;
    personalInfo:                 PersonalInfo;
    passengerId:                  string;
    contactInfo:                  ContactInfo;
    relatedPassengerId:           string;
    ckiStatus:                    null;
    optionalInformation:          any[];
    residenceAccreditationStatus: null;
    resiberPassengerId:           string;
    securityInformation:          SecurityInformation;
    externalPersonalInfo:         ExternalPersonalInfo;
}

export type ContactInfo = {
    phone:                  string;
    phoneDetails:           PhoneDetails;
    email:                  string;
    phoneType:              string;
    confirmationMailOption: null;
    refundEmail:            null;
    language:               string;
}

export type PhoneDetails = {
    number:      string;
    countryCode: string;
}

export type ExternalPersonalInfo = {
    name:         string;
    firstSurname: string;
    lastSurname:  string;
}

export type PersonalInfo = {
    name:        string;
    surname:     string;
    birthDate:   null;
    lastSurname: string;
}

export type SecurityInformation = {
    relatedContent: null;
}
