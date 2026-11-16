import { merge } from 'lodash-es';
@Service('ib-booking-availability-module',
    ['$sce', '$filter', 'localStorageService', 'BookingAppConstants', 'BookingAvailabilityConstants'])
export class IbBookingAvailabilityUtilsService {
    constructor ( private $sce: ng.ISCEService,
        private $filter: ng.FilterFactory,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private BookingAppConstants: BookingAppConstants,
        private BookingAvailabilityConstants: any
    ) {
    }

    returnObservationsWithhtml = (fareFamily: AvailabilityTransformerModel.FareFamilyOptions) => {
        Object.keys(fareFamily).forEach((fare)=>{
            fareFamily[fare].observations.forEach((observation)=>{
                observation.observationText =  this.$sce.trustAsHtml(observation.observationText);
            });
        });

        return fareFamily;
    };

    /**
     * Generates the limits slick carousel dates min and max
     * @param {number} originDestinationIndex - the origin destination index to be parsed
     */
    getOriginDestinationLimitDates = (originDestinationIndex:number) => {
        const currentDate = new Date();
        const limitDates = {
            minDate: new Date(this.$filter('date')(currentDate, 'yyyy-MM-dd')),
            maxDate: new Date(this.$filter('date')(currentDate, 'yyyy-MM-dd'))
        };
        const commercialInfo: AvailabilityTransformerModel.AvailabilityCommercialData =
            this.localStorageService.get('commercialData');
        const availabilityRequestData: AvailabilityTransformerModel.AvailabilityRequestData =
            this.localStorageService.get('availabilityRequestData');

        limitDates.minDate.setHours(0, 0, 0, 0);
        limitDates.maxDate.setHours(0, 0, 0, 0);

        // min Date is previous date or current date plus service min search time hours
        limitDates.minDate = availabilityRequestData?.slices[originDestinationIndex - 1]
            ? new Date(availabilityRequestData.slices[originDestinationIndex - 1].date)
            : new Date(limitDates.minDate.getTime() + (commercialInfo.minSearchTime * 60 * 60 * 1000));

        // max Date is next date or current date plus service max search time days
        limitDates.maxDate = availabilityRequestData.slices[originDestinationIndex + 1]
            ? new Date(availabilityRequestData.slices[originDestinationIndex + 1].date)
            : new Date(limitDates.maxDate.getTime() + (commercialInfo.maxSearchTime * 24 * 60 * 60 * 1000));

        return limitDates;
    };

    isFareCompatible = (
        fareFamilyOffers: AvailabilityTransformerModel.Offer[],
        selectedOffers: AvailabilityTransformerModel.Offer[] = []
    ) => {
        let isCompatible = false;
        fareFamilyOffers.forEach( (offer) => {
            selectedOffers.forEach((selected) => {
                if(offer.offerId === selected.offerId) {
                    isCompatible= true;
                }
            });
        });
        return isCompatible;
    };

    moreThan2Hours = (duration: number): boolean => {
        let isMoreThan2h = false;
        if (duration > 0) {
            const hours = Math.floor(duration / 60);
            const minutes = duration % 60;
            isMoreThan2h = (hours === 2 && minutes >= 0) || (hours > 2 && minutes >= 0);
        }
        return isMoreThan2h;
    };

