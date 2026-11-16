export interface VoluntaryRefundsModel {
  less24Hours: boolean;
  contextMetadata: ContextMetadata;
  detailedReshopDifferentials?: (DetailedReshopDifferentialsEntity)[] | null;
  offerId: string;
  order: Order;
  passengers?: (PassengersEntity)[] | null;
  reshopDifferential: ReshopDifferential;
  responseId: string;
  timeLimits: TimeLimits;
  withPayments: boolean;
  listTaxedRefundInfo: listTaxedRefundInfo[];
  listFareBasisRefundInfo: listFareBasisRefundInfo[];
  refundType: string;
}

export interface ContextMetadata {
  country: string;
  currencies?: (CurrenciesEntity)[] | null;
  language: string;
}

export interface CurrenciesEntity {
  alignment: string;
  code: string;
  decimals: number;
  decimalSeparator: string;
  description: string;
  groupingSeparator: string;
  recommendedDisplay: string;
  symbol: string;
}

export interface DetailedReshopDifferentialsEntity {
  detailedTaxes?: null;
  newOfferPrice: NewOfferPriceOrOriginalOrder;
  offerID: string;
  originalOrder: NewOfferPriceOrOriginalOrder;
  passengerID: string;
  penalty?: PriceOrPenaltyOrRefundPrice | null;
  refundPrice: PriceOrPenaltyOrRefundPrice1;
  type: string;
  orderItemId?: string | null;
  serviceType?: string | null;
  saleFareDifference: SaleFareDifference;
  saleTaxTotalDifference: SaleTaxTotalDifference;
}

export interface SaleFareDifference {
    currency: string;
    fare: number;
}

export interface SaleTaxTotalDifference {
    currency: string;
    fare: number;
}

export interface NewOfferPriceOrOriginalOrder {
  detailedTaxes?: null;
  price: PriceOrPenaltyOrRefundPrice1;
}

export interface PriceOrPenaltyOrRefundPrice1 {
  currency: string;
  fare: number;
}

export interface PriceOrPenaltyOrRefundPrice {
  currency: string;
  fare: number;
}

export interface Order {
  accountCodes?: (string)[] | null;
  apisRequired: boolean;
  bookingOffice: string;
  bookingReferences?: (BookingReferencesEntity)[] | null;
  brandedFares?: (null)[] | null;
  cancelledOrderItems?: (null)[] | null;
  carrierSpecialNeedServices?: (null)[] | null;
  carryOnBaggageAllowances?: (null)[] | null;
  checkedBagAllowances?: null;
  commissions?: (null)[] | null;
  extSenderReference?: null;
  orderId: string;
  orderItems?: (OrderItemsEntity)[] | null;
  orderProviderDisplayName?: null;
  price: Price;
  pricingConfig: string;
  primaryContactInfo: PrimaryContactInfo;
  privateFareImformations?: (null)[] | null;
  sender: Sender;
  slices?: (SlicesEntity)[] | null;
  specialDiscounts?: (null)[] | null;
  status: string;
  timeLimit?: null;
  voucherCompensation?: null;
}

export interface BookingReferencesEntity {
  provider: string;
  reference: string;
}

export interface OrderItemsEntity {
  bookingReferences?: (BookingReferencesEntity)[] | null;
  orderItemId: string;
  passengerPrices?: (PassengerPricesEntity)[] | null;
  price: Price;
  sliceIds?: (string)[] | null;
  segments?: (Segments)[] | null;
  type: string;
  code?: string | null;
  passengerId?: string | null;
  segmentId?: string | null;
  sliceId?: string | null;
  subtype?: string | null;
  items?:ItemsGlobick[];
  serviceCode?: string | null;
}
export interface Segments {
  segmentId: string;
  status: string;
}

export interface PassengerPricesEntity {
  fareCalculation: string;
  passengerDiscount: PassengerDiscount;
  passengerId: string;
  price: Price;
  segmentPrices?: (SegmentPricesEntity)[] | null;
  taxes?: (TaxesEntity)[] | null;
}

export interface PassengerDiscount {
  amount: number;
  code?: null;
}

export interface Price {
  currency: string;
  fare: number;
  tax: number;
  ticketingFee: number;
  total: number;
}

export interface SegmentPricesEntity {
  fareCode: string;
  penalties?: (null)[] | null;
  penaltyFlags?: null;
  price: PriceOrPenaltyOrRefundPrice1;
  segmentsIds?: (string)[] | null;
  ticketDesignator: string;
}

export interface TaxesEntity {
  amount: number;
  carrier?: null;
  code: string;
  country?: string | null;
  currency: string;
  description: string;
  subcode: string;
}

export interface PrimaryContactInfo {
  confirmationMailOption?: null;
  email: string;
  hashEID: string;
  phone: string;
  phoneType: string;
}

