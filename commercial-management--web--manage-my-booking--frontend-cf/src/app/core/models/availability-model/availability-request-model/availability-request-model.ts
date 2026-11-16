namespace AvailabilityData {
    export interface availabilityRequest {
        flowId:string,
        slice:sliceRequest[]
    }

    export interface sliceRequest {
        sliceId:string,
        origins:string[],
        destinations:string[],
        date:string
    }
}