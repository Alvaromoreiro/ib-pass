import { DiscountItem } from '@src/app/shared/components/ib-booking-price-detail-modal/price-detail-modal-models';

export interface GeneralInfo {
    notConfirmable:         boolean;
    pnr:                    string;
    origin:                 Destination;
    destination:            Destination;
    departureTime:          DateTime;
    arrivalTime?:           DateTime;
    returnFlight:           DateTime | null;
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
    voucherDiscount:       VoucherDiscount;
    flightType:             string;
    remainingTime?:         string;
    price?:                 Price;
    paidDeposit?:           PaidDeposit;
    originalPrice?:         string;
    warnings?:              Warnings;
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
};

export type PerPassengerDiscount = {
    discount:           number;
    passengerType:      string;
    numberOfPassengers: number;
};

export type Currency = {
    suffixSymbol:      boolean;
    decimalSeparator:  string;
    numberDecimals:    number;
    groupingSeparator: string;
    currencySymbol:    string;
    description:       string;
};

export type DateTime = {
    date: string;
    time: string;
};

export type Destination = {
    code:     string;
    name:     string;
    terminal: null | string;
    city:     City;
};

export type City = {
    code:        string;
    description: string;
    countryCode: string;
    country?:     CountryClass;
};

export type CountryClass = {
    code:        string;
    description: string;
};

export type FlightInfo = {
    [flightNumber: string]: FlightDetails;
};

export type FlightDetails = {
    departureCity:       Destination;
    arrivalCity:         Destination;
    segments:            Segment[];
    departureDateParsed: DepartureDateParsed;
    arrive:              boolean;
};

export type DepartureDateParsed = {
    dateTime:     string;
    weekDay:      string;
    day:          number;
    monthNumber:  number;
    month:        string;
    year:         number;
    originalDate: string;
    formatedDate: string;
};

export type Segment = {
    departureCity:           Destination;
    arrivalCity:             Destination;
    departureDateParsed:     DepartureDateParsed;
    companyURL:              CompanyURL;
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
};

export type CompanyURL = {
    logo:string;
    logoMin:string;
};

export type CabinClass = {
    rbd:            string;
    description:    string;
    remainingSeats: number;
    fareFamily:     string;
    code:           string;
    type:           string;
    brandCode:      string;
    bookingClass:   string;
};

export type FareFamilyCondition = {
    cabin:     string;
    cabinType: string;
    code:      string;
    name:      string;
    title:     string;
    message:   string;
    units?:    number | null;
};

export type Flight = {
    marketingCarrier:        Carrier;
    operationalCarrier?:      Carrier;
    marketingFlightNumber:   string;
    operationalFlightNumber: string;
    operationalDisclosure:   string;
    aircraft:                CountryClass;
};

export type Carrier = {
    code: string;
    name: string;
};

export type OrderPrice = {
    fare:         number;
    tax:          number;
    total:        number;
    currency:     string;
    ticketingFee: number;
};

export type PaidDeposit = {
    priceFormat: string;
    price:       number;
};
export type PassengerInfo = {
    [passenger: string]: PassengerDetails;
};
export type Passenger = {
    passengerType:                string;
    personalInfo:                 PersonalInfoDetails;
    passengerId:                  string;
    contactInfo:                  ContactInfo;
    relatedPassengerId:           string;
    ckiStatus:                    unknown;
    optionalInformation:          unknown[];
    residenceAccreditationStatus: unknown;
    resiberPassengerId:           string;
    securityInformation:          SecurityInformation;
    externalPersonalInfo:         ExternalPersonalInfo;
    frequentFlyerInfo?:           FrequentFlyer;
};

export type FrequentFlyer ={
    number:  string;
    company: string;
};

export type ContactInfo = {
    phone:                  string;
    phoneDetails:           PhoneDetails;
    email:                  string;
    phoneType:              string;
    confirmationMailOption: unknown;
    refundEmail:            unknown;
    language:               string;
};
export type PhoneDetails = {
    number:      string;
    countryCode: string;
};

export type ExternalPersonalInfo = {
    name:         string;
    firstSurname: string;
    lastSurname:  string;
    title?: string;
};

export type PersonalInfoDetails = {
    name:        string;
    surname:     string;
    birthDate:   unknown;
    lastSurname?: string;
};

export type SecurityInformation = {
    relatedContent: RelatedContent;
};

export type PassengerDetails = {
    type:             string;
    name:             string;
    surname:          string;
    lastSurname?:     string;
    loyaltyCard:      string;
    specialNeedFound: boolean;
    specialNeeds:     SpecialNeed[];
};

export type SpecialNeed = {
    departureCity:   Destination;
    arrivalCity:     Destination;
    specialNeeds:    any[];
    showSpecialNeed: boolean;
};

export type PassengerPrices = {
    [passengerType: string]: PassengerPrice;
};

export type PassengerPrice = {
    fare:               number;
    formattedFare:      string;
    formattedInTax:     string;
    breakdownTaxes:     BreakdownTax[];
    tax:                number;
    numberOfPassengers: number;
    totalTax:           number;
    formattedTotalTax:  string;
};

export type BreakdownTax = {
    code:        string;
    amount:      string;
    currency:    string;
    description: string;
    subcode:     string;
    country:     string;
    carrier:     null;
};

export type Price = {
    original:     number;
    formatted:    string;
    perPassenger: string;
};

export type PrimaryContactInfo = {
    email: string;
    phone: string;
};

export type RelatedContent = {
    [relatedContent: string]: Warnings;
};

export type Warnings = {
    [warning:string]:WarningDetails;
};
export type WarningDetails = {
    code?:string;
    description:string;
};

export type CalculatedPoints = {
    Avios:number;
    Elite:number;
    resident:boolean;
};
export type Counter = {
    days?:string;
    hours:string;
    minutes:string;
    seconds:string;
};
export type VoucherDiscount  = DiscountItem & {
    amount: number;
    formattedAmount: string;
    priceWithDiscount: number
    type: string;
    voucherId?: number;
};
