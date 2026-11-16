export type SliceSelected = {
    articleOffset: number;
    available: boolean;
    cabin: string;
    destination: string;
    destinationCountry: string;
    heightHeadingFlight: number;
    indexArray?: number;
    info: SliceSelectedInfo;
    origin: string;
    originCountry: string;
    originDestinationId: string;
    selectedSliceIndex: number;
    selectedSlicesLength: number;
    transformOffset: number;
};
export type SliceSelectedInfo = {
    sliceId:                 string;
    arrivalDateTime:         string;
    departureDateTime:       string;
    segments:                SliceSelectedInfoSegment[];
    duration:                number;
    cashAvios:               boolean;
    flightOfTheHouse:        boolean;
    overnight:               boolean;
    providerSliceId:         null;
    stopsNumber:             number;
    bestPrice:               boolean;
    cabins:                  Cabins;
    cabinsLength:            number;
    showFares:               boolean;
    slicePrice:              number;
    slicePriceShown:         string;
    sliceCurrency:           string;
    durationParsed:          string;
    departureDateTimeParsed: string;
    departureDateParsed:     DepartureDateParsed;
    arrivalDateTimeParsed:   string;
    daysOfTravel:            number;
    allOperatedBy:           string[];
    technicalStop:           number;
    sliceURL:                string;
    maxSlicePrice:           number;
    showedCabin:             string;
    selectedCabin:           string;
    selectedFareFamily:      SelectedFareFamilyElement;
};

export type Cabins = {
    E?: SliceSelectedCabin;
    N?: SliceSelectedCabin;
    B?: SliceSelectedCabin;
    T?: SliceSelectedCabin;
    anyCabin?: SliceSelectedCabin;
};

export type SliceSelectedCabin = {
    bestPrice:                    number;
    bestPriceDisscount:           null;
    expensivePrice:               number;
    expensivePriceDisscount:      number;
    expensivePriceDisscountShown: null;
    bestPriceDisscountShown:      null;
    bestPriceShown:               string;
    expensivePriceShown:          string;
    cabinDescription:             string;
    cabinAvailable:               boolean;
    isCabinCompatible:            boolean;
    fareFamilies:                 FareFamily[];
    bestCabinsPrice:              boolean;
};

export type FareFamily = {
    cabinType:                     string;
    cabinDescription:              string;
    commercialCode:                string;
    commercialName:                string;
    commercialNameES:              string;
    priority:                      number;
    conditions:                    FareFamilyCondition[];
    observations:                  any[];
    conditionsPriority:            string[];
    isCompatibleFare:              boolean;
    farePrice:                     number;
    fareDisscountPriceToCalculate: number;
    farePriceToCalculate:          number;
    farePriceShown:                string;
    fareOutTax:                    number;
    fareDisscountPriceShown:       null;
    fareCurrency:                  string;
    remainingSeats:                number;
    offers:                        Offer[];
    oBdiscount:                    boolean;
    includedPriceDiscount:         boolean;
    index?:                        number;
    sliceIndex?:                   number;
};

export type FareFamilyCondition = {
    code:          string;
    name:          string;
    text:          string;
    units:         number | null;
    extendedInfo:  ExtendedInfo;
    key:           number;
    previewStatus: boolean;
};

export type ExtendedInfo = {
    title:           string;
    message:         string;
    code:            string;
    conditionStatus: boolean;
    observationCode: null | string;
    mobileMessage:   string;
};


export type Offer = {
    offerId:                    string;
    offerItems:                 OfferItem[];
    originDestinations:         OriginDestination[];
    timeLimits:                 string;
    paymentTimeLimit:           null;
    specialDiscountsApplied:    any[];
    providerOfferId:            string;
    privateFare:                boolean;
    offerType:                  string;
    flightModificationOnDemand: boolean;
    discountsApplied:           null;
    excludePenalties:           boolean;
    price:                      Price;
};

export type OfferItem = {
    offerItemId:            string;
    price:                  Price;
    passengerIds:           string[];
    privateFareInformation: null;
    reshopDifferential:     null;
    surcharges:             null;
};

