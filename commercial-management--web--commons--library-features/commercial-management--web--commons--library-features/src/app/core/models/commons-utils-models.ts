namespace CommonsUtilsModels {
  export type FareDataModel = {
    offers: OffersFareDataModel[];
  };

  export type OffersFareDataModel = {
    onHoldOptions: OnHoldOptions[];
  };
  export type OnHoldOptions = {
    onHoldOptionId: string;
    hours: number;
    securityMargin: number;
    timeLimits: string;
    referenceTimeLimit: string;
    referenceCity: ReferenceCity;
    price: Price;
    transformedTimeDateLimit: TransformedTimeDateLimit;
    onHoldPricePerPassenger: number;
  };
  export type ReferenceCity = {
    code: string;
    description: string;
    countryCode: string;
  };
  export type Price = {
    fare: number;
    tax: number;
    total: number;
    currency: string;
    ticketingFee: number;
  };
  export type TransformedTimeDateLimit = {
    dateTime: string;
    weekDay: string;
    hour: number;
    minutes: number;
    day: number;
    monthNumber: number;
    month: string;
    year: number;
    formatedDate: string;
  };
}
