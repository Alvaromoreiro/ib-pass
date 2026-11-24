export type Passengers = {
    personalData: PersonalDatum[];
    generalData: GeneralData;
    totalPassengersFormatted: string;
    noPaymentSummary:boolean;
};
export type PersonalDatum = {
    name: string;
    surname: string;
    specialNeeds: any[];
};
export type GeneralData = {
    ADULT: ADULT[];
};

export type ADULT = {
    number: number;
    fareCash: number;
    totalTax: number;
    currency: Currency;
    breakdownTaxes: BreakdownTax[];
    parsedFareCash: string;
    parsedTotalTax: string;
    parsedFareAvios: string;
    parsedFareOBPoints: string;
    parsedItemDiferencePrice: string;
    parsedDiferencePrice: string;
    parsedPenalty: string;
    penalty: number;
};

export type BreakdownTax = {
    code: string;
    amount: string;
    currency: string;
    description: string;
    subcode?: any;
    country?: any;
    carrier?: any;
};

export interface PetC {
    hasPetc: boolean;
    segments: PetcSegment[] | null;
    total?: ItemTotal;
}

export type ItemTotal = {
    total: number;
    totalFormatted: string;
};

export type PetcSegment = {
    description: string;
    destination: TripSegmentPoint;
    origin: TripSegmentPoint;
    passengers: string[];
    pets: PetsInfo[];
    segmentId: string;
    total: number;
    totalFormatted: string;
    quantity: number;
};

export type TripSegmentPoint = {
    code: string;
    country: TripSegmentCountry;
    countryCode?: string;
    description: string;
};

export type TripSegmentCountry = {
    code: string;
    description: string;
};

export type PetsInfo = {
    breeds: string[];
    units: number;
    type: {
        id:string;
        description:string;
    };
    amount?: number;
    amountFormatted: string;
};