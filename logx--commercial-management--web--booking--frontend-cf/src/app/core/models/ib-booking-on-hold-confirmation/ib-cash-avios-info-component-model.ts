export type CashAviosModel = cashAviosPossibility[];

export type cashAviosPossibility = {
    aviosRequired:          number;
    currency:               string;
    currencySymbol:         string;
    formatedAviosRequired: string;
    formatedTotalDiscount: string;
    offerAvailable:         boolean;
    perPassengerDiscounts:  PerPassengerDiscount[];
    totalDiscount:          number;
};

export type PerPassengerDiscount = {
    discount:           number;
    numberOfPassengers: number;
    passengerType:      string;
};
