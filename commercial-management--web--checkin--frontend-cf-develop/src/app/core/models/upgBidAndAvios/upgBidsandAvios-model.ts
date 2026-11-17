export type BidSegment = {
    id: string;
    availableCabins: AvailableCabin[];
};
type AvailableCabin = {
    cabinType: string;
    minimumAllowedBid: number;
    maximumExpectedBid: number;
    avios: number;
    free: number;
};
