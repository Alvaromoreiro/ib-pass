namespace IbUnifyBonusModel {
  export type UnifyBonusData = {
    bonusCode2: string;
    bonusCode1: string;
    email: string;
  };
  export type InputData = {
    id: string;
    focused: boolean;
    index: number;
    name: string;
    value: string;
  };
  export type UnifyDataService = {
    email: string;
    voucherIds: string[];
  };
  export type BonusTransformerResponse = {
    newVoucher: {
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
    voucherToMerge: VoucherIdsToMerge[];
  };
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

  export type Arrival = {
    allowed: Allowed;
  };

  export type Journey = {
    companies: Company[];
    allowedOperatorsNotSelected: boolean;
    departure: Departure;
    arrival: Arrival;
    sundayRule: boolean;
  };

  export type NewVoucherId = {
    campaign: Campaign;
    id?: any;
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
  export type VoucherIdsToMerge = {
    voucherId: string;
    expiryDate: string;
    amount: number;
    total: string;
  };

  export type BonusResponse = {
    newVoucherId: NewVoucherId;
    voucherIdsToMerge: VoucherIdsToMerge[];
  };
}