export interface Sender {
  agencyContactInfo: AgencyContactInfo;
  agencyId: string;
  aggregatorId?: null;
  confirmationMailOption?: null;
  corporateAccountCode?: null;
  corporateId?: null;
  iataNumber: string;
  realIATA: boolean;
  sellerAccountCode?: null;
}

export interface AgencyContactInfo {
  agencyName: string;
  email: string;
  firstName?: null;
  firstSurname: string;
  phoneNumber: string;
  phoneType: string;
}

export interface SlicesEntity {
  arrivalDateTime: string;
  departureDateTime: string;
  destination: string;
  detailedPrices?: (DetailedPricesEntity)[] | null;
  duration: number;
  origin: string;
  originDestinationKey: string;
  overnight: boolean;
  price?: null;
  segments?: (SegmentsEntity)[] | null;
  sliceId: string;
  stopsNumber: number;
}

export interface DetailedPricesEntity {
  currency?: null;
  fare: number;
  passengerIds?: (string)[] | null;
  segmentPrices?: (null)[] | null;
}

export interface SegmentsEntity {
  arrival: ArrivalOrDeparture;
  arrivalDateTime: string;
  cabin: Cabin;
  departure: ArrivalOrDeparture;
  departureDateTime: string;
  duration: number;
  flight: Flight;
  id: string;
  overnight: boolean;
  providerId: string;
  relatedDisruptedSegmentId?: null;
  secureFlight: boolean;
  secureFlightInformed: boolean;
  status: CountryOrAircraftOrStatus;
  ticketDesignator: string;
  waitingTime: number;
}

export interface ArrivalOrDeparture {
  city: City;
  code: string;
  name: string;
  terminal?: string | null;
}

export interface City {
  code: string;
  country: CountryOrAircraftOrStatus;
  countryCode: string;
  description: string;
}

export interface CountryOrAircraftOrStatus {
  code: string;
  description: string;
}

export interface Cabin {
  bookingClass: string;
  bookingCode: string;
  brandCode: string;
  cabinDescription: string;
  fareFamily: string;
  rbd: string;
  remainingSeats: number;
  seatDisplays?: null;
}

export interface Flight {
  aircraft: CountryOrAircraftOrStatus;
  marketingCarrier: MarketingCarrierOrOperationalCarrier;
  marketingFlightNumber: string;
  operationalCarrier: MarketingCarrierOrOperationalCarrier;
  operationalDisclosure: string;
  operationalFlightNumber: string;
}

export interface MarketingCarrierOrOperationalCarrier {
  code: string;
  name: string;
}

export interface PassengersEntity {
  contactInfo: ContactInfo;
  documentInfos?: null;
  emergencyContactInfo: EmergencyContactInfo;
  externalPersonalInfo: ExternalPersonalInfo;
  frequentFlyerInfo?: null;
  idInfo: IdInfo;
  indirectOnBusinessInfo?: null;
  passengerId: string;
  passengerType: string;
  personalInfo: PersonalInfo;
  redressInfo?: null;
  residenceAccreditationStatus?: null;
}

export interface ContactInfo {
  confirmationMailOption: string | null;
  email: string;
  hashEID?: null;
  phone?: string | null;
  phoneType: string;
}

export interface EmergencyContactInfo {
  countryCode?: null;
  name?: null;
  phone?: null;
  phoneDetails: PhoneDetails;
  remark: string;
  surname?: null;
}

export interface PhoneDetails {
  countryCode?: null;
  number?: null;
}

export interface ExternalPersonalInfo {
  firstSurname: string;
  lastSurname: string;
  name: string;
  title?: string;
}

export interface IdInfo {
  type: string;
  value: string;
}

export interface PersonalInfo {
  birthDate?: string;
  firstName: string;
  firstSurname: string;
  gender?: string;
  lastSurname: string | null;
  title?: string;
}

export interface ReshopDifferential {
  detailedTaxes?: TaxesEntity[] | null;
  newOfferPrice?: null;
  offerID: string;
  originalOrder: NewOfferPriceOrOriginalOrder;
  passengerID?: null;
  penalty: PriceOrPenaltyOrRefundPrice1;
  refundPrice: PriceOrPenaltyOrRefundPrice1;
  type: string;
  saleFareDifference: SaleFareDifference;
  saleTaxTotalDifference: SaleTaxTotalDifference;
}

export interface listTaxedRefundInfo {
    type: string;
    parcial: boolean;
    refundable: boolean;
}

export interface TimeLimits {
  offerExpiration: string;
  paymentTimeLimit?: null;
}

export interface ItemsGlobick {
    bookingReference: string;
    clientId: string;
    confirmId: string;
    currency: string;
    endDate: string | null;
    startDate: string;
    name: string;
    price: number;
    product: string;
    status: string;
}

export interface UpdateItems {
    serviceType: string;
    serviceText: string;
    serviceDescription: string;
}

export interface listFareBasisRefundInfo {
    refundable: boolean;
    segmentIds: string[] | [];
    sliceId: string;
    noShow: boolean;
    refundableNoShow: boolean;
}
