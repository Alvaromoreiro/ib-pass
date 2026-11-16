namespace IbCheckBonusModel {
  export type Campaign = {
    id: string;
    commercialCode: string;
  };

  export type Currency = {
    code: string;
    description: string;
    symbol: string;
    alignment: string;
    groupingSeparator: string;
    decimalSeparator: string;
    recommendedDisplay: string;
    decimals: number;
  };

  export type ExpiryDate = {
    from: string;
    to: string;
  };

  export type Company = {
    code: string;
    description: string;
  };

  export type Allowed = {
    from: string;
    to: string;
  };

  export type Departure = {
    allowed: Allowed;
  };

  export type Allowed2 = {
    from: string;
    to: string;
  };

  export type Arrival = {
    allowed: Allowed2;
  };

  export type Journey = {
    companies: Company[];
    allowedOperatorsNotSelected: boolean;
    departure: Departure;
    arrival: Arrival;
    sundayRule: boolean;
  };

  export type BonusResponse = {
    campaign: Campaign;
    id: string;
    commercialCode: string;
    type: string;
    amount: number;
    remaining: number;
    currency: Currency;
    percentage: boolean;
    maxUsages: number;
    expiryDate: ExpiryDate;
    redemptionForBooking: boolean;
    bookingReferences: reference[];
    journey: Journey;
    hashedEmail: string;
    status: string;
  };
  export type reference = {
    reference: string;
    date: string;
    amount: number;
  };
  export type BonusTransformerResponse = {
    voucherId: string;
    amount: string;
    expireDate: string;
    companies: string;
    returnLimitDate: string;
    uses: string[];
    remainingUses: string;
    percentage: boolean;
    status: string;
  };
  export type CheckBonusData = {
    email: string;
    voucherId: string;
  };
}
