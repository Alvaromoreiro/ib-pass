namespace CommonsSummaryInfoModels {
  export interface CommonsSummaryInfo {
    ancillaries: AncillariesSummaryInfoModel;
    orderFees: {};
    passengers: {};
    trips: {};
  }

  export interface AncillariesSummaryInfoModel {
    baggages: Baggages;
    speqs: Baggages;
    priority: Priority;
    seats: Seats;
    insurance: Insurance;
    flexibilization?: Flexibilization;
    upgrading: null;
    upgradingBids: null;
    currency: Currency;
    total: number;
    totalFormatted: string;
    discount: null;
  }

  export interface Baggages {
    segments: BaggagesSegment[];
    totalFormatted: string;
  }

  export interface BaggagesSegment {
    sliceId: string;
    baggages?: Baggage[];
    origin: OriginDestination;
    destination: OriginDestination;
    total: number;
    totalFormatted: string;
    speqs?: Speq[];
  }

  export interface Baggage {
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

  export interface OriginDestination {
    description: string;
    code: string;
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

  export interface Insurance {
    offer: string;
    total: number;
    totalFormatted: string;
    passengers: number;
    type: string;
  }

  export interface Flexibilization {
    hasFlexibilization: boolean;
    info: {
      amount: {
        price: number;
      };
    };
  }

  export interface Priority {
    segments: PrioritySegment[];
    totalFormatted: string;
  }

  export interface PrioritySegment {
    sliceId: string;
    quanty: number;
    amount: number;
    totalFormatted: string;
    origin: OriginDestination;
    destination: OriginDestination;
  }
  export interface Seats {
    segments: SeatsSegment[];
    totalFormatted: string;
  }

  export interface SeatsSegment {
    segmentId: string;
    seats: Seat[];
    origin: OriginDestination;
    destination: OriginDestination;
    total: number;
    totalFormatted: string;
  }

  export interface Seat {
    type: string;
    description: string;
    quanty: number;
    passengers: Passenger[];
    amount: number;
    totalFormatted: string;
  }

  export interface Passenger {
    id: string;
    amount: number;
  }
}
