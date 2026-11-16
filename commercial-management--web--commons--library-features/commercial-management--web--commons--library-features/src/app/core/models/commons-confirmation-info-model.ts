namespace CommonsConfirmationInfoModel {
  export interface ConfirmationInfoModel {
    confirmationInfo: ConfirmationInfo;
  }

  export interface ConfirmationInfo {
    pnr: string;
    contactEmail: string;
    endOrderTime: null;
    referenceCity: string;
    onHoldPayment: null;
    slices: Slice[];
    relatedContent: RelatedContent;
    warningMessages: any[];
    summaryInfo: SummaryInfo;
    showSuccesfulCardAlert: null;
    residentInfo: ResidentInfo;
    familyInfo: FamilyInfo;
    bondsInfo: BondsInfo;
    price: Price;
    rentCarInfo: RentCarInfo;
    bookingHotelsInfo: BookingHotelsInfo;
    bobInfo: BobInfo;
  }

  export interface BobInfo {
    urlbob: string;
  }

  export interface BondsInfo {
    vouchersInfo: any[];
    showExtraInfo: boolean;
    total: RelatedContent;
  }

  export interface RelatedContent {}

  export interface BookingHotelsInfo {
    checkInDate: Date;
    checkOutDate: Date;
    destinationCode: string;
  }

  export interface FamilyInfo {
    isActive: boolean;
  }

  export interface Price {
    totalPrice: number;
    formattedTotalPrice: string;
    textTotalPrice: string;
    showTotalPrice: boolean;
  }

  export interface RentCarInfo {
    cars: Car[];
    pickUpCity: string;
  }

  export interface Car {
    provider: string;
    description: string;
    redirectUrl: string;
    pictureURI: null;
    priceDay: string;
    priceValue: number;
  }

  export interface ResidentInfo {
    isActive: boolean;
    errors: Errors;
    city: string;
    passengers: any[];
  }

  export interface Errors {
    haveSomeError: boolean;
    allHaveError: boolean;
  }

  export interface Slice {
    idTrip: string;
    baggage: SliceBaggage;
    segments: SliceSegment[];
  }

  export interface SliceBaggage {
    handBaggage: number;
    franchiseBaggage: number;
  }

  export interface SliceSegment {
    idSegment: string;
    departure: Arrival;
    departureDate: ArrivalDateClass;
    arrival: Arrival;
    arrivalDate: ArrivalDateClass;
    flightNumber: string;
    operationalDisclosure: string;
    companyCode: string;
    operatedBy: string;
    cabin: string;
    companyUrl: string;
    seats: string;
    marketingCarrier: MarketingCarrier;
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
    country: Destination;
  }

  export interface Destination {
    code: string;
    description: string;
  }

  export interface ArrivalDateClass {
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

  export interface MarketingCarrier {
    code: string;
    name: string;
  }

  export interface SummaryInfo {
    trips: Trip[];
    passengers: Passengers;
    orderFees: any[];
    appliedDiscounts: AppliedDiscounts;
    paymentType: string;
    onHoldPayment: null;
    ancillaries: Ancillaries;
  }

  export interface Ancillaries {
    baggages: Baggages;
    speqs: Baggages;
    seats: Seats;
    insurance: null;
    flexibility: Flexibility;
    upgrading: null;
    upgradingBids: null;
    currency: Currency;
    total: null;
    totalFormatted: string;
    discount: null;
    priority: Baggages;
  }

  export interface Baggages {
    segments: BaggagesSegment[];
    totalFormatted: null | string;
    updated: boolean;
  }

  export interface BaggagesSegment {
    sliceId: string;
    baggages?: BaggageElement[];
    origin: Destination;
    destination: Destination;
    total: number;
    totalFormatted: string;
    speqs?: Speq[];
  }

  export interface BaggageElement {
    passengers: string[];
    type: Type;
    quanty: number;
    total: number;
    totalFormatted: string;
  }

  export interface Type {
    subtype: string;
    description: string;
  }

  export interface Speq {
    type: string;
    quanty: number;
    description: string;
    total: number;
    totalFormatted: string;
    passengers: string[];
  }

  export interface Currency {
    suffixSymbol: boolean;
    decimalSeparator: string;
    numberDecimals: number;
    groupingSeparator: string;
    currencySymbol: string;
    description: string;
  }

  export interface Flexibility {
    info: null;
    totalFormatted: string;
    total: number;
    title: string;
    amount: Amount;
    currency: Currency;
    items: Item[];
    hasFlexibilization: boolean;
    updated: boolean;
    showFlexibility: boolean;
  }

  export interface Amount {
    title: string;
  }

  export interface Item {
    concepts: Concept[];
  }

  export interface Concept {
    quantity: number;
    description: string;
    price: number;
    priceFormatted: string;
  }

  export interface Seats {
    segments: any[];
    totalFormatted: null;
  }

  export interface AppliedDiscounts {
    discount: Discount[];
  }

  export interface Discount {
    type: string;
    discount: string;
  }

  export interface Passengers {
    personalData: PersonalDatum[];
    generalData: GeneralData;
    totalPassengersFormatted: string;
  }

  export interface GeneralData {
    ADULT: Adult[];
  }

  export interface Adult {
    number: number;
    fareCash: number;
    totalTax: number;
    currency: Currency;
    breakdownTaxes: BreakdownTax[];
    parsedFareCash: string;
    parsedTotalTax: string;
  }

  export interface BreakdownTax {
    code: string;
    amount: string;
    currency: string;
    description: string;
    subcode: null;
    country: null;
    carrier: null;
  }

  export interface PersonalDatum {
    name: string;
    surname: string;
    specialNeeds: any[];
  }

  export interface Trip {
    idTrip: string;
    stopsNumber: number;
    fare: Fare[];
    segments: TripSegment[];
  }

  export interface Fare {
    fareDetails: { [key: string]: FareDetail };
    name: string;
    cabin: string;
  }

  export interface FareDetail {
    name: string;
    message: string;
  }

  export interface TripSegment {
    idSegment: string;
    departure: Arrival;
    departureDate: ArrivalDateClass;
    arrival: Arrival;
    arrivalDate: ArrivalDateClass;
    flightNumber: string;
    operatedBy: string;
    aircraftType: string;
    duration: string;
    waitingTime: number;
    waitingParsedTime: string;
    cabin: string;
    operationalDisclosure: string;
    marketingCarrier: MarketingCarrier;
  }
}
