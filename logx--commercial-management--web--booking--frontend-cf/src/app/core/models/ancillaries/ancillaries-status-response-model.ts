export interface AncillariesStatusResponseModel {
    currencies: Currency[];
    slices: Slice[];
    ancillaries: Ancillary[];
}

interface Ancillary {
    status: Status;
    currency?: null | string;
    flexibilityAncillaries?: FlexibilityAncillary[];
    priceFrom?: null | number;
    type: string;
    segments?: Segment[];
    price?: number;
    kilosCo2Equivalent?: number;
    externalUrl?: string;
    subTypes?: SubType[];
    slices?: Slice2[];
}

interface Slice2 {
    id: string;
    passengers: Passenger2[];
    pricesProvider: string;
    status: Status3;
}

interface Passenger2 {
    id: string;
    maxAdditionalPieces: number;
    pieces: Piece[];
}

interface Piece {
    subtype: string;
    description: string;
    extraPieces: null;
    reasonForIssuance: ReasonForIssuance;
    franchisePieces: number;
    purchasedPieces: number;
    maxAdditionalSubtypePieces: number;
    availablePriceRanges: AvailablePriceRange[];
    status: Status3;
}

interface AvailablePriceRange {
    amount: number;
    airportAmount: number;
    from: number;
    to: number;
}

interface ReasonForIssuance {
    code: string;
    subcode: string;
}

interface SubType {
    glbType: string;
    status: Status2;
}

interface Segment {
    id: string;
    passengers: Passenger[];
    status: Status3;
}

interface Passenger {
    id: string;
    amount: number;
    status: Status3;
}

interface Status3 {
    code: string;
    reason: null;
}

interface FlexibilityAncillary {
    description: string;
    total: null;
    passengerPrices: PassengerPrice[];
    status: Status2;
    subtype: string;
    percentage?: number;
    discount?: number;
}

interface Status2 {
    code: string;
    reason: string;
}

interface PassengerPrice {
    id: string;
    amount: number;
}

interface Status {
    code: string;
    reason: null | string;
}

interface Slice {
    id: string;
    segmentIds: string[];
}

interface Currency {
    code: string;
    description: string;
    symbol: string;
    alignment: string;
    groupingSeparator: string;
    decimalSeparator: string;
    decimals: number;
    recommendedDisplay: string;
}