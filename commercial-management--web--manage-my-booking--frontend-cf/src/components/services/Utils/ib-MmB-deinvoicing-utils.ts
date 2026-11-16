@Service('ib-MmB-services-module', ['localStorageService'])
export class MmBDeinvoicingUtils {
    constructor (
        private localStorageService: ng.local.storage.ILocalStorageService
    ) {}

    checkSpecificWarningCheckOut = (sliceId) => {
        const reshopConditions: any = this.localStorageService.get('reshopConditions');
        return reshopConditions ? this.checkGeneralWarningCheckOut(reshopConditions) || this.checkWarningCheckOutBySliceId(reshopConditions, sliceId) : false;
    };

    getDataModalDeinvoicing = () => {
        const changeFlightsCV:[any] = this.localStorageService.get('changeFlightsCV');
        const slices:[any] = this.localStorageService.get('flightsInfo');
        let flightsSegments = [];
        changeFlightsCV.forEach((flight) => {
            slices.forEach((slice) => {
                if(flight.originalSliceId == slice.sliceId && this.checkSpecificWarningCheckOut(slice.sliceId)){
                    flightsSegments.push({
                        'sliceID': slice.sliceId,
                        'operatedBy': slice.flight.operationalCarrier.code,
                        'flightNumber': slice.flight.operationalFlightNumber,
                        'arrivalTerminal':slice.arrivalCity.terminal,
                        'departureTerminal':slice.departureCity.terminal,
                        'departureDateTime': slice.departureDateParsed.dateTime,
                        'departureDateDay': slice.departureDateParsed.day,
                        'departureDateMonth': slice.departureDateParsed.month,
                        'departureDateYear': slice.departureDateParsed.year,
                        'arrivalDateTime': slice.arrivalDateParsed.dateTime,
                        'arrivalDateDay': slice.arrivalDateParsed.day,
                        'arrivalDateMonth': slice.arrivalDateParsed.month,
                        'arrivalDateYear': slice.arrivalDateParsed.year   
                    });
                }
            });
        });
        return flightsSegments;
    };

    private checkGeneralWarningCheckOut = (reshopConditions) => {
        let isCheckWarningCheckOut = false;
        if (reshopConditions.voluntaryChanges.enabled && reshopConditions.voluntaryChanges.warnings.length > 0) {
            isCheckWarningCheckOut = reshopConditions.voluntaryChanges.warnings.some(warning => (warning.code === 'SLICE_WITH_CHECKED_SEGMENT' || warning.code === 'ORDER_WITH_EARLY_CHECKING_DONE'));
        } else if (reshopConditions.involuntaryChanges.enabled && reshopConditions.involuntaryChanges.warnings.length > 0) {
            isCheckWarningCheckOut = reshopConditions.involuntaryChanges.warnings.some(warning => (warning.code === 'SLICE_WITH_CHECKED_SEGMENT' || warning.code === 'ORDER_WITH_EARLY_CHECKING_DONE'));
        }
        return isCheckWarningCheckOut;
    };

    private checkWarningCheckOutBySliceId = (reshopConditions, sliceId) => {
        let isCheckWarningCheckOut = false;
        let sliceEqual = [];
        let sliceEqualObject = {};
        if (reshopConditions.voluntaryChanges.enabled && reshopConditions.voluntaryChanges.slices.length > 0) {
            sliceEqual = reshopConditions.voluntaryChanges.slices.filter((slice) => slice.sliceId === sliceId);
            sliceEqualObject = sliceEqual[0];
            isCheckWarningCheckOut = this.checkIsFalse(isCheckWarningCheckOut, sliceEqualObject);
        } else if (reshopConditions.involuntaryChanges.enabled && reshopConditions.involuntaryChanges.slices.length > 0) {
            sliceEqual = reshopConditions.involuntaryChanges.slices.filter((slice) => slice.sliceId === sliceId);
            sliceEqualObject = sliceEqual[0];
            isCheckWarningCheckOut = this.checkIsFalse(isCheckWarningCheckOut, sliceEqualObject);
        }
        return isCheckWarningCheckOut;
    };

    private isSliceWithCheckedSegmentOrEarly = (slice):boolean => {
        let value:boolean = false;
        if (slice.enabled && slice.warnings.length > 0) {
            value = slice.warnings.some(warning => (warning.code === 'SLICE_WITH_CHECKED_SEGMENT' || warning.code === 'ORDER_WITH_EARLY_CHECKING_DONE'));
        }
        return value;
    };

    checkWarningCheckOut = () => {
        const reshopConditions: any = this.localStorageService.get('reshopConditions');
        return reshopConditions ? this.checkGeneralWarningCheckOut(reshopConditions) || this.checkWarningCheckOutBySlice(reshopConditions) : false;
    };

    private checkWarningCheckOutBySlice = (reshopConditions) => {
        let isCheckWarningCheckOut = false;
        if (reshopConditions.voluntaryChanges.enabled && reshopConditions.voluntaryChanges.slices.length > 0) {
            reshopConditions.voluntaryChanges.slices.forEach((slice) => {
                isCheckWarningCheckOut = this.checkIsFalse(isCheckWarningCheckOut, slice); 
            });
        } else if (reshopConditions.involuntaryChanges.enabled && reshopConditions.involuntaryChanges.slices.length > 0) {
            reshopConditions.involuntaryChanges.slices.forEach((slice) => {
                isCheckWarningCheckOut = this.checkIsFalse(isCheckWarningCheckOut, slice); 
            });
        }
        return isCheckWarningCheckOut;
    };

    private checkIsFalse = (isCheckWarningCheckOut, slice) => {
        return (!isCheckWarningCheckOut ? this.isSliceWithCheckedSegmentOrEarly(slice) : true);
    };
};
