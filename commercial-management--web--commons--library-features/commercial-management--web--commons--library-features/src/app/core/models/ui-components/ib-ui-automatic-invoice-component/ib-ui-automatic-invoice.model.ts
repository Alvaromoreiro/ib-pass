export type BookingReference = {
  provider: string;
  reference: string;
};

export type Price = {
  fare: number;
  tax: number;
  total: number;
  currency: string;
  ticketingFee: number;
};

export type Price2 = {
  fare: number;
  currency: string;
};

export type MinMaxPrice = {
  amount: number;
  currency: string;
};

export type MaxPrice = {
  amount: number;
  currency: string;
};

export type Penalty = {
  type: string;
  application: string;
  minPrice: MinMaxPrice;
  maxPrice: MinMaxPrice;
  nonrefundable: boolean;
  cancelFeeInd: boolean;
  changeFeeInd: boolean;
  isRefundable: boolean;
  isChangeable: boolean;
};

export type SegmentPrice = {
  price: Price2;
  fareCode: string;
  segmentsIds: string[];
  ticketDesignator?: unknown;
  penalties: Penalty[];
  penaltyFlags?: unknown;
};

export type Tax = {
  code: string;
  amount: number;
  currency: string;
  description: string;
  subcode?: unknown;
  country?: unknown;
  carrier?: unknown;
};

export type PassengerPrice = {
  fareCalculation: string;
  passengerId: string;
  price: Price;
  segmentPrices: SegmentPrice[];
  taxes: Tax[];
  orderItemPaymentInfos: unknown[];
};

export type HandBaggageAllowance = {
  baggageConcept: string;
  totalQuantity: number;
};

export type PassengersBaggage = {
  passengersId: string[];
  handBaggageAllowances: HandBaggageAllowance[];
  baggageInHoldAllowances: unknown[];
};

export type SliceBaggage = {
  sliceId: string;
  passengersBaggage: PassengersBaggage[];
};

export type OrderItem = {
  type: string;
  orderItemId: string;
  bookingReferences: BookingReference[];
  price: Price;
  sliceIds: string[];
  passengerPrices: PassengerPrice[];
  sliceBaggage: SliceBaggage[];
};

export type SegmentPrice2 = {
  price: Price2;
  fareCode: string;
  segmentsIds: string[];
  ticketDesignator?: unknown;
  penalties: unknown[];
  penaltyFlags?: unknown;
};

export type DetailedPrice = {
  fare: number;
  currency: string;
  passengerIds: string[];
  segmentPrices: SegmentPrice2[];
};

export type Country = {
  code: string;
  description: string;
};

export type City = {
  code: string;
  description: string;
  countryCode: string;
  country: Country;
};

export type Departure = {
  code: string;
  name: string;
  terminal: string;
  city: City;
};

export type Country2 = {
  code: string;
  description: string;
};

export type City2 = {
  code: string;
  description: string;
  countryCode: string;
  country: Country2;
};

export type Arrival = {
  code: string;
  name: string;
  terminal: string;
  city: City2;
};

export type MarketingCarrier = {
  code: string;
  name: string;
};

export type OperationalCarrier = {
  code: string;
  name: string;
};

export type Aircraft = {
  code: string;
  description: string;
};

export type Flight = {
  marketingCarrier: MarketingCarrier;
  operationalCarrier: OperationalCarrier;
  marketingFlightNumber: string;
  operationalFlightNumber: string;
  operationalDisclosure: string;
  aircraft: Aircraft;
};

export type Cabin = {
  rbd: string;
  bookingCode: string;
  bookingClass: string;
  remainingSeats: number;
  fareFamily: string;
  seatDisplays?: unknown;
  brandCode?: unknown;
  cabinDescription: string;
};

export type Segment = {
  departure: Departure;
  arrival: Arrival;
  flight: Flight;
  cabin: Cabin;
  overnight: boolean;
  id: string;
  duration: number;
  waitingTime: number;
  providerId?: unknown;
  ticketDesignator: string;
  secureFlightInformed: boolean;
  secureFlight: boolean;
  departureDateTime: string;
  arrivalDateTime: string;
};

export type Slice = {
  sliceId: string;
  departureDateTime: string;
  arrivalDateTime: string;
  duration: number;
  stopsNumber: number;
  price: Price2;
  detailedPrices: DetailedPrice[];
  segments: Segment[];
  overnight: boolean;
  origin: string;
  destination: string;
  originDestinationKey?: unknown;
};

export type PrimaryContactInfo = {
  phone: string;
  email: string;
  phoneType: string;
  confirmationMailOption?: unknown;
  refundEmail?: unknown;
};

export type CheckedBagAllowance = {
  baggageAllowanceId: string;
  totalQuantity: number;
  pieceAllowances: unknown[];
  segmentIds: string[];
};

export type CarryOnBaggageAllowance = {
  baggageAllowanceId: string;
  totalQuantity: number;
  segmentIds: string[];
};

export type Order = {
  orderId: string;
  bookingReferences: BookingReference[];
  orderItems: OrderItem[];
  slices: Slice[];
  price: Price;
  primaryContactInfo: PrimaryContactInfo;
  privateFareImformations: unknown[];
  commissions: unknown[];
  apisRequired: boolean;
  voucherCompensation?: unknown;
  specialDiscounts: unknown[];
  sender?: unknown;
  checkedBagAllowances: CheckedBagAllowance[];
  carryOnBaggageAllowances: CarryOnBaggageAllowance[];
  brandedFares?: unknown;
};

