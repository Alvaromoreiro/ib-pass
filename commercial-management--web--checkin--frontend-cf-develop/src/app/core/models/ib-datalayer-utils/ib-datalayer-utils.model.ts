export type UpdateDatalayerForAncillaries = {
    updatePrices: boolean;
    ancillariesAction: string;
    totalQuantityBaggage: number;
    baggagesPrice: number;
    totalQuantitySeats: number;
    seatsPrice: number;
    insuranceType: string;
    insurancesPrice: number;
    flexibilityPrice: number;
    totalQuantitySpeqs: number;
    speqsPrice: number;
};

export type DatalayerInfoInsurance = {
    updatePrices: boolean,
    insuranceType: any,
    insurancePrice: number,
    provider: any
};

export type AncillariesContext = {
    insurancePrice: number | undefined;
    hasSeats: boolean;
    hasBaggage: boolean;
    hasSpeqs: boolean;
    hasFlexibilization: boolean;
    hasInsurance: boolean;
    hasInsuranceAllianzFusion: boolean;
    hasGlobickActivities: boolean;
    hasGlobickTransfer: boolean;
};