    generateSegmentWarningMessage = (
        segmentInfo: AvailabilityTransformerModel.SliceSegment,
        previousSegment: AvailabilityTransformerModel.SliceSegment
    ) => {
        const WARNING_MESSAGES = {
            OVERNIGHT_WARNING: 'SSE_AVM_20003',
            TERMINAL_CHANGE_WARNING: 'SSE_AVM_20002',
            AIRPORT_CHANGE_WARNING: 'SSE_AVM_20001',
            LONG_WAITING_WARNING: 'SSE_AVM_20004'
        };
        const IMPORTANT_WARNING_CODES = [WARNING_MESSAGES.AIRPORT_CHANGE_WARNING, WARNING_MESSAGES.TERMINAL_CHANGE_WARNING];
        const getDefaultInfo = (
            warning: AvailabilityTransformerModel.DefaultInfoWarning
        ): AvailabilityTransformerModel.DefaultInfoWarningMessage => {
            return {
                isImportant: IMPORTANT_WARNING_CODES.indexOf(warning.code) !== -1,
                code: warning.code,
                message: warning.description,
                show: true
            };
        };

        const getTerminalInfo = (
            warning: AvailabilityTransformerModel.DefaultInfoWarning,
            arrival: string,
            departure: string
        ): AvailabilityTransformerModel.TerminalInfoWarningMessage => {
            const info = getDefaultInfo(warning);
            if (arrival !== null && departure !== null) {
                merge(info, {
                    hasTerminal: true,
                    arrival: arrival,
                    departure: departure
                });
            }
            return info;
        };

        const getAirportInfo = (
            warning: AvailabilityTransformerModel.DefaultInfoWarning,
            departure: AvailabilityTransformerModel.Departure,
            arrival: AvailabilityTransformerModel.Arrival
        ): AvailabilityTransformerModel.AirportInfoWarningMessage => {
            const info = getDefaultInfo(warning);
            merge(info, {
                arrival: `${arrival.name} (${arrival.code})`,
                departure: `${departure.name} (${departure.code})`
            });
            return info;
        };

        const getScaleTimeInfo = (
            warning: AvailabilityTransformerModel.DefaultInfoWarning,
            isLong: boolean
        ): AvailabilityTransformerModel.ScaleTimeInfoWarningMessage => {
            const info: AvailabilityTransformerModel.DefaultInfoWarningMessage = getDefaultInfo(warning);
            merge(info, { isLong: isLong });
            return info;
        };

        const getOverNightInfo = (
            warning: AvailabilityTransformerModel.DefaultInfoWarning
        ): AvailabilityTransformerModel.OverNightInfoWarningMessage => {

            return {
                isOverNight: true,
                code: warning.code,
                message: warning.description
            };
        };

        const returnedWarnings: AvailabilityTransformerModel.ReturnedWarnings = {
            terminalChange: {
                isImportant: false,
                code: '',
                message: '',
                show: false
            },
            airportChange: {
                isImportant: false,
                code: '',
                message: '',
                show: false
            },
            scaleWaitingTime: {
                isImportant: false,
                code: '',
                message: '',
                show: false
            },
            nightFlight: {
                code: '',
                message: '',
                isOverNight: false
            }
        };
        segmentInfo.warnings = segmentInfo.warnings || [];
        segmentInfo.warnings.forEach( (warning) => {
            switch (warning.code) {
                    case WARNING_MESSAGES.OVERNIGHT_WARNING:
                        returnedWarnings.nightFlight = getOverNightInfo(warning);
                        break;
                    case WARNING_MESSAGES.TERMINAL_CHANGE_WARNING:
                        if (previousSegment !== null) {
                            returnedWarnings.terminalChange = getTerminalInfo(
                                warning,
                                previousSegment.arrival.terminal,
                                segmentInfo.departure.terminal
                            );
                        }
                        break;
                    case WARNING_MESSAGES.AIRPORT_CHANGE_WARNING:
                        if (previousSegment !== null) {
                            returnedWarnings.airportChange = getAirportInfo(
                                warning,
                                segmentInfo.departure,
                                previousSegment.arrival
                            );
                        }
                        break;
                    case WARNING_MESSAGES.LONG_WAITING_WARNING:
                        if (previousSegment !== null) {
                            returnedWarnings.scaleWaitingTime = getScaleTimeInfo(
                                warning,
                                true
                            );
                        }
                        break;
            }
        });

        if (!returnedWarnings.scaleWaitingTime.show && previousSegment !== null) {
            returnedWarnings.scaleWaitingTime = getScaleTimeInfo({
                code: '',
                description: ''
            }, false);
        }
        return returnedWarnings;
    };

    slidesInfo = (
        cells: AvailabilityTransformerModel.Cell[]
    ): AvailabilityTransformerModel.SliceInfoOFCells[]  => {
        const searchFlightType = this.localStorageService.get('searchFlightType');
        const isRedemption = searchFlightType === this.BookingAppConstants.SEARCH_FLIGHT_TYPE.REDEMPTION;
        const slidesInfo: AvailabilityTransformerModel.SliceInfoOFCells[] = [];
        cells.forEach(( cell) => {
            let date = cell.boundDate;
            let price = 0;
            let state = this.BookingAvailabilityConstants.SLICK_STATUS.NOT_AVAILABLE;
            if(isRedemption) {
                date = cell.date;
                price = cell.avios;
                state = this.BookingAvailabilityConstants.SLICK_STATUS.AVAILABLE;
            }else{
                if(cell?.adultPrice !== null && cell?.adultPrice !== undefined) {
                    price = cell.adultPrice.total;
                }
                if(cell?.available) {
                    state = this.BookingAvailabilityConstants.SLICK_STATUS.AVAILABLE;
                }
            }
            slidesInfo.push({
                date: this.$filter('DateFormatFilter')( date ),
                serviceDate: date,
                price: price,
                state: state
            });
        });

        return slidesInfo;
    };

    generateSlidesInfo = (
        dateObject: Date,
        status: string,
        slidePosition: number
    ): AvailabilityTransformerModel.GenerateSliceInfo => {
        const dateString = this.$filter('date')(dateObject, 'yyyy-MM-dd');
        return {
            date: this.$filter('DateFormatFilter')(dateString),
            serviceDate: dateString,
            price: 0,
            state: status,
            slidePosition: slidePosition
        };
    };

    getOfferInfoRecommended (
        offerId:string,
        offers: AvailabilityTransformerModel.Offer[]
    ): AvailabilityTransformerModel.Offer {
        let offerInfo = null;
        for (const offer of offers) {
            if (offer.offerId === offerId) {
                offerInfo = offer;
                break;
            }
        }
        return offerInfo;
    }

}
