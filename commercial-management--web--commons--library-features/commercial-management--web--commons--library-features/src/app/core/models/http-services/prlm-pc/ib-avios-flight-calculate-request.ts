namespace CalculateFlightAvios {
  export type calculateFlightAvios = {
    currency: Currency;
    discounts: Discount;
    passengers: Passenger[];
    flight: Flight;
  };

  export type Currency = {
    code: string;
  };

  export type Flight = {
    yq: number;
    slices: Slice[];
  };

  export type Discount = {
    type?: string;
    percentDiscount?: number;
    totalDiscount?: number;
  };

  export type Slice = {
    id: string;
    segments: Segment[];
  };

  export type Segment = {
    id: string;
    operatingCarrier: Currency;
    marketingCarrier: Currency;
    schedule: Schedule;
    bookingClass: Currency;
    bookingCabin: Currency;
  };

  export type Schedule = {
    departureAirportCode: string;
    arrivalAirportCode: string;
    departureDate: Date;
  };

  export type Passenger = {
    id: string;
    memberIdentifier: string;
    flight: PassengerFlight;
  };

  export type PassengerFlight = {
    slices: PassengerFlightSlice[];
  };

  export type PassengerFlightSlice = {
    id: string;
    fare: number;
    totalFare: number;
  };
}
