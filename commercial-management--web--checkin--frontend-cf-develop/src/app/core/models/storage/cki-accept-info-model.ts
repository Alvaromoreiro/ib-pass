export interface IAcceptData {
    locator: string | null;
    acceptedSegments: IAcceptedSegments[];
    upgrading: IAcceptUpgrading | null;
    noShowPassengers: number[];
}

export interface IAcceptedSegments {
    id: number;
    passengers: IAcceptPassenger[];
    cabinClass: IAcceptCabinClass;
    checkInStatusTime: null;
}

export interface IAcceptPassenger {
    id: number;
    status: string;
    seat: IAcceptSeat;
    extraSeat: IAcceptSeat | null;
    purchaseSeatRequired: boolean;
    messageStatus: string | null;
}

interface IAcceptCabinClass {
    code: string;
    type: string;
    description: string;
}

interface IAcceptSeat {
    row: string;
    column: string;
}

export interface IAcceptUpgrading {
    currency: Currency;
    conditionsByCabinClass: ConditionsByCabinClass[];
    offers: Offer[];
    termsAndConditions: string;
    cabinLayout: string;
    cabinLayoutDescription: string;
}

export interface Currency {
    code: string;
    description: string;
    symbol: string;
    alignment: string;
    groupingSeparator: string;
    decimalSeparator: string;
    decimals: number;
    recommendedDisplay: string;
}

export interface ConditionsByCabinClass {
    code: string;
    conditions: string[];
}

export interface Offer {
    id: string;
    offerSegmentClasses: OfferSegmentClass[];
    amountPerPassenger: number;
    cabinLayout: string;
    totalAmount: number;
    cabinLayoutDescription: string;
}

export interface OfferSegmentClass {
    segment: number;
    cabinClass: IAcceptCabinClass;
}