namespace RedBarModel {
    export type RedBarRequest = {
        originDestination: originDestinationModel;
        redemption: boolean;
        flightType: string;
        currency: string;
        showModalBackHome: boolean;
    };

    export type Country = {
        code: string;
        description: string;
    };

    export type OriginCity = {
        code: string;
        description: string;
        timezone: string;
        country: Country;
    };

    export type DestinationCity = {
        code: string;
        description: string;
        timezone: string;
        country: Country;
    };

    export type Dates = {
        outboundFlight: string;
        formatedOutboundFlight: Date;
        returnFlight: string;
        formatedReturnFlight: Date;
    };

    export type originDestinationModel = {
        originCity: OriginCity;
        destinationCity: DestinationCity;
        dates: Dates;
        passengers: number;
        numAdults: number;
        numSeniors: number;
        numYoung: number;
        numTeenager: number;
        numInfant: number;
        numChilds: number;
        numberPassengrsWithoutInfant: number;
    };
    export type originDestinationResponse = {
        originCode: string;
        originCity: string;
        destinyCode: string;
        destinyCity: string;
        dateFlight: string;
        returnFlight: string;
        passengers: number;
        tripType  : string;
    };

    export type PassengerInfo = {
        numberPassengers: number;
        numAdults: number;
        numSeniors: number;
        numYouth: number;
        numTeenager: number;
        numChilds: number;
        numInfants: number;
    };
}