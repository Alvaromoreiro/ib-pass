export interface InsuranceInfoModel {
    countriesList: any[];
    insuranceCountry: any;
    id: any;
    price: any;
    priceZero: any;
    originalPrice: any;
    passengers: any;
    conditionsUri: string;
    isModalLoading: boolean;
    countryInsurance: string;
    insurancePatterns: Record<string, any>;
    consent: string;
    issueCountry: any;
    oldInsuranceCountry: any;
}

export interface TransformedAncillariesInfo {
    ancillariesAvailable: any[];
    ancillariesTrips: any[];
    ancillariesInsurance: any[];
    insuranceInfo: InsuranceInfoModel;
    seatsAvailable: { status: boolean; priceFrom: any };
    insuranceAvailable: boolean;
    insuranceAllianzFusionAvailable: boolean;
    bobAvailable: boolean;
    bobInfo: { slices: any[]; priceFrom: any; additionalBagsPrice: any };
    currency: CommonsCurrencyModel.CurrencyResponse;
    ancillariesSpeqs: any[];
    speqsAvailablePrice: { priceFrom: any };
    speqsQuanty: number;
    ancillariesCarbonFootprint: any;
    ancillariesTransfersGlobick: any;
}

export interface InsuranceHandlerContext {
    ancillariesInsuranceInfo: any;
    countryInsurance: string;
}

export interface AncillariesCommonInfo {
    ancillariesAvailable: any[];
    currency: CommonsCurrencyModel.CurrencyResponse;
    isCurrencyLong: boolean;
    pendingSeats: boolean;
    isPaFlow: boolean;
    upgradingInfo: any;
    baggageAvailable: boolean;
    passengerBaggagesTrips: any[];
    baggageAvailablePrice: { priceFrom: any };
    flexibilizationInfo: any;
    flags: { showBannerConfort: boolean; showBannerResident: boolean };
    preorderAncillarieInfo: any;
    priorityBoardingInfo: any;
    baggagesQuanty: number;
}

export interface AncillariesHeaderBasket {
    baggages: any[];
    speqs: any[];
    seats: any[];
    insurance: any;
    upgrading: { upgradingTrips: any[]; total: any; totalFormatted: any };
    currency: CommonsCurrencyModel.CurrencyResponse;
}

export interface AncillariesHeaderTrip {
    segmentId: any;
    cabin: any;
    seats: any[];
    origin: any;
    destination: any;
    quanty: number;
    total: number;
    totalFormatted: any;
}

export interface AncillaryTripsRequest {
    slices: any[];
    type: any;
}

export interface BookingSegmentInfo {
    id: number;
    arrival: CkiBookingInfo.AirportInfo;
    departure: CkiBookingInfo.AirportInfo;
}

export interface FlatSegmentInfo {
    id: any;
    origin?: any;
    destination?: any;
}
