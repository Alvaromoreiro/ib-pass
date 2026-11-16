namespace CalculateAviosAncillaries {
  export type AviosAncillariesRequest = {
    currency: Currency;
    flight: Flight;
    passengers: Passenger[];
  };

  export type Currency = {
    code: string;
  };

  export type Flight = {
    discounts: Discount[];
    slices: FlightSlice[];
  };

  export type Discount = {
    type: string;
    percentDiscount: number;
    totalDiscount: number;
  };

  export type FlightSlice = {
    id: string;
    segments: FlightSegment[];
  };

  export type FlightSegment = {
    id: string;
    operatingCarrier: Currency;
    marketingCarrier: Currency;
    ticketingCarrier: Currency;
    schedule: Schedule;
    bookingClass: Currency;
    bookingCabin: Currency;
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
    ancillaries: Ancillary[];
  };

  export type Ancillary = {
    code: string;
    subCode: string;
    type: string;
    slices: AncillarySlice[];
  };

  export type AncillarySlice = {
    id: string;
    amounts: Amount[];
    segments: AncillarySegment[];
  };

  export type Amount = {
    fare: number;
    quantity: number;
  };

  export type AncillarySegment = {
    id: string;
    amounts: Amount[];
  };

  export type BookingSummary = {
    bookingDate: string;
    ticketIssuanceDate: string;
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
