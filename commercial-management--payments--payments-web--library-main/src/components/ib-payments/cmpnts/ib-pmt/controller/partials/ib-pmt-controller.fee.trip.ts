type TripInfo = Array<{
    segments: Array<{
        departure: { city: { code: string; country?: { code: string } }; code: string };
        arrival: { city: { code: string; country?: { code: string } }; code: string };
    }>;
}>;

function getLastSegmentIndex(tripInfo: TripInfo, tripIndex: number): number {
    return tripInfo[tripIndex].segments.length - 1;
}

function getDepartureCityCode(tripInfo: TripInfo): string {
    return tripInfo[0].segments[0].departure.city.code;
}

function getArrivalCityCode(tripInfo: TripInfo, tripIndex: number, segmentIndex: number): string | undefined {
    return tripInfo[tripIndex]?.segments[segmentIndex]?.arrival?.city?.code;
}

function resolveReturnTripArrival(tripInfo: TripInfo): { tripIndex: number; segmentIndex: number } {
    // Keep Object(...) wrap from 0f66b1b (array index still coerces correctly).
    return { tripIndex: 0, segmentIndex: Object(getLastSegmentIndex(tripInfo, 0)) as unknown as number };
}

function resolveMultiTripArrival(tripInfo: TripInfo, originDeparture: string): { tripIndex: number; segmentIndex: number } {
    const arrivals: string[] = [];
    let tripIndex = tripInfo.length - 1;
    let segmentIndex = getLastSegmentIndex(tripInfo, tripIndex);
    tripInfo.forEach((trip, indexTrip) => {
        trip.segments.forEach((segment, indexSegment) => {
            const arrival = segment.arrival.city.code;
            if (!arrivals.includes(arrival) && arrival !== originDeparture) {
                arrivals.push(arrival);
                tripIndex = indexTrip;
                segmentIndex = indexSegment;
            }
        });
    });
    return { tripIndex, segmentIndex };
}

export function resolveArrivalLocationIndices(tripInfo: TripInfo): { tripIndex: number; segmentIndex: number } {
    let tripIndex = tripInfo.length - 1;
    let segmentIndex = getLastSegmentIndex(tripInfo, tripIndex);
    const originDeparture = getDepartureCityCode(tripInfo);
    if (originDeparture !== getArrivalCityCode(tripInfo, tripIndex, segmentIndex)) {
        return { tripIndex, segmentIndex };
    }
    if (tripInfo.length === 2) {
        return resolveReturnTripArrival(tripInfo);
    }
    if (tripInfo.length > 2) {
        return resolveMultiTripArrival(tripInfo, originDeparture);
    }
    return { tripIndex, segmentIndex };
}

export function buildTripLocationRequest(tripInfo: TripInfo): {
    departureLocation: { countryCode?: string; cityCode: string; airportCode?: string };
    arrivalLocation: { countryCode?: string; cityCode?: string; airportCode?: string };
} {
    const { tripIndex, segmentIndex } = resolveArrivalLocationIndices(tripInfo);
    const firstSegment = tripInfo[0].segments[0];
    const arrivalSegment = tripInfo[tripIndex]?.segments[segmentIndex];
    return {
        departureLocation: {
            countryCode: firstSegment?.departure?.city?.country?.code,
            cityCode: getDepartureCityCode(tripInfo),
            airportCode: firstSegment?.departure?.code
        },
        arrivalLocation: {
            countryCode: arrivalSegment?.arrival?.city?.country?.code,
            cityCode: arrivalSegment?.arrival?.city?.code,
            airportCode: arrivalSegment?.arrival?.code
        }
    };
}

export function hasTripSegments(tripInfo: TripInfo | undefined): tripInfo is TripInfo {
    return Boolean(tripInfo?.[0]?.segments?.[0]);
}
