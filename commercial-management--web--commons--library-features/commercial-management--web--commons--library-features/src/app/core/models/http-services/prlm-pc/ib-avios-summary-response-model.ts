namespace AviosSummaryResponseHttpModels {
  export type AviosSummaryResponse = {
    currency: BookingCabinClass;
    flight: Flight;
    passengers: Passenger[];
    totalMonetaryAmount: MonetaryAmount[];
  };

  export type BookingCabinClass = {
    code: string;
  };

  export type Flight = {
    yq: number;
    discounts: Discount[];
    slices: Slice[];
  };

  export type Discount = {
    type: string;
    percentDiscount: number;
    totalDiscount: number;
  };

  export type Slice = {
    id: string;
    segments: Segment[];
  };

  export type Segment = {
    id: string;
    operatingCarrier: BookingCabinClass;
    marketingCarrier: BookingCabinClass;
    ticketingCarrier: BookingCabinClass;
    schedule: Schedule;
    bookingClass: BookingCabinClass;
    bookingCabin: BookingCabinClass;
  };

  export type Schedule = {
    departureAirportCode: string;
    arrivalAirportCode: string;
    departureDate: string;
  };

  export type Passenger = {
    id: string;
    memberIdentifier: string;
    scheme: Scheme;
    bookingSummary: BookingSummary;
    flight: PassengerFlight;
    ancillaries?: Ancillary[];
  };

  export type Ancillary = {
    type: string;
    subType?: string;
    slices: AncillarySlice[];
    monetaryAmount: MonetaryAmount[];
  };

  export type MonetaryAmount = {
    amount: number;
    breakDownType: string;
    currency: TotalMonetaryAmountCurrency;
  };

  export type TotalMonetaryAmountCurrency = {
    currencyCode: string;
  };

  export type AncillarySlice = {
    id: string;
    amounts: Amount[];
    segments: AnciSegment[];
    monetaryAmount: MonetaryAmount[];
  };

  export type Amount = {
    fare: number;
    quantity: number;
  };

  export type AnciSegment = {
    id: string;
    amounts: Amount[];
  };

  export type BookingSummary = {
    bookingDate: string;
    ticketIssuanceDate: string;
  };

  export type PassengerFlight = {
    slices: passengerSlice[];
    monetaryAmount: MonetaryAmount[];
  };

  export type passengerSlice = {
    id: string;
    fare: number;
    totalFare: number;
    ticketNum: string;
    segments: passengerSliceSegment[];
    monetaryAmount: MonetaryAmount[];
  };

  export type passengerSliceSegment = {
    id: string;
    couponNumber: string;
  };

  export type Scheme = {
    schemeIdentifier: Identifier;
    recognitionLevel: RecognitionLevel;
  };

  export type RecognitionLevel = {
    recognitionLevelIdentifier: Identifier;
  };

  export type Identifier = {
    identifier: string;
  };
}
