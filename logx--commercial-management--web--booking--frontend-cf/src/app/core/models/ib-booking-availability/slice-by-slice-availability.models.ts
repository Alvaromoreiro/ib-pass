export enum AvailabilityTypes {
    REGULAR = 'REGULAR',
    SLICE_BY_SLICE = 'SLICE_BY_SLICE',
    LOADING = 'LOADING'
}
export type OutboundSelectedFlightDate = {
    day: number;
    month: string;
};
export type OutboundSelectedCity = {
    city: string;
    time: string;
};
export type OutboundSelectedDurationType = {
    stops: number;
    text: string;
};
export type OutboundSelectedTravelDays = {
    days: number;
    text: string;
};
export type OutboundSelectedDuration = {
    type: OutboundSelectedDurationType;
    time: string;
};
export type OutboundSelectedPrice = {
    amount: string;
    currency: string;
};
export type OutboundSelectedFare = {
    fareText: string;
    fareType: string;
};
export type OutboundSelected = {
    cabin: string;
    daysOfTravel: OutboundSelectedTravelDays | null;
    destination: OutboundSelectedCity;
    fare: string;
    flightDate: OutboundSelectedFlightDate;
    flightDuration: OutboundSelectedDuration;
    origin: OutboundSelectedCity;
    price: string;
};
export type SlicedAvaibilityDataForFare = {
    responseId: string;
};
export type SlicedCreateFareRequestDataModel = {
    availabilityData: SlicedAvaibilityDataForFare;
    selectedSlices: AvailabilityTransformerModel.SelectedSlice[];
};
