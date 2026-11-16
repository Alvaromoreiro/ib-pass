import { MmBUtilService } from "@src/components/services/Utils/ib-MmB-utils";

@Service('ib-Mmb-change-flight-module', [
    'localStorageService', 'ChangeFlightConstants', 'MmBAppConstants', '$filter', 'MmBUtilService'
], [])
export class ChangeFlightTransformer {

    DEFAULT_CABIN_CLASS = 'ECONOMY';
    DEFAULT_MAX_SEARCH_TIME = 330;

    constructor(
        private localStorageService,
        private ChangeFlightConstants,
        private MmBAppConstants: MmBAppConstants,
        private $filter,
        private MmBUtilService: MmBUtilService) {}

    /**
     * Generates the initial model structure
     * @returns the model initializated
     */
    generateInitialModel = () => {
        let daySelected = new Date(this.$filter('date')(this.$filter('DateFormatFilter')(this.localStorageService.get('selectedSegment').departureDateTime).originalDate, 'yyyy/MM/dd'));
        let nowDay = new Date(this.$filter('date')(new Date(), 'yyyy/MM/dd'));
        return {
            'selectedSegmentInfo': this.localStorageService.get('selectedSegment'),
            'timeZonesList': this.getTimeZoneList(daySelected, nowDay),
            'searchEngineModel': this.generateSearchEngineModel(daySelected, nowDay)
        };
    }

    private generateSearchEngineModel = (daySelected, nowDay) => {
        let minTime;
        let maxTime;
        const segmentsSearchDates = this.localStorageService.get('searchDate');
        let searchEngineModel = { 'minDate': new Date(), 'timeZoneSelected': this.getTimeZoneSelected(daySelected, nowDay), 'daySelected': daySelected, 'maxDate': undefined };
        let commercialInfo = this.localStorageService.get('commercialInfo') || {};
        commercialInfo.minSearchTime = commercialInfo.minSearchTime || 0;
        commercialInfo.maxSearchTime = commercialInfo.maxSearchTime || this.DEFAULT_MAX_SEARCH_TIME;
        minTime = (segmentsSearchDates.minSearchDate && this.getMinTime(segmentsSearchDates, searchEngineModel, commercialInfo)) || /*minSearchTime are hours*/ (searchEngineModel.minDate.getTime() + (commercialInfo.minSearchTime * 60 * 60 * 1000));
        maxTime = (segmentsSearchDates.maxSearchDate && this.getMaxTime(segmentsSearchDates, commercialInfo)) || /*maxSearchTime are days */ (new Date()).getTime() + (commercialInfo.maxSearchTime * 24 * 60 * 60 * 1000);

        searchEngineModel.minDate.setTime(minTime);
        if (maxTime) {
            searchEngineModel.maxDate = new Date(maxTime);
        }

        return searchEngineModel;
    }

    private getTimeZoneSelected = (daySelected, nowDay) => {
        var timeZoneSelected;
        if (daySelected.getTime() === nowDay.getTime() && new Date().getHours() >= 12) {
            timeZoneSelected = this.ChangeFlightConstants.FILTERS.AVAILABILITY_FILTER_AFTERNOON_TIMEZONE;
        } else {
            timeZoneSelected = this.ChangeFlightConstants.FILTERS.AVAILABILITY_FILTER_ALL_TIMEZONES;
        }
        return timeZoneSelected;
    }

    private getMinTime = (segmentsSearchDates, searchEngineModel, commercialInfo) => {
        return Math.max(segmentsSearchDates.minSearchDate,
            searchEngineModel.minDate.getTime() + (commercialInfo.minSearchTime * 60 * 60 * 1000));
    }

    private getMaxTime = (segmentsSearchDates, commercialInfo) => {
        return Math.min(segmentsSearchDates.maxSearchDate,
            (new Date()).getTime() + (commercialInfo.maxSearchTime * 24 * 60 * 60 * 1000));
    }

    /**
     * Change the time slot list if the chosen day is equal to the current day 
     * and the time is greater than 12
     * @param {Bool} daySelected Day selected of segment to compare 
     */
    getTimeZoneList = (daySelected, nowDay) => {
        var timeList = [];
        if (!nowDay) nowDay = new Date(this.$filter('date')(new Date(), 'yyyy/MM/dd'));
        if (daySelected.getTime() === nowDay.getTime() && new Date().getHours() >= 12) {
            timeList = [this.ChangeFlightConstants.FILTERS.AVAILABILITY_FILTER_AFTERNOON_TIMEZONE];
        } else {
            timeList = [this.ChangeFlightConstants.FILTERS.AVAILABILITY_FILTER_ALL_TIMEZONES,
                this.ChangeFlightConstants.FILTERS.AVAILABILITY_FILTER_MORNING_TIMEZONE,
                this.ChangeFlightConstants.FILTERS.AVAILABILITY_FILTER_AFTERNOON_TIMEZONE];
        }

        return timeList;
    }

