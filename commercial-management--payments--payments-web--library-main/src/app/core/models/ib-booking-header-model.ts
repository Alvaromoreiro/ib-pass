export type ShoppingBasketDiscountObjectType = {
    description?: string;
    discountFormatted: string;
    discount?: number;
    discountType: string;
    percentDiscount?: number;
    discountCode?: string;
    totalDiscount: number;
    type: string;
};
export type ShoppingBasketDiscountType = {
    LGF: ShoppingBasketDiscountObjectType;
    RES: ShoppingBasketDiscountObjectType;
    CORPORATE: ShoppingBasketDiscountObjectType;
    PARTNER: ShoppingBasketDiscountObjectType;
    VOUCHER: ShoppingBasketDiscountObjectType;
    AVIOS: ShoppingBasketDiscountObjectType;
    AVIOS_REDEMPTION: ShoppingBasketDiscountObjectType;
    POINTS_REDEMPTION: ShoppingBasketDiscountObjectType;
};
export type ShoppingBasketDiscountsModel = {
    discounts: ShoppingBasketDiscountType;
    duscountsMap: ShoppingBasketDiscountType;
    hasDiscounts: boolean;
    total: number;
    totalFormated?: string;
    formattedElement?: string;
};
export type ShoppingBasketTotal = {
    formatted: string;
    totalPrice: number;
    original?: number;
    totalAvios?: number;
    totalDcc?: string;
};
export type ShoppingBasketItemTotal = {
    total: number;
    totalFormatted: string;
};
export type ShoppingBasketTripPassenger = {
    description: string;
    fareTypePrice: string;
    fareUnitPrice: string;
    quantity: number;
    taxes: string;
    type: string;
    namesList?: string[];
    parsedAviosFare?: string[];
};
export type ShoppingBasketTripSegmentCountry = {
    code: string;
    description: string;
};
export type ShoppingBasketTripSegmentPoint = {
    code: string;
    country: ShoppingBasketTripSegmentCountry;
    countryCode?: string;
    description: string;
};
export type ShoppingBasketTripSegment = {
    date: string;
    destination: ShoppingBasketTripSegmentPoint;
    origin: ShoppingBasketTripSegmentPoint;
    segments: ShoppingBasketTripSegment[];
};
export type ShoppingBasketTrip = {
    passengers: ShoppingBasketTripPassenger[];
    scales: boolean;
    segments: ShoppingBasketTripSegment[];
};
export type ShoppingBasketTripsType = {
    total: ShoppingBasketTotal;
    trips: ShoppingBasketTrip[];
    ticketingFee?: number;
    ticketingFeeFormatted?: string;
};
export type ShoppingBasketPriorityInfoTrips = {
    amount: number;
    arrival: ShoppingBasketTripSegmentPoint;
    departure: ShoppingBasketTripSegmentPoint;
    id: string;
    priceFormatted: string;
    quantity: number;
};
export type ShoppingBasketPriorityDelete = {
    type: string;
};
export type ShoppingBasketTripBaggagesSegmentBaggage = {
    description: string;
    passengers: string[];
    quanty: number;
    total: number;
    totalFormatted: string;
    type: string;
};
export type ShoppingBasketTripBaggagesSegment = {
    baggages: ShoppingBasketTripBaggagesSegmentBaggage[];
    destination: ShoppingBasketTripSegmentPoint;
    origin: ShoppingBasketTripSegmentPoint;
    segmentId: string;
    total: number;
};
export type ShoppingBasketSeatSegmentPassenger = {
    amount: number;
    amountFormatted: string;
    id: string;
};
export type ShoppingBasketSeatsSegmentsSeats = {
    amount: number;
    description: string;
    freePassenger: ShoppingBasketSeatSegmentPassenger[];
    passengers: ShoppingBasketSeatSegmentPassenger[];
    paymentPassenger: ShoppingBasketSeatSegmentPassenger[];
    quanty: number;
    totalAmountFreePassenger: string;
    totalAmountPaymentPassenger: string;
    type: string;
    totalFormatted: string;
};
export type ShoppingBasketSeatsSegments = {
    isEarly: boolean;
    destination: ShoppingBasketTripSegmentPoint;
    origin: ShoppingBasketTripSegmentPoint;
    quanty: number;
    seats: ShoppingBasketSeatsSegmentsSeats[];
    segmentId: string;
    total: number;
    totalFormatted: string;
};
export type ShoppingBasketSpeqsSegmentSpeq = {
    description: string;
    passengers: string[];
    quanty: number;
    total: number;
    totalFormatted: string;
    type: string;
};
export type ShoppingBasketSpeqsSegment = {
    destination: ShoppingBasketTripSegmentPoint;
    origin: ShoppingBasketTripSegmentPoint;
    quanty: number;
    speqs: ShoppingBasketSpeqsSegmentSpeq[];
    total: number;
};
export type ShoppingBasketBaggages = {
    hasBaggage: boolean;
    segments: ShoppingBasketTripBaggagesSegment[];
    total?: ShoppingBasketItemTotal;
};
export type ShoppingBasketBundleInfoItems = {
    type: string;
    text: string;
    discount?: number;
    priceItem?: number;
    priceItemAll?: number;
    priceItemAllBenefit?: number;
    priceItemAllDiscount?: number;
    priceItemBenefit?: number;
    priceItemDiscount?: number;
    quantity?: number;
    quantityPassAndTrips?: number;
    subtype?: string;
};
export type ShoppingBasketBundleInfo = {
    items: ShoppingBasketBundleInfoItems[];
    totalPassengers: number;
    id?: string;
};
export type ShoppingBasketFlexibilizationInfoConcepts = {
    description: string;
    price: number;
    priceFormatted: string;
    quantity: number;
};
export type ShoppingBasketFlexibilizationInfoAmount = {
    price: number;
    priceFormatted: string;
    title: string;
};
export type ShoppingBasketFlexibilizationInfoItems = {
    concepts: ShoppingBasketFlexibilizationInfoConcepts[];
};
export type ShoppingBasketFlexibilizationInfoDelete = {
    type: string[];
};
export type ShoppingBasketFlexibilizationInfo = {
    amount: ShoppingBasketFlexibilizationInfoAmount;
    category: string;
    currency: Currency;
    delete: ShoppingBasketFlexibilizationInfoDelete[];
    items: ShoppingBasketFlexibilizationInfoItems[];
    title: string;
    type: string;
};
export type ShoppingBasketPriorityInfo = {
    amount: number;
    category: string;
    currency: Currency;
    delete: ShoppingBasketPriorityDelete[];
    items: any[];
    priceFormatted: string;
    title: string;
    trips: ShoppingBasketPriorityInfoTrips[];
};
export type ShoppingBasketSegmentsInfo = {
    id: string;
    destination: ShoppingBasketTripSegmentCountry;
    origin: ShoppingBasketTripSegmentCountry;
};
export type ShoppingBasketBundle = {
    hasBundle: boolean;
    info: ShoppingBasketBundleInfo | null;
    total?: ShoppingBasketItemTotal;
};
export type ShoppingBasketFlexibilization = {
    hasFlexibilization: boolean;
    info: ShoppingBasketFlexibilizationInfo | null;
    total?: ShoppingBasketItemTotal;
};
export type ShoppingBasketGlobickTransfersInfo = {
    date: string;
    dateReturn: string;
    totalFormatted: string;
    totalFormattedReturn: string;
    transferCar: string;
};
export type ShoppingBasketGlobickTransfers = {
    hasTransfersGlobick: boolean;
    info: ShoppingBasketGlobickTransfersInfo | null;
    total?: ShoppingBasketItemTotal;
};
export type ShoppingBasketInsurances = {
    hasInsurance: boolean;
    info: any[] | null;
    total?: ShoppingBasketItemTotal;
};
export type ShoppingBasketInsuranceAllianzFusion = {
    hasInsuranceAllianzFusion: boolean;
    info: any | null;
    total?: ShoppingBasketItemTotal;
};
export type ShoppingBasketPriority = {
    hasPriorityBoarding: boolean;
    info: ShoppingBasketPriorityInfo | null;
    total?: ShoppingBasketItemTotal;
};
export type ShoppingBasketSeats = {
    hasSeats: boolean;
    segments: ShoppingBasketSeatsSegments[] | null;
    total?: ShoppingBasketItemTotal;
};
export type ShoppingBasketSpeqs = {
    hasSpeqs: boolean;
    segments: ShoppingBasketSpeqsSegment[] | null;
    total?: ShoppingBasketItemTotal;
};
export type ShoppingBasketOthersItems = {
    description: string;
    total: number;
    totalFormatted: string;
    type: string;
};
export type ShoppingBasketOthers = {
    hasElements: boolean;
    others: ShoppingBasketOthersItems[] | null;
    total?: ShoppingBasketItemTotal;
};
export type ShoppingBasketPetc = {
    hasPetc: boolean;
    segments: ShoppingBasketPetcSegment[] | null;
    total?: ShoppingBasketItemTotal;
};
export type ShoppingBasketUpgrading = {
    hasUpgrading: boolean;
    segments: any[];
    total?: number;
    totalFormatted?: string;
};
export type ShoppingBasketCarbonFootprint = {
    hasCarbonFootprint: boolean;
    info: any[] | null;
    total?: ShoppingBasketItemTotal;
};
export type ShoppingBasketInsuranceType = {
    offer: string;
    passengers: number;
    type: string;
};
export type ShoppingBasketInsurance = {
    hasInsurance: boolean;
    info: ShoppingBasketInsuranceType | null;
    total?: ShoppingBasketItemTotal;
};
export type ShoppingBasketType = {
    baggages: ShoppingBasketBaggages;
    bundle: ShoppingBasketBundle;
    carbonFootprint: ShoppingBasketCarbonFootprint;
    currency: Currency;
    discountsModel: ShoppingBasketDiscountsModel;
    flexibilization: ShoppingBasketFlexibilization;
    insurance: ShoppingBasketInsurance;
    othersModel: ShoppingBasketOthers;
    petc: ShoppingBasketPetc;
    priorityBoarding: ShoppingBasketPriority;
    seats: ShoppingBasketSeats;
    segmentsInfo: ShoppingBasketSegmentsInfo[];
    showBasket: boolean;
    speqs: ShoppingBasketSpeqs;
    total: ShoppingBasketTotal;
    trips: ShoppingBasketTripsType;
    upgrading: ShoppingBasketUpgrading;
    globickTransfers: ShoppingBasketGlobickTransfers;
    insuranceAllianzFusionInfo: ShoppingBasketInsuranceAllianzFusion;
    assistCard: ShoppingBasketAssistCard;
};
export type PassengersTypesNumber = {
    numAdults: number;
    numChilds: number;
    numInfants: number;
    numSeniors: number;
    numTeenager: number;
    numYouth: number;
    numberPassengers: number;
};
export type HeaderStep = {
    index: number;
    position: string;
    text: string;
};
export type HeaderDataGreyBarLogin = {
    onLogin: () => void;
    afterLogin: () => void;
    onError: () => void;
};

