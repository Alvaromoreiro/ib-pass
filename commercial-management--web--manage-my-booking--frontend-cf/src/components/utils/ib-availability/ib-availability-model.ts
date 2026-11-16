interface IAvailabilityServiceStrat {
    availability(request:AvailabilityData.availabilityRequest, update?:boolean):angular.IPromise<unknown>;
    generateRequest
    generateModalObject
    callModalService
}
type modalAvailabilityData = {
    availabilityData:AvailabilityData.CompleteAvailability;
};
type modalAvailabilityDataUnified = {
    availabilityData:AvailabilityData.CompleteAvailability | AvailabilityData.UncompleteAvailability,
    modelRibbon:unknown,
    selectedSlide: AvailabilityData.selectedSlide[],
};

type modelRibbon = {
    list:Array<AvailabilityData.modelRibbonData>,
    flights:AvailabilityData.modelRibbonFlights
};

//TODO revisar si este namespace ImportOrderData tiene sentido que esté aquí, o hay que moverlo a otro fichero
namespace SegmentData {

    export interface ISegmentAVModel {
        type: string;
        mmbAllowed: boolean;
        ckiStatus: SliceData.CkiStatus;
        noShow: boolean;
        flyNow: boolean;
        flown: boolean;
        departure: SliceData.Airport;
        arrival: SliceData.Airport;
        departureCity: SliceData.City;
        arrivalCity: SliceData.City;
        flight: SliceData.Flight;
        cabin: SliceData.Cabin;
        overnight: boolean;
        id: string;
        duration: number;
        waitingTime: number;
        operatorLocator?: null;
        stop?: null;
        departureDateTime: string;
        departureUtcDateTime: string;
        arrivalDateTime: string;
        arrivalUtcDateTime: string;
        status: SliceData.SegmentStatus;
        warnings: SliceData.IWarning[];
        //Own properties
        departureDateParsed: IModelDateParsed;
        arrivalDateParsed: IModelDateParsed;
        companyURL: string;
        departureDateTimeParsed: string;
        arrivalDateTimeParsed: string;
        durationParsed: string;//getParsedDate del duration
        fareFamilyConditions: IModelFareFamily[]
        segmentId: string;
        sliceId: string;
        waitingTimeParsed: string;
        setParsedFamilyCondition: (fareFamily: FareData.FareFamily[]) => void;
        setSliceId: (sliceId: string) => void;
    }

    export interface IModelFareFamily  {
        cabin:string;//Depends on languague, if ES, use comercialNameEs, else use commercialName
        cabinType: string;
        code:string;
        name:string;
        title:string;
        message:string;
        units:number;


    }

    export interface IModelDateParsed {
        dateTime: string,
        weekDay: string,
        day: number,
        monthNumber: number,
        month: string,
        year: number,
        originalDate: string,
        formatedDate: string
    }
}