    /**
    * Generates the availability request depending on current model state
    * @param {Object} currentModel  the curren page model state
    * @returns {Object} the availability request to make the call
    */
    generateAvailabilityRequest = (currentModel) => {
        var passengers = this.localStorageService.get('passengers');
        var passengersInfo = {}, servicePassengersInfo = [], i;
        for (i = 0; i < passengers.length; i++) {
            if (!passengersInfo[passengers[i].passengerType]) {
                passengersInfo[passengers[i].passengerType] = {
                    'count': 1
                };
            } else {
                passengersInfo[passengers[i].passengerType].count++;
            }
        }
        for (i in passengersInfo) {
            servicePassengersInfo.push({
                'passengerType': i,
                'count': passengersInfo[i].count
            });
        }
        return {
            'slices': [{
                'origin': currentModel.selectedSegmentInfo.departure.code,
                'destination': currentModel.selectedSegmentInfo.arrival.code,
                'date': this.$filter('date')(currentModel.searchEngineModel.selectedDate, 'yyyy-MM-dd')
            }],
            'passengers': servicePassengersInfo,
            'preferredCabin': currentModel.selectedSegmentInfo.cabinClass && currentModel.selectedSegmentInfo.cabinClass.bookingClass || this.DEFAULT_CABIN_CLASS,
            'marketCode': this.MmBAppConstants.market,
            'allowUnavailableFlights': true
        };
    }

    /**
     * Transform the rest service availability data in an well formed object for the view
     * @param {Object} availabilityData the rest service data received
     * @returns {Object} the availability data transformed
     */
    transformAvailabilityView = (availabilityData) => {
        var transformedAvailability = {
            'slices': []
        };
        var i, j, auxSlice, companyLogo, offerInfo;
        this.localStorageService.set('responseId', availabilityData.responseId);
        this.localStorageService.set('fareFamilyConditionsData', availabilityData.fareFamilyConditions);
        for (i = 0; i < availabilityData.originDestinations.length; i++) {
            for (j = 0; j < availabilityData.originDestinations[i].slices.length; j++) {
                auxSlice = availabilityData.originDestinations[i].slices[j];
                offerInfo = this.getOfferSliceInformation(availabilityData.offers, auxSlice.sliceId);
                companyLogo = this.MmBUtilService.getCompanyLogo(auxSlice.segments[0].flight.operationalDisclosure ? auxSlice.segments[0].flight.operationalDisclosure : auxSlice.segments[0].flight.operationalCarrier && auxSlice.segments[0].flight.operationalCarrier.code ? auxSlice.segments[0].flight.operationalCarrier.code : auxSlice.segments[0].flight.marketingCarrier ? auxSlice.segments[0].flight.marketingCarrier.code : '');
                transformedAvailability.slices.push({
                    'outbound': this.$filter('DateFormatFilter')(auxSlice.departureDateTime).dateTime,
                    'outboundDate': auxSlice.departureDateTime,
                    'inbound': this.$filter('DateFormatFilter')(auxSlice.arrivalDateTime).dateTime,
                    'inboundDate': auxSlice.arrivalDateTime,
                    'company': {
                        'description': auxSlice.segments[0].flight.operationalCarrier && auxSlice.segments[0].flight.operationalCarrier.name,
                        'logo': offerInfo.remainingSeats === 0 && companyLogo.companyDisabledURL || companyLogo.companyURL
                    },
                    'remainingSeats': offerInfo.remainingSeats,
                    'sliceId': auxSlice.sliceId,
                    'originDestinationId': availabilityData.originDestinations[i].originDestinationId,
                    'offerItemIds': offerInfo.offerItemIds,
                    'cabinClass': offerInfo.cabinClass
                });
                transformedAvailability.slices[j]['myflight'] = this.localStorageService.get('selectedSegment').type === this.MmBAppConstants.SEGMENT_TYPES.CONFIRMED && this.localStorageService.get('selectedSegment').departureDateTime === auxSlice.departureDateTime && this.localStorageService.get('selectedSegment').arrivalDateTime === auxSlice.arrivalDateTime;
            }
        }
        return transformedAvailability;
    }

    private getOfferSliceInformation = (offers, sliceId) => {
        var oIndex = 0, iIndex, sFound = false, offerSliceInfo = { 'remainingSeats': 0, 'offerItemIds': [], 'cabinClass': {} };
        while (!sFound && oIndex < offers.length) {
            if (offers[oIndex].originDestinations[0].applicableSlices[0].sliceId === sliceId) {
                sFound = true;
                offerSliceInfo.remainingSeats = offers[oIndex].originDestinations[0].applicableSlices[0].remainingSeats;
                offerSliceInfo.cabinClass['fareFamily'] = offers[oIndex].originDestinations[0].applicableSlices[0].segments[0].fareFamily;
                for (iIndex = 0; iIndex < offers[oIndex].offerItems.length; iIndex++) {
                    offerSliceInfo.offerItemIds.push(offers[oIndex].offerItems[iIndex].offerItemId);
                }
            }
            oIndex++;
        }
        return offerSliceInfo;
    }
}