export type HeaderDataGreyBar = {
    isLogged: boolean;
    isONB: boolean;
    show: boolean;
    userLogged: boolean;
    loggedData: any;
    login: HeaderDataGreyBarLogin;
};
export type HeaderDataHeaderModelStepsType = {
    position: number;
    totalSteps: number;
    stepsDescription?: string | null;
};
export type HeaderDataStepsModel = {
    position: string;
    steps: HeaderStep[];
};
export type HeaderStepsModelFlightType = {
    flightType: string;
    isMultiCity?: boolean;
};
export type HeaderStepsModel = {
    hasSteps: boolean;
    position: string;
    steps: string;
};
export type HeaderDataHeaderModel = {
    advancedSearch: boolean;
    currency: Currency;
    flightType: string;
    passengers: PassengersTypesNumber;
    redemption: string;
    shoppingBasket: ShoppingBasketType;
    showBasket: boolean;
    showAdvancedSearch: boolean;
    showModalBackHome: boolean;
    trips: HeaderCompleteOriginDestinationResponse[];
    isMultiflight: boolean;
    steps?: HeaderDataHeaderModelStepsType;
};
export type HeaderDataType = {
    greyBarModel: HeaderDataGreyBar;
    headerModel: HeaderDataHeaderModel;
    stepsModel: HeaderDataStepsModel;
};