export type Price = {
    fare:         number;
    tax:          number;
    total:        number;
    currency:     string;
    ticketingFee: number;
};

export type OriginDestination = {
    priceDiscountApplied: boolean;
    totalPrice:           Price;
    adultPrice:           Price;
    perPassengerPrice:    Price;
    originDestinationId:  string;
    applicableSlices:     ApplicableSlice[];
};

export type ApplicableSlice = {
    sliceId:        string;
    remainingSeats: number;
    segments:       ApplicableSliceSegment[];
};

export type ApplicableSliceSegment = {
    segmentId:                   string;
    fareFamily:                  string;
    bookingCode:                 null;
    bookingClass:                string;
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
};

export type E = {
    bestPrice:                    number;
    bestPriceDisscount:           null;
    expensivePrice:               number;
    expensivePriceDisscount:      number;
    expensivePriceDisscountShown: null;
    bestPriceDisscountShown:      null;
    bestPriceShown:               string;
    expensivePriceShown:          string;
    cabinDescription:             string;
    cabinAvailable:               boolean;
    isCabinCompatible:            boolean;
    fareFamilies:                 SelectedFareFamilyElement[];
    bestCabinsPrice:              boolean;
};

export type SelectedFareFamilyElement = {
    cabinType:                     string;
    cabinDescription:              string;
    commercialCode:                string;
    commercialName:                string;
    commercialNameES:              string;
    priority:                      number;
    conditions:                    SelectedFareFamilyCondition[];
    observations:                  Observation[];
    conditionsPriority:            string[];
    isCompatibleFare:              boolean;
    farePrice:                     number;
    fareDisscountPriceToCalculate: number;
    farePriceToCalculate:          number;
    farePriceShown:                string;
    fareOutTax:                    number;
    fareDisscountPriceShown:       null;
    fareCurrency:                  string;
    remainingSeats:                number;
    offers:                        Offer[];
    oBdiscount:                    boolean;
    includedPriceDiscount:         boolean;
    index?:                        number;
    sliceIndex?:                   number;
};

export type SelectedFareFamilyCondition = {
    code:          string;
    name:          string;
    text:          string;
    units:         number | null;
    extendedInfo:  ExtendedInfo;
    key:           number;
    previewStatus: boolean;
};

export type Observation = {
    observationCode: number;
    observationText: string | any;
};


export type DepartureDateParsed = {
    dateTime:     string;
    weekDay:      string;
    hour:         number;
    minutes:      number;
    day:          number;
    monthNumber:  number;
    month:        string;
    year:         number;
    formatedDate: string;
};

export type SliceSelectedInfoSegment = {
    segmentId:               string;
    departureDateTime:       string;
    arrivalDateTime:         string;
    departure:               Arrival;
    arrival:                 Arrival;
    flight:                  Flight;
    overnight:               boolean;
    waitingTime:             number;
    duration:                number;
    delayInformation:        null;
    stop:                    null;
    durationParsed:          string;
    isMoreThan2h:            boolean;
    waitingTimeParsed:       string;
    departureDateTimeParsed: string;
    departureDateParsed:     DepartureDateParsed;
    arrivalDateTimeParsed:   string;
    companyURL:              string;
    warnings:                any[];
    terminalChange:          AirportChange;
    airportChange:           AirportChange;
    scaleWaitingTime:        AirportChange;
    nightFlight:             NightFlight;
};

export type AirportChange = {
    isImportant: boolean;
    code:        string;
    message:     string;
    show:        boolean;
};

export type Arrival = {
    code:     string;
    name:     string;
    terminal: string;
    city:     City;
};

export type City = {
    code:        string;
    description: string;
    countryCode: string;
    country:     Aircraft;
};

export type Aircraft = {
    code:        string;
    description: string;
};

export type Flight = {
    marketingCarrier:        Carrier;
    operationalCarrier:      Carrier;
    marketingFlightNumber:   string;
    operationalFlightNumber: string;
    operationalDisclosure:   string;
    aircraft:                Aircraft;
};

export type Carrier = {
    code: string;
    name: string;
};

export type NightFlight = {
    code:        string;
    message:     string;
    isOverNight: boolean;
};