export type PersonalInfo = {
  firstName: string;
  firstSurname: string;
  lastSurname: string;
  birthDate?: unknown;
  surnameSuffix?: unknown;
};

export type ExternalPersonalInfo = {
  name: string;
  firstSurname: string;
  lastSurname: string;
};

export type Passenger = {
  passengerType: string;
  personalInfo: PersonalInfo;
  passengerId: string;
  idInfo?: unknown;
  contactInfo?: unknown;
  residenceAccreditationStatus?: unknown;
  documentInfos?: unknown;
  redressInfo?: unknown;
  externalPersonalInfo: ExternalPersonalInfo;
  emergencyContactInfoWeb?: unknown;
};

export type Ticket = {
  ticketNumbers: string[];
  type: string;
  orderItemId: string;
  passengerId: string;
  issueDateTime: string;
  fareCalculation?: unknown;
  taxes: unknown[];
  coupons: unknown[];
  iataCode?: unknown;
  issueCity?: unknown;
  passengerType: string;
  paymentInfo?: unknown;
  emdsList: unknown[];
  creditCardFeePrice?: unknown;
  conjunctionTickets?: unknown;
  reissueHistory: unknown[];
  taxedPrice?: unknown;
};

export type PersonalInfo2 = {
  name: string;
  surname: string;
};

export type ContactInfo = {
  phone: string;
  email: string;
  phoneType: string;
  confirmationMailOption?: unknown;
  refundEmail?: unknown;
};

export type Address = {
  street?: unknown;
  streetNumber?: unknown;
  city?: unknown;
  state?: unknown;
  country: string;
  zip?: unknown;
};

export type Payer = {
  personalInfo: PersonalInfo2;
  contactInfo: ContactInfo;
  idInfo?: unknown;
  address: Address;
};

export type PaymentMethod = {
  type: string;
  cardTypeId: string;
  profileCardId?: unknown;
  maskedCreditCard: string;
  payer: Payer;
  associatedDiscounts: unknown[];
};

export type PaymentItem = {
  type: string;
  tokenizedCardNumber: string;
  maskedCardNumber: string;
  authorization: string;
  subtotal: number;
  totalFee: number;
  total: number;
  unityFee: number;
  currency: string;
  cofInclusion: boolean;
};

export type Currency = {
  code: string;
  description: string;
  symbol: string;
  alignment: string;
  groupingSeparator: string;
  decimalSeparator: string;
  decimals: number;
  recommendedDisplay: string;
};

export type ContextMetadata = {
  language: string;
  country: string;
  currencies: Currency[];
};

export type RelatedContent = {
  key: string;
  value: string;
};
export type Warning = {
  code: string;
  description: string;
};

export type Data = {
  order: Order;
  passengers: Passenger[];
  tickets: Ticket[];
  warnings: Warning[];
  paymentMethod: PaymentMethod;
  paymentItems: PaymentItem[];
  contextMetadata: ContextMetadata;
  relatedContent: RelatedContent[];
  channel?: unknown;
  flowType: string;
};

export type IssueOrderResponse = {
  data: Data;
  code: number;
};
export enum InvoiceCodeOK {
  SPAIN_CREATED_OK = "AUTOMATIC_INVOICES_SPAIN_CREATED_OK",
  SPAIN_CREATED_SEVERAL_OK = "AUTOMATIC_INVOICES_SPAIN_CREATED_SEVERAL_OK",
  GUATEMALA_MEXICO_CREATED_OK = "AUTOMATIC_INVOICES_GUATEMALA_MEXICO_CREATED_OK",
  EUROPE_LATAM_CREATED_OK = "AUTOMATIC_INVOICES_EUROPE_LATAM_CREATED_OK",
  SPANISH_CIF_IN_ANOTHER_MARKET_OK = "AUTOMATIC_INVOICES_SPANISH_CIF_IN_ANOTHER_MARKET_OK",
}
export enum InvoiceCodeKO {
  WARNING_MEMBERSHIP_PROBLEM = "AUTOMATIC_INVOICES_WARNING_MEMBERSHIP_PROBLEM",
  WARNING_MEMBERSHIP_NOT_OBTAINED = "AUTOMATIC_INVOICES_WARNING_MEMBERSHIP_NOT_OBTAINED",
  WARNING_MEMBERSHIP_INFORMATION_INCOMPLETE = "AUTOMATIC_INVOICES_WARNING_MEMBERSHIP_INFORMATION_INCOMPLETE",
  WARNING_ORDER_INFORMATION_INCOMPLETE = "AUTOMATIC_INVOICES_WARNING_ORDER_INFORMATION_INCOMPLETE",
  WARNING_INVOICE_NOT_ISSUED = "AUTOMATIC_INVOICES_WARNING_INVOICE_NOT_ISSUED",
  INVOICES_FAIL = "AUTOMATIC_INVOICES_INVOICES_FAIL",
  NO_TICKET_NUMBER = "AUTOMATIC_INVOICES_NO_TICKET_NUMBER",
  INVOICES_PARTIAL_FAIL = "AUTOMATIC_INVOICES_INVOICES_PARTIAL_FAIL",
}
