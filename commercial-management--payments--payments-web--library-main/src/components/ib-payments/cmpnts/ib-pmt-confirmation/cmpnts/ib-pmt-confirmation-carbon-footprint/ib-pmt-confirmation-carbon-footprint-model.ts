export interface IbPmtConfirmationCarbonFootprintModel {
    name: string;
    kilosCo2eFormatted: string;
    priceFormatted: string;
    flight: IbPmtConfirmationCarbonFootprintFlight;
}

export interface IbPmtConfirmationCarbonFootprintFlight {
    numPax: number;
    segments: IbPmtConfirmationCarbonFootprintFlightSegment[];
}

export interface IbPmtConfirmationCarbonFootprintFlightSegment {
    from: string;
    to: string;
    cabin: string;
    stops?: string[];
    roundTrip?: boolean;
}
