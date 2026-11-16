namespace CalculateAviosAncillariesResponse {
  export type AviosAncillariesResponse = {
    currency: BookingCabinClass;
    flight: Flight;
    passengers: Passenger[];
    totalMonetaryAmount: TotalMonetaryAmountElement[];
  };

  export type BookingCabinClass = {
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
    segments: PurpleSegment[];
  };

  export type PurpleSegment = {
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
    bookingSummary: BookingSummary;
    ancillaries: Ancillary[];
  };

  export type Ancillary = {
    type: string;
    subType: string;
    slices: AncillarySlice[];
    monetaryAmount: MonetaryAmount[];
  };

  export type MonetaryAmount = {
    amount: number;
    breakDownType: string;
    currency: MonetaryAmountCurrency;
  };

  export type MonetaryAmountCurrency = {
    currencyCode: string;
  };

  export type AncillarySlice = {
    id: string;
    amounts: Amount[];
    segments: FluffySegment[];
    monetaryAmount: TotalMonetaryAmountElement[];
  };

  export type Amount = {
    fare: string;
    quantity: string;
  };

  export type TotalMonetaryAmountElement = {
    amount: string;
    breakDownType: string;
    currency: MonetaryAmountCurrency;
  };

  export type FluffySegment = {
    id: string;
    amounts: Amount[];
  };

  export type BookingSummary = {
    bookingDate: string;
    ticketIssuanceDate: string;
  };
}