export type HeaderCompleteRequest = {
    originDestination: HeaderCompleteOriginDestinationModel;
    redemption: boolean;
    flightType: string;
    currency: string;
    showModalBackHome: boolean;
};
export type HeaderCompleteCountry = {
    code: string;
    description: string;
};
export type HeaderCompleteOriginCity = {
    code: string;
    description: string;
    timezone: string;
    country: Country;
};
export type HeaderCompleteDestinationCity = {
    code: string;
    description: string;
    timezone: string;
    country: Country;
};
export type HeaderCompleteDates = {
    outboundFlight: string;
    formatedOutboundFlight: Date;
    returnFlight: string;
    formatedReturnFlight: Date;
};
export type HeaderCompleteOriginDestinationModel = {
    originCity: HeaderCompleteOriginCity;
    destinationCity: HeaderCompleteDestinationCity;
    dates: HeaderCompleteDates;
    passengers: number;
    numAdults: number;
    numSeniors: number;
    numYoung: number;
    numTeenager: number;
    numInfant: number;
    numChilds: number;
    numberPassengrsWithoutInfant: number;
};
export type HeaderCompleteOriginDestinationResponse = {
    originCode: string;
    originCity: string;
    destinyCode: string;
    destinyCity: string;
    dateFlight: string;
    returnFlight: string;
    passengers: number;
    tripType: string;
};
export type HeaderCompletePassengerInfo = {
    numberPassengers: number;
    numAdults: number;
    numSeniors: number;
    numYouth: number;
    numTeenager: number;
    numChilds: number;
    numInfants: number;
};
export type ShoppingBasketPetInfo = {
    amount: number;
    amountFormatted: string;
    breeds: string[];
    passengers: string[]
    type: {
        id: string;
        description: string;
    };
    units: number;
};
export type ShoppingBasketPetcSegment = {
    description: string;
    destination: ShoppingBasketTripSegmentPoint;
    origin: ShoppingBasketTripSegmentPoint;
    pets: ShoppingBasketPetInfo[];
    sliceId: string;
    total: number;
    totalFormatted: string;
    quantity: number;
};

export interface ShoppingBasketAssistCard {
    name: string;
    hasAssistCard: boolean;
    total: ShoppingBasketItemTotal;
    currency: string;
}

export type ShoppingBasketSegmentsTypes = ShoppingBasketTripBaggagesSegment | ShoppingBasketSeatsSegments | ShoppingBasketSpeqsSegment | ShoppingBasketPriorityInfoTrips | ShoppingBasketPetcSegment ;

