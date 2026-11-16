namespace AviosSummaryTransformerModels {
  export type AviosSummaryTransformer = {
    passengers: Passenger[];
  };

  export type Passenger = {
    name: string;
    firstSurname: string;
    secondSurname: string;
    id: string;
    memberIdentifier: string;
    flight: Flight;
    ancillaries: Ancillary[];
  };

  export type Ancillary = {
    type?: string;
    amount: number;
    breakDownType: string;
    currency: Currency;
  };

  export type Currency = {
    currencyCode: string;
  };

  export type Flight = {
    monetaryAmount: Ancillary[];
  };
}
