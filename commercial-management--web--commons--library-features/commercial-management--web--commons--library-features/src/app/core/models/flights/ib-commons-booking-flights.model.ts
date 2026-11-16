export type FlightCabin = {
  code: string;
  description: string;
  cabinClass: string;
};

export type FlightOption = {
  description: string;
  code: number;
};

export type FlightCity = {
  code: string;
  description: string;
  country: string;
};

export type FlightPassengersSelected = {
  passengerType: string;
  minPassenger: number;
  maxPassengers: number;
  infoAge: string;
  count: number;
  isActive?: boolean;
  isHidden?: boolean;
  showMessage?: boolean;
};

export type FlightDiscount = {
  description: string;
  value: string;
};

export type FlightPassengersNumber = {
  numberPassengers: number;
  numAdults: number;
  numSeniors: number;
  numYouth: number;
  numTeenager: number;
  numChilds: number;
  numInfants: number;
};

export type BookingFlightSearchInformation = {
  payWithAvios: boolean;
  payWithPoints: boolean;
  aviosChecked?: boolean;
  selectedOutbondDate?: Date;
  selectedReturnDate?: Date;
  cabinSelected: FlightCabin;
  tripOptionSelected?: FlightOption;
  cityOrigin: FlightCity;
  cityDestiny: FlightCity;
  passengersSelected: FlightPassengersSelected[];
  discountResident: FlightDiscount;
  discountFamily: FlightDiscount;
  flexDates?: boolean;
  passengers: FlightPassengersNumber;
  flashOffer?: boolean;
  flashOfferId?: string;
};
