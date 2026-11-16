@Service(
    'ib-MmB-simulator-booking-availability-module',
    [],
    [])
export class SimulatorBookingAvailabilityTransformerFilter {

    constructor() {}

    applyFilter = (data, copy) => {
        var newCopy = copy;
        var indexSlice;
        var index;
        var slice;
        var numScales = [];
        var i;
        var changed;
        var hour;
        var exist;
        var existCabin;
        if (data.filter.cabin) {
            for (index = newCopy.length - 1; index >= 0; index--) {
                existCabin = false;
                slice = newCopy[index];
                slice.cabins.forEach((cabin) => {
                    if (cabin.title === data.filter.cabin.name && cabin.disabled && !existCabin) {
                        indexSlice = newCopy.indexOf(slice);
                        if (indexSlice > -1) {
                            newCopy.splice(indexSlice, 1);
                        }
                        existCabin = true;
                    }
                });
            }
        }
        if (data.filter.scale.length > 0) {

            data.filter.scale.forEach((slice) => {
                numScales.push(slice.numScale);
            });
            for (index = newCopy.length - 1; index >= 0; index--) {
                slice = newCopy[index];
                changed = false;
                for (i = 0; i < numScales.length; i++) {
                    if (numScales[i] !== slice.segments.length - 1 && !changed) {
                        slice.remove = true;
                        changed = true;
                    } else if(!changed || slice.remove) {
                        slice.remove = false;
                        changed = true;
                    }
                }
                if (slice.remove) {
                    indexSlice = newCopy.indexOf(slice);
                    newCopy.splice(indexSlice, 1);
                }
            }

        }
        if (data.filter.company) {
            for (index = newCopy.length - 1; index >= 0; index--) {
                slice = newCopy[index];
                if (!slice.info.cashAvios) {
                    indexSlice = newCopy.indexOf(slice);
                    newCopy.splice(indexSlice, 1);
                }
            }
        }
        if (data.filter.rangeHoursArrival) {
            if (data.filter.rangeHoursArrival.active) {
                for (index = newCopy.length - 1; index >= 0; index--) {
                    slice = newCopy[index];
                    hour = slice.info.arrivalTime.split(':')[0];
                    hour = Number(hour);
                    if (hour < data.filter.rangeHoursArrival.min || hour > data.filter.rangeHoursArrival.max) {
                        indexSlice = newCopy.indexOf(slice);
                        newCopy.splice(indexSlice, 1);
                    }
                }
            }
        }
        if (data.filter.rangeHoursDeparture) {
            if (data.filter.rangeHoursDeparture.active) {
                for (index = newCopy.length - 1; index >= 0; index--) {
                    slice = newCopy[index];
                    hour = slice.info.departureTime.split(':')[0];
                    hour = Number(hour);
                    if (hour < data.filter.rangeHoursDeparture.min || hour > data.filter.rangeHoursDeparture.max) {
                        indexSlice = newCopy.indexOf(slice);
                        newCopy.splice(indexSlice, 1);
                    }
                }
            }
        }
        if (data.filter.rangePrice) {
            if (data.filter.rangePrice.active) {
                for (index = newCopy.length - 1; index >= 0; index--) {
                    slice = newCopy[index];
                    exist = 0;
                    slice.cabins.forEach((cabin, i) => {
                        if (cabin.priceNumber !== null) {
                            if (cabin.priceNumber >= data.filter.rangePrice.min && cabin.priceNumber <= data.filter.rangePrice.max) {
                                exist++;
                            }
                        }
                        if (exist === 0 && i === slice.cabins.length - 1) {
                            indexSlice = newCopy.indexOf(slice);
                            newCopy.splice(indexSlice, 1);
                        }

                    });
                }
            }
        }
        return newCopy;

    }
}
