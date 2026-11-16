namespace IbPlusMyBonusModel {
  export type Pattern = {
    emailLength: number;
    emailPattern: string;
    codeLength: number;
    codePattern: RegExp;
  };

  export type TransformData = {
    voucherId: string;
    amount: string;
    expireDate: string;
    companies: string;
    returnLimitDate: string;
    uses: string[];
    remainingUses: string;
    percentage: boolean;
    status: string;
    select: boolean;
    open: boolean;
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
  export type reference = {
    reference: string;
    date: string;
    amount: number;
  };
  export type BonusData = {
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
  export type Item = {
    title: string;
    description: string;
  };

  export type Element = {
    type: string;
    description: string;
    title: string;
    subTitle: string;
    items: Item[];
  };

  export type Modal = {
    code: string;
    title: string;
    subTitle: string;
    elements: Element[];
  };

  export type GDPRResponse = {
    text: string;
    modals: Modal[];
  };
  export type GDPRTransformData = {
    title: string;
    description: string;
    open: boolean;
  };

  export type ResultResponse = {
    bonus: TransformData[];
    accordionData: GDPRTransformData[];
    email: string;
  };

  export type Address = {
    street: string;
    streetNumber: string;
    apartment: string;
  };

  export type Phone = {
    prefix: string;
    number: string;
  };

  export type ContactData = {
    additionalInfo: string;
    address: Address;
    city: string;
    countryCode: string;
    email: string;
    phone: Phone;
    postalCode: string;
    province: string;
  };
}
