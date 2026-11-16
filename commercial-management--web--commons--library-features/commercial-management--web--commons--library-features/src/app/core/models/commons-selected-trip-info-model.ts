namespace CommonsSelectedTripInfoModel {
  export interface SelectedTripInfoModel {
    selectedSliceIndex: number;
    selectedSlicesLength: number;
    cabin: string;
    originDestinationId: string;
    origin: string;
    destination: string;
    info: Info;
    articleOffset: number;
    transformOffset: number;
    heightHeadingFlight: number;
    available: boolean;
    originCountry: string;
    destinationCountry: string;
  }

  export interface Info {
    sliceId: string;
    arrivalDateTime: string;
    departureDateTime: string;
    segments: InfoSegment[];
    duration: number;
    cashAvios: boolean;
    flightOfTheHouse: boolean;
    overnight: boolean;
    stopsNumber: number;
    bestPrice: boolean;
    cabins: Cabins;
    cabinsLength: number;
    showFares: boolean;
    slicePrice: number;
    sliceCurrency: Currency;
    durationParsed: string;
    departureDateTimeParsed: string;
    departureDateParsed: DepartureDateParsed;
    arrivalDateTimeParsed: string;
    daysOfTravel: number;
    allOperatedBy: string[];
    technicalStop: number;
    sliceURL: string;
    maxSlicePrice: number;
    showedCabin: string;
    selectedCabin: string;
    selectedFareFamily: FareFamily;
  }

  export interface Cabins {
    E: B;
    B: B;
  }

  export interface B {
    bestPrice: number;
    bestPriceDisscount: null;
    bestPriceDisscountShown: null;
    bestPriceShown: string;
    cabinDescription: string;
    cabinAvailable: boolean;
    isCabinCompatible: boolean;
    fareFamilies: FareFamily[];
    bestCabinsPrice: boolean;
  }

  export interface FareFamily {
    cabinType: string;
    cabinDescription: string;
    commercialCode: string;
    commercialName: string;
    commercialNameES: string;
    priority: number;
    conditions: Condition[];
    observations: Observation[];
    conditionsPriority: string[];
    isCompatibleFare: boolean;
    farePrice: number;
    fareDisscountPriceToCalculate: null;
    farePriceToCalculate: number;
    farePriceShown: string;
    fareDisscountPriceShown: null;
    fareCurrency: Currency;
    remainingSeats: number;
    offers: Offer[];
    oBdiscount: boolean;
    index?: number;
  }

  export interface Condition {
    code: string;
    name: string;
    text: string;
    units: number | null;
    extendedInfo: ExtendedInfo;
    key: number;
    previewStatus: boolean;
  }

  export interface ExtendedInfo {
    title: string;
    message: string;
    code: string;
    conditionStatus: boolean;
    observationCode: null | string;
  }

  export enum Currency {
    Eur = "EUR",
  }

  export interface Observation {
    observationCode: number;
    observationText: ObservationText;
  }

  export interface ObservationText {}

  export interface Offer {
    offerId: string;
    offerItems: OfferItem[];
    originDestinations: OriginDestination[];
    timeLimits: Date;
    paymentTimeLimit: null;
    specialDiscountsApplied: any[];
    providerOfferId: string;
    privateFare: boolean;
    offerType: string;
    flightModificationOnDemand: boolean;
    discountsApplied: null;
    excludePenalties: boolean;
    price: Price;
  }

  export interface OfferItem {
    offerItemId: string;
    price: Price;
    passengerIds: string[];
    privateFareInformation: null;
  }

  export interface Price {
    fare: number;
    tax: number;
    total: number;
    currency: Currency;
    ticketingFee: number;
  }

  export interface OriginDestination {
    priceDiscountApplied: boolean;
    totalPrice: Price;
    adultPrice: Price;
    perPassengerPrice: Price;
    originDestinationId: string;
    applicableSlices: ApplicableSlice[];
  }

  export interface ApplicableSlice {
    sliceId: string;
    remainingSeats: number;
    segments: ApplicableSliceSegment[];
  }

  export interface ApplicableSliceSegment {
    segmentId: string;
    fareFamily: string;
    bookingCode: null;
    bookingClass: BookingClass;
    rbd: Rbd;
    remainingSeats: number;
    fareBasis: string;
    extendedFareCode: string;
    brandCode: null;
    checkedBaggageAllowanceKeys: any[];
    carryOnBaggageAllowanceKeys: any[];
    seatDisplays: null;
    cabinDescription: string;
  }

  export enum BookingClass {
    Business = "BUSINESS",
    Economy = "ECONOMY",
  }

  export enum Rbd {
    D = "D",
    I = "I",
    O = "O",
  }

  export interface DepartureDateParsed {
    dateTime: string;
    weekDay: string;
    hour: number;
    minutes: number;
    day: number;
    monthNumber: number;
    month: string;
    year: number;
    formatedDate: string;
  }

  export interface InfoSegment {
    segmentId: string;
    departureDateTime: string;
    arrivalDateTime: string;
    departure: Arrival;
    arrival: Arrival;
    flight: Flight;
    overnight: boolean;
    waitingTime: number;
    duration: number;
    delayInformation: null;
    stop: null;
    durationParsed: string;
    isMoreThan2h: boolean;
    waitingTimeParsed: string;
    departureDateTimeParsed: string;
    departureDateParsed: DepartureDateParsed;
    arrivalDateTimeParsed: string;
    companyURL: string;
    warnings: any[];
    terminalChange: AirportChange;
    airportChange: AirportChange;
    scaleWaitingTime: AirportChange;
    nightFlight: NightFlight;
  }

  export interface AirportChange {
    show: boolean;
  }

  export interface Arrival {
    code: string;
    name: string;
    terminal: string;
    city: City;
  }

  export interface City {
    code: string;
    description: string;
    countryCode: string;
    country: Aircraft;
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

  export interface NightFlight {
    isOverNight: boolean;
  }
}
