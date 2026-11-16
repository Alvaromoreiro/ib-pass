export interface ItineraryResponseDTO {
    offers:                        Offer[];
    originDestinations:            ItineraryResponseDTOOriginDestination[];
    passengers:                    Passenger[];
    responseId:                    string;
    fareFamilyConditions:          FareFamilyCondition[];
    contextMetadata:               ContextMetadata;
    uniqueProductSuproductPairs:   any[];
    relatedContent:                RelatedContent[];
    specialDiscountsPossibilities: null;
    brandedFares:                  any[];
    freeBaggageAllowances:         any[];
    warnings:                      null;
    flightRatio:                   string;
    petFlight?:                     boolean;
}

export interface ContextMetadata {
    language:   string;
    country:    string;
    currencies: Currency[];
}


export interface Currency {
    code:               string;
    description:        string;
    symbol:             string;
    alignment:          'R'|'L';
    groupingSeparator:  string;
    decimalSeparator:   string;
    decimals:           number;
    recommendedDisplay: string;
}


export type CabinType = 'E'|'B'|'N';
export interface FareFamilyCondition {
    cabinType:          CabinType;
    cabinDescription:   string;
    commercialCode:     string;
    commercialName:     string;
    commercialNameES:   string;
    priority:           number;
    conditions:         Condition[];
    observations:       Observation[];
    conditionsPriority: string[];
}


export interface Condition {
    code:         string;
    name:         string;
    text:         string;
    units:        number | null;
    extendedInfo: ExtendedInfo;
}

export interface ExtendedInfo {
    title:           string;
    message:         string;
    code:            string;
    conditionStatus: boolean;
    observationCode: null | string;
    mobileMessage:   string;
}

export interface Observation {
    observationCode: number;
    observationText: string;
}

export interface Offer {
    offerId:                    string;
    offerItems:                 OfferItem[];
    originDestinations:         OfferOriginDestination[];
    timeLimits:                 Date;
    paymentTimeLimit:           null;
    specialDiscountsApplied:    any[];
    providerOfferId:            string;
    privateFare:                boolean;
    offerType:                  string;
    flightModificationOnDemand: boolean;
    discountsApplied:           null;
    excludePenalties:           boolean;
    offerHash:                  string;
    itineraryHash:              string;
    product:                    string;
    price:                      Price;
    priceGuaranteeTimeLimit:    null;
}

export interface OfferItem {
    offerItemId:            string;
    price:                  Price;
    passengerIds:           string[];
    privateFareInformation: null;
    reshopDifferential:     null;
    surcharges:             null;
    fareComponents:         any[];
    detailedTaxes:          null;
    fareCalculation:        null;
}

export interface Price {
    fare:         number;
    tax:          number;
    total:        number;
    currency:     string;
    ticketingFee: number;
}

export interface OfferOriginDestination {
    priceDiscountApplied: boolean;
    totalPrice:           Price;
    adultPrice:           Price;
    perPassengerPrice:    Price;
    originDestinationId:  string;
    applicableSlices:     ApplicableSlice[];
}

export interface ApplicableSlice {
    sliceId:        string;
    remainingSeats: number;
    segments:       ApplicableSliceSegment[];
}


export type BookingClass = 'BUSINESS' | 'ECONOMY' | 'PREMIUMTOURIST';
export interface ApplicableSliceSegment {
    segmentId:                   string;
    fareFamily:                  string;
    bookingCode:                 null;
    bookingClass:                BookingClass;
    rbd:                         string;
    remainingSeats:              number;
    fareBasis:                   string;
    extendedFareCode:            string;
    brandCode:                   null;
    checkedBaggageAllowanceKeys: any[];
    carryOnBaggageAllowanceKeys: any[];
    ticketDesignator:            null;
    seatDisplays:                null;
    cabinDescription:            string;
}


export interface ItineraryResponseDTOOriginDestination {
    originDestinationId:          string;
    origin:                       string;
    destination:                  string;
    originCity:                   City;
    destinationCity:              City;
    slices:                       Slice[];
    originDestinationKey:         null;
    providerOriginDestinationKey: null;
}


export interface City {
    code:        string;
    description: string;
    countryCode: string;
    country:     Country;
}

export interface Country {
    code:        string;
    description: string;
}

export interface Slice {
    sliceId:           string;
    arrivalDateTime:   string;
    departureDateTime: string;
    segments:          SliceSegment[];
    duration:          number;
    cashAvios:         boolean;
    flightOfTheHouse:  boolean;
    overnight:         boolean;
    providerSliceId:   null;
    stopsNumber:       number;
}

export interface SliceSegment {
    segmentId:         string;
    departureDateTime: string;
    arrivalDateTime:   string;
    departure:         Arrival;
    arrival:           Arrival;
    flight:            Flight;
    overnight:         boolean;
    waitingTime:       number;
    duration:          number;
    delayInformation:  null;
    stop:              null;
    warnings?:         string[];
}

export interface Arrival {
    code:     string;
    name:     string;
    terminal: string;
    city:     City;
}




export interface Flight {
    marketingCarrier:        Carrier;
    operationalCarrier:      Carrier;
    marketingFlightNumber:   string;
    operationalFlightNumber: null | string;
    operationalDisclosure:   string;
    aircraft:                string;
}

export interface Carrier {
    code: string;
    name: string;
}




export interface Passenger {
    passengerId:              string;
    passengerType:            string;
    firstName:                null;
    surname:                  null;
    frequentFlyerInfo:        null;
    isShowedResponseNameInfo: null;
    isValidated:              boolean;
}

export interface RelatedContent {
    key:   string;
    value: string;
}
