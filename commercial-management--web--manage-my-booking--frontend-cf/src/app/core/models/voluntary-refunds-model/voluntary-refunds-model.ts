//Response of attendance voucher service

export type PassengerInfoType = {
    type: string;
    amount: number;
    typePlural: string;
    totalPriceFormatted: string;
    ticketingFeePriceFormatted: string;
    farePriceFormatted: string;
    taxPriceFormatted: string;
};

export type cashInformationType = {
    formattedPrice: string;
};

export type segmentsType = {
    hasSeat: boolean;
    id: string;
    origin: {
        description: string;
        code: string;
    };
    destination: {
        description: string;
        code: string;
    }
};

export type ancillariesType = {
    type: string;
    segmentId: string;
    amount: number;
    priceFormatted: string;
    priceTotalFormatted: string;
};

export type slicesInfoType = {
    hasSpeqs: boolean;
    hasSeat: boolean;
    hasPriorityBoarding: boolean;
    hasBaggage: boolean;
    ancillaries: ancillariesType[];
    segments: segmentsType[];
    sliceOrigin: {
        description: string;
    };
    sliceDestination: {
        description: string;
    };
};

export type cashPriceInfoType = {
    formattedPrice: string;
    totalPriceTotalFormatted: string;
}

export type modelType = {
    hasSpeqs: boolean;
    hasSeat: boolean;
    hasPriorityBoarding: boolean;
    hasBaggage: boolean;
    cashInformation: cashInformationType[];
    contactInfo: string;
    voucherFlow: object;
    passengersInfo: PassengerInfoType[];
    voucherPriceInfo: {
        totalPriceTotalFormatted: string;
        formattedPrice: string;
    };
    cashPriceInfo: cashPriceInfoType[];
    slicesInfo: slicesInfoType[];
}

export type modelService = {
    less24Hours: true,
    withPayments: true
}
