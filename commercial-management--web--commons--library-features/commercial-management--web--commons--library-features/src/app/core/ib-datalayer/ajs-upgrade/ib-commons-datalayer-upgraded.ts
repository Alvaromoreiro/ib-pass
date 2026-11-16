import { InjectionToken } from "@angular/core";

export const DatalayerUtilsServiceInjection =
  new InjectionToken<DatalayerUtilsServiceType>("DatalayerUtilsService");

export function DatalayerUtilsFactory(i: any) {
  return i.get("DatalayerUtilsService");
}

export const DatalayerUtilsProvider = {
  provide: DatalayerUtilsServiceInjection,
  useFactory: DatalayerUtilsFactory,
  deps: ["$injector"],
};

export type DatalayerUtilsServiceType = {
  initializeDatalayer: (
    language: string,
    market: string,
    deviceType: string,
  ) => void;
  setDatalayerAvailabilityInitialParams: (
    language: string,
    market: string,
    deviceType: string,
  ) => void;
  sendDatalayerEvent: (type: string) => void;
  addDataLayerInfo: (datalayerInfo: object) => void;
  addDigitalDataInfo: (datalayerInfo: object) => void;
  updateLoggedDatalayer: (customerData: any) => void;
  updateLoggedDigitalData: (customerData: any) => void;
  getAviosCoins: (customerData: any) => number;
  updateLoggedDatalayerAvios: (avios: string) => void;
  updateLoggedDigitalDataAvios: (avios: string) => void;
  generateDatalayerDOM: () => string;
  generateDigitalDataDOM: () => string;
  removeDatalayerObjects: (datalayerAttributtes: object) => void;
  removeDigitalDataObjects: (datalayerAttributtes: object) => void;
  updateDatalayerWithQuadrigam: (
    quadrigam: any,
    extendedObject: any,
    isUserLogged: any,
  ) => void;
  updateDigitalDataWithQuadrigam: (
    quadrigam: any,
    extendedObject: any,
    isUserLogged: any,
  ) => void;
  sendDatalayerErrorEvent: (errorObject: any) => void;
  sendDigitalDataErrorEvent: (errorObject: any) => void;
  sendDatalayerErrorCompleteEvent: (errorObject: any) => void;
  removeDatalayerErrorAttrs: () => void;
  sendDatalayerModalEvent: (modalObject: any) => void;
  removeDatalayerModalAttrs: () => void;
  addDataLayerEcommerceInfo: (datalayerInfo: object) => void;
  updateDatalayerInitType: (initType: string) => void;
  updateDatalayerForAncillaries: (
    updatePrices: boolean,
    ancillariesAction: string,
    totalQuantityBaggage: number,
    baggagesPrice: number,
    totalQuantitySeats: number,
    seatsPrice: number,
    insuranceType: string,
    insurancesPrice: number,
    flexibilityPrice: number,
    totalQuantitySpeqs: number,
    speqsPrice: number,
  ) => void;
  generateDatalayerAvailability: (availabilityData: any) => object;
  generateDatalayerPassengers: (
    slices: any,
    priceInfo: any,
    currency: any,
    haul: any,
  ) => object;
  generateDatalayerAncillaries: () => object;
  generateDatalayerPayments: (paymentData: any, orderData: any) => object;
  generateDigitalDataPayments: (paymentData: any, orderData: any) => object;
  updateDatalayerInfoPayments: (paymentData: any) => object;
  updateDigitalDataInfoPayments: (paymentData: any) => object;
  setAncillariesAction: (ancillariesAction: object) => void;
  generateConfirmationDatalayerObject: () => void;
  generateConfirmationDigitalDataObject: () => void;
  getPassengersMetasearch: (passengers: any[]) => any;
  updateTripDetailsDatalayerObject: (bookingInfo: any) => void;
  resetDatalayer: () => void;
  updateDatalayerActionForAncillaries: (
    eventCategory: any,
    eventAction: any,
    eventLabel: any,
  ) => void;
  updateDatalayerEvent: (
    eventCategory: any,
    eventAction: any,
    eventLabel: any,
    eventName: any,
  ) => void;
  updateDatalayerWithTaxs: (data: any) => void;
  generateDatalayerConfirmation: (confirmData: any) => void;
  updateDatalayerForFlexFlights: (
    pnrType: any,
    flightsStatus: any,
    orderItemsInfo: any,
    flightType: any,
    originalFlightDate: any,
    originalIssueDate: any,
    anticipationDays: any,
    voucherDiscount: any,
    daysInDestination: any,
    aviosRedeemed: any,
    passengersInfo: any,
    originDestinations: any,
    countries: any,
    cabinClass: any,
    stopsPerSlice: any,
    identifierList: any,
    carrier: any,
    pricesInfo: any,
  ) => void;
  updateDigitalDataForFlexFlights: (
    aviosEarned: any,
    changeAcceptance: any,
    changeType: any,
    flightStatus: any,
    originalAdvancePurchase: any,
    originalDate: any,
    originalLengthStay: any,
    pnrType: any,
    purchaseDate: any,
    purchaseType: any,
    slice1OriginalDate: any,
    slice2OriginalDate: any,
    slice3OriginalDate: any,
    slice4OriginalDate: any,
    specialMeal: any,
    voucherDiscount: any,
    aviosRedeemed: any,
    passengersInfo: any,
    pricesInfo: any,
    flightType: any,
  ) => void;
  updateSlicesDatalayerForFlexFlights: (info: any, summary: any) => void;
  updateAircraft: (aircraft: any) => void;
  updatePnr: (pnr: any) => void;
  setAncillariesDatalayer: () => void;
  updateDatalayerForUpgrade: (
    isOfferSelected: any,
    isUpgradeFree: any,
    selectedOffer: any,
    upgradingAccepted: any,
    currencySymbol: any,
  ) => void;
  addDatalayerInfoHashEID: (customerData: any) => void;
  addDigitalDataInfoHashEID: (customerData: any) => void;
  updateDatalayerWithEvents: (
    eventCategory: any,
    eventAction: any,
    eventLabel: any,
  ) => void;
  addDestinationInfoDatalayer: (destinationInfo: any, slices: any) => void;
  addDestinationInfoDigitalData: (destinationInfo: any, slices: any) => void;
  calculatePassengersPrice: () => string;
  calculateCheaperFare: (slices: any) => boolean;
  updateDatalayerEvents: (
    eventCategory: string,
    eventAction: string,
    eventLabel: string,
  ) => void;
  addShuttleDatalayer: (flowApp: string, model: any) => void;
  addShuttleDigitalData: (flowApp: string, model: any) => void;
  updateDatalayerInfo: (quadrigam: any) => void;
  generateBbkiDataPayments: (productsObject: any, issuedInfoData: any) => void;
  generateBbkiRedemptionDataPayments: (
    productsObject: any,
    issuedInfoData: any,
  ) => void;
};
