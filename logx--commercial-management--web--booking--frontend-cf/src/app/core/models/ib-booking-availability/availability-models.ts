

namespace AvailabilityModels{
    //  Availability - Local Discount Module - Residents
    export type residentDiscountSelector = {
        items : CommonsConstantsType['DISCOUNT_SEARCH_RESIDENT']['items'],
        selected: {description:string, value:string},
        title : string
    };
    export type largeFamilyDiscountSelector = {
        items : CommonsConstantsType['DISCOUNT_SEARCH_FAMILY']['items'],
        selected: {description:string, value:string},
        title : string
    };

    export type ParamsURL ={
        departureDate: {
            day: string;
            month: string;
            year: string;
        };
        returnDate: {
            day: string;
            month: string;
            year: string;
        };
        market: string;
        language: string;
        tripType: number;
        beginCity: string;
        endCity: string;
    };

    export type EndpointResponse ={
        endpoint: string[];
    };
    export type OriginDestinationSearchModel  = {
        originCity: AvailabilityTransformerModel.OriginCity,
        destinationCity: AvailabilityTransformerModel.DestinationCity,
        dates: FlightSearchDates,
        passengers: number,
        numAdults: number,
        numSeniors: number,
        numYoung: number,
        numTeenager: number,
        numInfant: number,
        numChilds: number,
        numberPassengrsWithoutInfant: number
    };
    export type FlightSearchDates = {
        outboundFlight:string,
        formatedOutboundFlight:string,
        formatedReturnFlight:string,
        returnFlight: string
    };
    export type FareFamilyContions = {
        cabinDescription: string,
        cabinType: string,
        commercialCode:string,
        commercialName:string,
        commercialNameES:string,
        conditions:Conditions[],
        conditionsPriority: string[],
        observations:Observations[]
    };
    export type Conditions = {
        code:string,
        extendedInfo:ExtendedInfo,
        name:string,
        text:string,
        units:number
    };
    export type ExtendedInfo = {
        code:string,
        conditionStatus:boolean,
        message:string,
        observationCode:string,
        title:string
    };
    export type Observations = {
        observationCode:number,
        observationText:string
    };
    export type RedirectionPaymentCallbackType = {
        status: boolean,
        redirectStatus: boolean,
        data?: any,
        paypalToken?: any
    };
    export type PaymentRedirectionInfo = {
        paymentStatus: string,
        componentType: boolean,
        redirectionPaymentCallback: RedirectionPaymentCallbackType,
        redirectStatus: boolean;
        paypalToken: string,
        paypalPayerId: string;
        paySucces: boolean;
    };

    export type DomesticDiscountChangeEvent = {
        resident: string,
        largeFamilyType: string
    };
}