namespace CommonsMonetateModels {
  export type DatalayerObject = {
    name?: string;
    value?: string;
  };
  export type DatalayerInfoObject = {
    depDate?: string[];
    destination: string[];
    origin: string[];
    travelers: string[];
    adults?: string[];
    infants?: string[];
    minors?: string[];
    seniors?: string[];
    retDate?: string[];
    serviceClass?: string[];
  };

  export interface CartProductDetails {
    id?: number;
    productId: string;
    quantity: string;
    unitPrice: string;
    sku?: string;
    currency?: string;
    isAncillary?: boolean;
  }
  export interface PurchaseProduct extends CartProductDetails {
    purchaseId: string;
  }

  export interface FlightPassengersInfo {
    modeWeb: string | null;
    searchOrigin: string | null;
    tripType: number | null;
    senior: string | null;
    adult: number | null;
    young: string | null;
    teenager: string | null;
    child: number | null;
    infant: number | null;
    resident: string | null;
    largeFamilyType: string | null;
    flexDates: boolean;
    preferredCabin: string | null;
    payWithAvios: string | null;
    payWithPoints: string | null;
    ibGroup: string | null;
    referralId: string | null;
    displayedPrice: string | null;
    slices: [];
    userCurrency: string | null;
    priceCurrency: string | null;
    numTrips: string | null;
    originDestinations: OriginDestinationInfo[];
    bookingCode1: string | null;
    backToUrl: string | null;
    codeTracking: string | null;
    travelAgent: string | null;
    fromMarket: string | null;
    fromLanguage: string | null;
  }

  export interface OriginDestinationInfo {
    origin: string | null;
    destination: string | null;
    date: string | null;
  }

  export interface FlexibilizationModel {
    description: string;
    total: number;
    passengerPrices: PassengerPricesModel[];
    status: FlexibilizationStatusModel;
    percentage?: number;
    subtype: string;
    priceFormatted: string;
  }

  export interface PassengerPricesModel {
    id: string;
    amount: number;
  }

  export interface FlexibilizationStatusModel {
    code: string;
    reason: string | null;
  }
}
