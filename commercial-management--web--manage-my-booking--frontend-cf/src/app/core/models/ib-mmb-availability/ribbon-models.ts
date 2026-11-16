export interface RibbonRequest {
    slices:         RequestSlice[];
    passengers:     RequestPassenger[];
    marketCode:     string;
    preferredCabin: string;
}

export interface RequestPassenger {
    passengerType: string;
    count:         number;
}

export interface RequestSlice {
    origin:      string;
    destination: string;
    date:        Date;
    daysAfter:   number;
    daysBefore:  number;
}




export interface RibbonResponse {
    contextMetadata:         ContextMetadata;
    inbound:                 Bound;
    outbound:                Bound;
    availability:            boolean;
    specialDiscountsApplied: any[];
    calendarRibbon:          CalendarRibbon;
}

export interface CalendarRibbon {
    inBoundRow:  BoundRow;
    outBoundRow: BoundRow;
}

export interface BoundRow {
    cells: Cell[];
}

export interface Cell {
    adultPrice:        Price;
    perPassengerPrice: Price;
    totalPrice:        Price;
    fareFamily:        string;
    bestPrice:         boolean;
    available:         boolean;
    boundDate:         Date;
    selectedDate:      boolean;
}

export interface Price {
    fare:         number;
    tax:          number;
    total:        number;
    currency:     string;
    ticketingFee: number;
}


export interface ContextMetadata {
    language:   string;
    country:    string;
    currencies: Currency[];
}

export interface Currency {
    code:               string;
    description:        string;
    symbol:             string;
    alignment:          string;
    groupingSeparator:  string;
    decimalSeparator:   string;
    decimals:           number;
    recommendedDisplay: string;
}

export interface Bound {
    destination:     string;
    origin:          string;
    destinationCity: City;
    originCity:      City;
}

export interface City {
    code:        string;
    description: string;
    countryCode: string;
    country:     Country;
}

export interface Country {
    code:        string;
    description: string;
}

