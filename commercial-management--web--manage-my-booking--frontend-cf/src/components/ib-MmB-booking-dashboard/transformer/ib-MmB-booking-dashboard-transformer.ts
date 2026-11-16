import { MmBUtilService } from '@src/components/services/Utils/ib-MmB-utils';
import { MmBUtilsSharedService } from '@src/components/services/Utils/ib-MmB-utils-shared-service';
import angular from 'angular';
import dayjs from 'dayjs';

@Service(
    'ib-MmB-booking-dashboard-module',
    ['localStorageService', '$filter', 'BookingDashboardConstants', 'MmBUtilService', 'MmBUtilsSharedService', 'MmBAppConstants', 'CurrencyService', 'ContentPreprocessorService', '$translate', 'CommonsGetWcsPhonesService', 'IbFlagsTransformer', 'AncillariesDashboardTransformer', 'AncillariesTransformerService'],
    [])
export class BookingDashboardTransformer {

    private haveIberiaFlights: boolean = false;
    private transformedInfo: any = {
        bookingGeneralInfo: {},
        summaryModel: {},
        yourFlightsModel: {},
        passengersModel: {},
        managementModel: {},
        managementMeals: {},
        prefixesList: [],
        ancillariesInfo: null,
        changeFlightsModel: {},
        completeYourTripStopOver: false,
        isAncillariesInTime: {
            isIntime: false,
            isSpecialMealsInTime: false
        },
        showRedirectionCheckin: false,
        isCurrencyLong: false,
        seatBid: {},
        voucherSummaryModel: [],
        currency: null,
        voucherPriceInfo: {},
        cashPriceInfo: {},
        bidableInfo: null,
        orderFlags: null,
        orderCapabilities: false,
        rawSlicesInfo: null,
        IsIBV: false,
        flags: {}
    };

    constructor(
        private localStorageService,
        private $filter,
        private BookingDashboardConstants,
        private MmBUtilService: MmBUtilService,
        private MmBUtilsSharedService:MmBUtilsSharedService,
        private MmBAppConstants,
        private CurrencyService,
        private ContentPreprocessorService,
        private $translate,
        private CommonsGetWcsPhonesService,
        private IbFlagsTransformer,
        private AncillariesDashboardTransformer,
        private AncillariesTransformerService) {}

    transformBookingDashBoardInfo = (getBookingInfo, ancillariesInfo, breakDownInfo) => {
        let itemsByType, infCheckDay = [],
            fullInfCheckDay, relatedContentByKey, specialNeedsByPassenger;
        
        let phonesListIBHolidays = this.handlePhonesListIBHolidays();
        let {ticketsByPassenger, issueDateTime} = this.ticketsByPassengerAndIssueDateTime(getBookingInfo);

        this.transformedInfo.currency = this.CurrencyService.getCurrenciesAsMap(getBookingInfo.contextMetadata.currencies);
        this.transformedInfo.orderFlags = getBookingInfo.orderFlags;
        this.transformedInfo.rawSlicesInfo = getBookingInfo.order.slices
        ancillariesInfo ? this.transformedInfo.ancillariesInfo = this.AncillariesTransformerService.generateAncillariesManageMyBooking(ancillariesInfo, getBookingInfo) : ancillariesInfo = [];
        this.CommonsGetWcsPhonesService.getPhoneByCode(this.MmBAppConstants.WCS.PHONE_TYPES.SALES);

        this.transformMarket(getBookingInfo);

        itemsByType = this.setItemsByType(getBookingInfo);

        specialNeedsByPassenger = this.generateSpecialNeedByPassenger(itemsByType);


        relatedContentByKey = this.setRelatedContentByKey(getBookingInfo);

        fullInfCheckDay = this.handleFullInfCheckDay(getBookingInfo);
        infCheckDay = this.setInfCheckDay(fullInfCheckDay);

        let paramsTransformerInfo = {getBookingInfo, infCheckDay, itemsByType, issueDateTime, relatedContentByKey, ancillariesInfo, phonesListIBHolidays, breakDownInfo, ticketsByPassenger, specialNeedsByPassenger};
        this.handleTransformedInfo(paramsTransformerInfo);
        this.handleFlexibilizationCapabilitiesInformation(getBookingInfo);

        if (this.isRefundVoucherSection()) {
            this.transformedInfo.flags.showRefundLink = false;
        };

        if (!this.transformedInfo.voucherPriceInfo) {
            this.transformedInfo.flags.showRefundVoucherSection = false;
        } else {
            this.transformedInfo.voucherSummaryModel = this.MmBUtilService.generateSummaryModel(this.localStorageService.get('voucherOrderItems'), getBookingInfo.order.slices, this.localStorageService.get('voucherCurrenciesList'), this.localStorageService.get('voucherPartialRefund'));
        };

        if (this.transformedInfo.ancillariesInfo) {
            this.transformedInfo.isCurrencyLong = this.transformedInfo.ancillariesInfo.isCurrencyLong;
            this.transformedInfo.ancillariesInfo.ancillariesAvailable = this.AncillariesDashboardTransformer.removeAncillariesIfAlreadyPurchased(this.transformedInfo, breakDownInfo);
        };

        return { model: this.transformedInfo, breakDownInfo: breakDownInfo ? breakDownInfo : null };
    };

    private handleTransformedInfo = (paramsTransformerInfo) => {
        let {getBookingInfo, infCheckDay, itemsByType, issueDateTime, relatedContentByKey, ancillariesInfo, phonesListIBHolidays, breakDownInfo, ticketsByPassenger, specialNeedsByPassenger} = paramsTransformerInfo;
        let paramsSummaryInfo = {trips: getBookingInfo.order.slices, passengers: getBookingInfo.passengers, infCheckDay, itemsByType, issueDateTime};
        this.transformedInfo.summaryModel = this.generateSummaryInfo(paramsSummaryInfo);
        this.transformedInfo.bookingGeneralInfo = this.generateBookingGeneralInfo(getBookingInfo.order.slices, getBookingInfo, relatedContentByKey);
        this.transformedInfo.yourFlightsModel = this.generateFlightsInfo(getBookingInfo.order.slices, getBookingInfo);
        this.transformedInfo.managementMeals = this.AncillariesDashboardTransformer.generateManagementMeals(getBookingInfo);
        this.transformedInfo.changeFlightsModel = this.generateFlightsInfo(getBookingInfo.order.slices, getBookingInfo);
        let paramsPassengerInfo = {flowId: getBookingInfo.flowId, passengers: getBookingInfo.passengers, primaryContactInfo: getBookingInfo.order.primaryContactInfo, order: getBookingInfo.order, obProgram: getBookingInfo.obProgram, relatedContentByKey, ticketsByPassenger, itemsByType, specialNeedsByPassenger};
        this.transformedInfo.passengersModel = this.generatePassengersInfo(paramsPassengerInfo);
        let paramsGenerateManagement = {itemsByType,getBookingInfo,ancillariesInfo,phonesListIBHolidays,infCheckDay,breakDownInfo};
        this.transformedInfo.managementModel = this.generateManagementInfo(paramsGenerateManagement);
        this.transformedInfo.pricesInfo = getBookingInfo.order.price;
        this.localStorageService.set('segmentsInfo', this.MmBUtilsSharedService.generateSegmentsInfo(this.transformedInfo.managementModel.flights));
        this.transformedInfo.completeYourTripStopOver = this.generateCompleteYourTripInfoStopOver(getBookingInfo.qualifiers);
        this.transformedInfo.qualifiers = this.checkQualifiers(getBookingInfo.qualifiers);
        this.transformedInfo.IsIBV = this.checkQualifierIBV(getBookingInfo);
        this.localStorageService.set('qualifierBoolean', this.transformedInfo.qualifiers);
        this.transformedInfo.seatBid = this.generateSeatBid(getBookingInfo);
        this.transformedInfo.bidableInfo = this.generateBidableInfo();
        this.transformedInfo.isPnrGroup = false;
        let paramsTransformedInfoAncillariesInfo = {breakDownInfo, transformedInfo: this.transformedInfo, haveIberiaFlights: this.haveIberiaFlights};
        this.AncillariesDashboardTransformer.handleTransformedInfoAncillariesInfo(paramsTransformedInfoAncillariesInfo);
        this.transformedInfo.showRedirectionCheckin = this.checkTimeToRedirectCKI(this.transformedInfo) && !this.transformedInfo.isAncillariesInTime && this.haveIberiaFlights;
        this.transformedInfo.showSpecialMeals = this.transformedInfo.ancillariesInfo ? this.AncillariesDashboardTransformer.isSpecialMealsAvailable(this.transformedInfo) : false;
    
        this.transformedInfo.flags = this.IbFlagsTransformer.generateFlagsMenu(getBookingInfo);
        this.transformedInfo.voucherPriceInfo = this.localStorageService.get('voucherPriceInfo');
        this.transformedInfo.cashPriceInfo = this.localStorageService.get('cashPriceInfo');
    };

    private setInfCheckDay = (fullInfCheckDay) => {
        let InfCheckDayInit = [];
        if (fullInfCheckDay) {
            InfCheckDayInit = [{
                openDate: fullInfCheckDay.formatedDate
            }];
        };
        return InfCheckDayInit;
    };

    private setRelatedContentByKey = (getBookingInfo) => {
        let relatedContentByKeyInit: any; 
        if (getBookingInfo.relatedContent && getBookingInfo.relatedContent.length > 0) {
            relatedContentByKeyInit = this.MmBUtilService.getElementsByProperty(getBookingInfo.relatedContent, 'key', null);
        }; 
        return relatedContentByKeyInit;
    };

    private setItemsByType = (getBookingInfo) => {
        let itemsByTypeInit:any, typeAdd:any = {};
         if (getBookingInfo.order.orderItems) {
            if (getBookingInfo.relatedContent && getBookingInfo.relatedContent.length > 0) {
                typeAdd = {
                    type: 'document'
                };
                getBookingInfo.order.orderItems.push(typeAdd);
            }
            itemsByTypeInit = this.MmBUtilService.getElementsByProperty(getBookingInfo.order.orderItems, 'type', true);
        };
        return itemsByTypeInit;
    };

    private handlePhonesListIBHolidays = () => {
        let phonesListIBHolidays = this.localStorageService.get('phonesListIBV');
        if (phonesListIBHolidays != null) {
            phonesListIBHolidays.packagedProduct = false;
            this.localStorageService.set('phonesListIBV', phonesListIBHolidays);
        };
        return phonesListIBHolidays;
    };

    private handleFullInfCheckDay = (getBookingInfo) => {
        const now = new Date();
        let dateAux = new Date();
        let checkinDateFound = false;
        let checkinDate = getBookingInfo.order.slices[0].segments[0].departureDateTime;
        let fullInfCheckDayInit = this.$filter('DateFormatFilter')(checkinDate);
        angular.forEach(getBookingInfo.order.slices, (slice) => {
            angular.forEach(slice.segments, (segment) => {
                checkinDate = this.$filter('DateFormatFilter')(segment.departureDateTime);
                dateAux = new Date(checkinDate.originalDate);
                if (!checkinDateFound && dateAux > now) {
                    checkinDateFound = true;
                    fullInfCheckDayInit = checkinDate;
                }
            });
        });
        return fullInfCheckDayInit;
    };

    private ticketsByPassengerAndIssueDateTime = (getBookingInfo) => {
        let issueDateTime;
        let ticketsByPassenger = [];
        if (getBookingInfo.tickets) {
            issueDateTime = this.$filter('DateFormatFilter')(getBookingInfo.tickets[0].issueDateTime);
            ticketsByPassenger = this.handleTickets(getBookingInfo);
        };
        return {ticketsByPassenger, issueDateTime};
    };

    private handleTickets = (getBookingInfo) => {
        let ticketsByPassengerInit = [];
        for (let i = 0; i < getBookingInfo.tickets.length; i++) {
            if (getBookingInfo.tickets[i].type !== 'EMD') {
                ticketsByPassengerInit[getBookingInfo.tickets[i].passengerId] = ticketsByPassengerInit[getBookingInfo.tickets[i].passengerId] ? ticketsByPassengerInit[getBookingInfo.tickets[i].passengerId].concat(getBookingInfo.tickets[i].ticketNumbers) : getBookingInfo.tickets[i].ticketNumbers;
            };
        };
        return ticketsByPassengerInit;
    };

    private generateSpecialNeedByPassenger = (itemsByType) => {
        let j:number, specialNeedsByPassenger = {}, isRepeated:boolean = false, params = {};
        if (itemsByType && itemsByType.specialNeed) {
            for (let i = 0; i < itemsByType.specialNeed.length; i++) {
                j = 0;
                isRepeated = false;
                params = { specialNeedsByPassenger, itemsByType, isRepeated, i, j };
                specialNeedsByPassenger = this.addSpecialNeedByPassenger(params);
            };
        };
        
        return specialNeedsByPassenger;
    };

    private handleWhile = (params) => {
        let {specialNeedsByPassenger, itemsByType, isRepeated, i, j} = params;
        while (!isRepeated && j < specialNeedsByPassenger[itemsByType.specialNeed[i].passengerId].length) {
            if (specialNeedsByPassenger[itemsByType.specialNeed[i].passengerId][j].serviceCode === itemsByType.specialNeed[i].serviceCode && specialNeedsByPassenger[itemsByType.specialNeed[i].passengerId][j].text === itemsByType.specialNeed[i].text) {
                isRepeated = true;
            };
            j++;
        };
        return isRepeated;
    };

    private addSpecialNeedByPassenger = (params) => {
        let {specialNeedsByPassenger, itemsByType, isRepeated, i, j} = params;
        if (!specialNeedsByPassenger[itemsByType.specialNeed[i].passengerId]) {
            specialNeedsByPassenger[itemsByType.specialNeed[i].passengerId] = [itemsByType.specialNeed[i]];
        } else {
            let paramsWhile = {specialNeedsByPassenger, itemsByType, isRepeated, i, j};
            isRepeated = this.handleWhile(paramsWhile);
            if (!isRepeated) specialNeedsByPassenger[itemsByType.specialNeed[i].passengerId].push(itemsByType.specialNeed[i]);
        };
        return specialNeedsByPassenger;
    };
    
    private isRefundVoucherSection = () => {
        return (this.transformedInfo?.flags?.showRefundVoucherSection && !this.transformedInfo.voucherPriceInfo && !this.transformedInfo.flags.showRefundCashSection);
    };

    private handleFlexibilizationCapabilitiesInformation = (getBookingInfo) => {
        if (getBookingInfo.flexibilizationCapabilitiesInformation) {
            let reshopConditions = this.localStorageService.get('reshopConditions');
            this.transformedInfo.flexibilizationTextDatesRange = this.MmBUtilService.formatDisruptionAndFlexibilizationDates(getBookingInfo.flexibilizationCapabilitiesInformation.flightRange, 'FLEXIBILIZATION_RANGE');
            this.transformedInfo.orderCapabilities = true;
            if (reshopConditions) {
                if (reshopConditions.callcenterInfo.enabled) {
                    this.transformedInfo.flags.displayCCPhone = true;
                    this.transformedInfo.flags.hideChangeFlightMenuOption = true;
                } else if (reshopConditions.involuntaryChanges.enabled) {
                    this.transformedInfo.flags.showFlexibilizationChangeSection = true;
                    this.transformedInfo.flags.showVoluntaryChangeFlightSection = false;
                    this.transformedInfo.flags.showVoluntaryFlexibleFlightChange = false;
                } else if (reshopConditions.voluntaryChanges.enabled) {
                    this.transformedInfo.flags.showFlexibilizationChangeSection = false;
                    this.transformedInfo.flags.showVoluntaryChangeFlightSection = true;
                    this.transformedInfo.flags.showVoluntaryFlexibleFlightChange = true;
                }
            } else {
                this.transformedInfo.flags.displayCCPhone = true;
                this.transformedInfo.flags.hideChangeFlightMenuOption = true;
            };
        };
    };

    private transformMarket = (getBookingInfo): boolean => {
        let isMarketSaved = false;
        const warnings = getBookingInfo.warnings;
        if (warnings && warnings.length > 0) {
            for (let index = 0; index < warnings.length; index++) {
                if (warnings[index].code === 'SSE_MMB_0005') {
                    isMarketSaved = true;
                    this.localStorageService.set('marketSaved', getBookingInfo.contextMetadata.country);
                }
            }
        }
        return isMarketSaved;
    };

    private generateFormatSpecialNeeds = (needsByPassenger) => {
        let arraySpecialNeeds = [], structureSpecialNeeds: any = { values: [] };
        angular.forEach(needsByPassenger, (formatValue) => {
            arraySpecialNeeds.push({
                serviceCode: formatValue.serviceCode,
                text: formatValue.text,
                description: formatValue.description,
                status: (formatValue.serviceCode !== this.MmBAppConstants.SPECIAL_NEEDS.CODE.SVAN) ? formatValue.status : this.statusSVAN(formatValue)
            });
        });
        for (let i = 0; i < arraySpecialNeeds.length; i++) {
            switch (arraySpecialNeeds[i].serviceCode) {
                    case this.MmBAppConstants.SPECIAL_NEEDS.CODE.BLND:
                        structureSpecialNeeds.specialVision = true;
                        break;
                    case this.MmBAppConstants.SPECIAL_NEEDS.CODE.DPNA:
                        structureSpecialNeeds.specialIntellectual = true;
                        break;
                    case this.MmBAppConstants.SPECIAL_NEEDS.CODE.DEAF:
                        structureSpecialNeeds.specialHearing = true;
                        break;
                    case this.MmBAppConstants.SPECIAL_NEEDS.CODE.SVAN:
                        structureSpecialNeeds.specialGuideDog = true;
                        structureSpecialNeeds.specialGuideDogStatus = arraySpecialNeeds[i].status.code;
                        break;

                    default:
                        if (this.MmBAppConstants.SPECIAL_NEEDS.CODE.WHEEL_CHAIR.includes(arraySpecialNeeds[i].serviceCode)) {
                            structureSpecialNeeds.specialWheelchair = true;
                            structureSpecialNeeds.specialWheelchairValue = arraySpecialNeeds[i].serviceCode;
                        }
                        break;
            }

            structureSpecialNeeds.values.push({
                serviceCode: arraySpecialNeeds[i].serviceCode,
                text: arraySpecialNeeds[i].text,
                description: arraySpecialNeeds[i].description,
                status: arraySpecialNeeds[i].status
            });
        }
        return structureSpecialNeeds;
    };

    private checkTimeToRedirectCKI = (transformedInfo) => {
        let currentDate = dayjs(new Date()), dateFlight = null, showRedirectionLink = false;
        angular.forEach(transformedInfo?.yourFlightsModel?.allSegments, (segment) => {
            if (this.BookingDashboardConstants.IAG_MARKETING_CODE_CARRIER.indexOf(segment.flight.operationalCarrier.code) !== -1) {
                this.haveIberiaFlights = true;
                dateFlight = dayjs(segment.departureDateParsed.originalDate);
                if (dateFlight.diff(currentDate, 'hour') <= Number(2)) {
                    showRedirectionLink = true;
                }
            }
        });
        return showRedirectionLink;
    };

    private checkQualifiers = (qualifiers) => {
        let bool = true;
        angular.forEach(qualifiers, (qualifier) => {
            if (qualifier.name === this.MmBAppConstants.QUALIFIERS) {
                bool = false;
            }
        });
        return bool;
    };

    private generateBookingGeneralInfo = (slices, getBookingInfo, relatedContentByKey) => {
        const bookingInfo: any = {};
        bookingInfo.bookingCode = this.localStorageService.get('PNR');
        bookingInfo.arrivalCity = slices[0].segments[slices[0].segments.length - 1].arrivalCity.description;
        bookingInfo.departureInfo = angular.copy(this.transformedInfo.summaryModel.departureInfo);
        bookingInfo.returnInfo = angular.copy(this.transformedInfo.summaryModel.returnInfo);
        bookingInfo.numberPassengers = getBookingInfo.passengers.length;
        bookingInfo.backgroundImageUrl = this.MmBUtilService.getBackGroundURL(slices[0].segments[slices[0].segments.length - 1].arrival.city.code);
        bookingInfo.flowId = getBookingInfo.flowId;
        bookingInfo.tickets = getBookingInfo.tickets ? getBookingInfo.tickets : null;
        if (relatedContentByKey && relatedContentByKey.APIS_DOCUMENT_INFO)
            bookingInfo.apis = relatedContentByKey.APIS_DOCUMENT_INFO;
        return bookingInfo;
    };

    private generateSummaryInfo = (paramsSummaryInfo) => {
        let { trips, passengers, infCheckDay, itemsByType, issueDateTime } = paramsSummaryInfo;
        const summaryInfo: any = {
            departureInfo: null,
            returnInfo: null,
            numberPassengers: 0,
            timeLineInfo: null,
            infoCheckIn: null
        };
        const flights = [];
        trips = trips || [];

        this.generateFlightsAndSummary({trips, summaryInfo, flights});

        summaryInfo.numberPassengers = passengers.length;
        summaryInfo.timeLineInfo = this.generateTimeLineInfo(flights, summaryInfo, issueDateTime);
        summaryInfo.infoCheckIn = infCheckDay;
        summaryInfo.infoAncillaries = itemsByType ? itemsByType : [];
        return summaryInfo;
    };

    private generateFlightsAndSummary = (params) => {
        let { trips, summaryInfo, flights } = params;
        let actTrip, actSegment, flyWay;
        for (let tIndex = 0; tIndex < trips.length; tIndex++) {
            for (let sIndex = 0; sIndex < trips[tIndex].segments.length; sIndex++) {
                actTrip = trips[tIndex];
                if (tIndex === 0) {
                    summaryInfo.departureInfo = this.$filter('DateFormatFilter')(actTrip.departureDateTime);
                    flyWay = 'departureInfo';
                }
                if (tIndex > 0 && tIndex === (trips.length - 1)) {
                    summaryInfo.returnInfo = this.$filter('DateFormatFilter')(actTrip.departureDateTime);
                    flyWay = 'returnInfo';
                }
                actSegment = actTrip.segments[sIndex];
                flights.push({
                    step: this.$filter('translate')('TIME_LINE_STEP_INFO_FLIGHT_TO') + ' ' + actSegment.arrivalCity.description,
                    date: summaryInfo[flyWay].formatedDate,
                    stepInfo: ['LLegada al aeropuerto', 'Control de seguridad', 'Embarque', 'Llegada a ' + actSegment.arrivalCity.description],
                    status: actSegment.flown === true ? this.BookingDashboardConstants.STEPS_STATUS.PAST : this.BookingDashboardConstants.STEPS_STATUS.FUTURE,
                    isFlight: true,
                    isCheckIn: false
                });
            };
        };

        return {flights, summaryInfo};
    };

    private generateTimeLineInfo (flights, summaryInfo, issueDateTime) {
        const steps = [],
            departureDate = dayjs(summaryInfo.departureInfo.originalDate),
            actualDate = dayjs(),
            dateDifference = dayjs.duration(departureDate.diff(actualDate));

        steps.push({
            step: this.$filter('translate')('TIME_LINE_STEP_BOOKING_DATE_TEXT'),
            date: (issueDateTime ? issueDateTime.formatedDate : null),
            stepInfo: null,
            status: this.BookingDashboardConstants.STEPS_STATUS.PAST,
            isFlight: false,
            isCheckIn: false
        });
        if (dateDifference && dateDifference.asHours() > 24) {
            steps.push({
                step: this.$filter('translate')('TIME_LINE_STEP_CHECK_IN_ONLINE_TEXT'),
                date: summaryInfo.departureInfo.formatedDate,
                stepInfo: [this.$filter('translate')('TIME_LINE_STEP_INFO_OPEN')],
                status: this.BookingDashboardConstants.STEPS_STATUS.ACTIVE,
                isFlight: false,
                isCheckIn: true
            });
        } else {
            steps.push({
                step: this.$filter('translate')('TIME_LINE_STEP_CHECK_IN_ONLINE_TEXT'),
                date: summaryInfo.departureInfo.formatedDate,
                stepInfo: [this.$filter('translate')('TIME_LINE_STEP_INFO_CLOSE')],
                status: this.BookingDashboardConstants.STEPS_STATUS.PAST,
                isFlight: false,
                isCheckIn: true
            });
        }
        return steps.concat(flights);
    };

    private generateFlightsInfo = (slices, getBookingInfo) => {
        let segments = [],
            flightsInfo: any = {},
            flights: any = {},
            noIberiaFlag = false;
        let allSegments: any = {};
        for (let sliceIndex = 0; sliceIndex < slices.length; sliceIndex++) {
            segments = [];
            let params = {slices, sliceIndex, getBookingInfo, segments, allSegments, noIberiaFlag};
            this.handleGenerateAllSegments(params);
            flights[slices[sliceIndex].sliceId] = {
                departureCity: slices[sliceIndex].segments[0].departure,
                arrivalCity: slices[sliceIndex].segments[slices[sliceIndex].segments.length - 1].arrival,
                departureCountry: slices[sliceIndex].segments[0].departureCity.countryCode,
                arrivalCountry: slices[sliceIndex].segments[slices[sliceIndex].segments.length - 1].arrivalCity.countryCode,
                segments: segments,
                departureDateParsed: this.$filter('DateFormatFilter')(slices[sliceIndex].segments[0].departureDateTime),
                arrivalDateParsed: this.$filter('DateFormatFilter')(slices[sliceIndex].segments[slices[sliceIndex].segments.length - 1].arrivalDateTime),
                durationParsed: this.$filter('DurationFormatFilter')(slices[sliceIndex].duration),
                stopsNumber: slices[sliceIndex].stopsNumber,
                daysToGo: dayjs(slices[sliceIndex].segments[0].departureDateTime).diff(dayjs(new Date(), 'YYYYMMDD HH:mm'), 'day')
            };
        };
        flightsInfo.noIberiaFlag = noIberiaFlag;
        flightsInfo.flights = flights;
        flightsInfo.allSegments = allSegments;
        return flightsInfo;
    };

    handleGenerateAllSegments = (params) => {
        let {slices, sliceIndex, getBookingInfo, segments, allSegments, noIberiaFlag} = params;
        let segmentInfo: any = {};
        for (let segmentIndex = 0; segmentIndex < slices[sliceIndex].segments.length; segmentIndex++) {
            segmentInfo = {
                departureCity: slices[sliceIndex].segments[segmentIndex].departure,
                arrivalCity: slices[sliceIndex].segments[segmentIndex].arrival,
                departureDateParsed: this.$filter('DateFormatFilter')(slices[sliceIndex].segments[segmentIndex].departureDateTime),
                arrivalDateParsed: this.$filter('DateFormatFilter')(slices[sliceIndex].segments[segmentIndex].arrivalDateTime),
                companyURL: this.MmBUtilService.getCompanyURL(slices[sliceIndex].segments[segmentIndex].flight.operationalCarrier.code),
                overnight: slices[sliceIndex].segments[segmentIndex].overnight,
                departureDateTimeParsed: slices[sliceIndex].segments[segmentIndex].departureDateTime.split(' ')[1],
                arrivalDateTimeParsed: slices[sliceIndex].segments[segmentIndex].arrivalDateTime.split(' ')[1],
                departure: slices[sliceIndex].segments[segmentIndex].departure,
                arrival: slices[sliceIndex].segments[segmentIndex].arrival,
                flight: slices[sliceIndex].segments[segmentIndex].flight,
                durationParsed: this.$filter('DurationFormatFilter')(slices[sliceIndex].segments[segmentIndex].duration),
                fareFamilyConditions: this.getFareFamilyConditions(slices[sliceIndex].segments[segmentIndex].cabin.fareFamily, getBookingInfo.fareFamilyConditions),
                segmentId: slices[sliceIndex].segments[segmentIndex].id,
                sliceId: slices[sliceIndex].sliceId,
                status: slices[sliceIndex].segments[segmentIndex].status,
                cabin: slices[sliceIndex].segments[segmentIndex].cabin,
                waitingTimeParsed: this.$filter('DurationFormatFilter')(slices[sliceIndex].segments[segmentIndex].waitingTime),
                flown: slices[sliceIndex].segments[segmentIndex].flown,
                warnings: angular.isUndefined(slices[sliceIndex].segments[segmentIndex].warnings) ? {} : slices[sliceIndex].segments[segmentIndex].warnings,
                operatorLocator: slices[sliceIndex].segments[segmentIndex].operatorLocator,
                stop: slices[sliceIndex].segments[segmentIndex].stop
            };
            //Add flag to showoperatorLocator in case to be required
            if(segmentInfo?.operatorLocator) {
                segmentInfo.operatorLocator.showExternalOperator = this.BookingDashboardConstants.EXTERNAL_OPERATOR_MUSTSHOW_LOCATOR.some((operator)=> operator===segmentInfo.operatorLocator.operator);
                segmentInfo.operatorLocator.operatorURL = segmentInfo.operatorLocator.showExternalOperator ? this.$filter('LinksFilter')(`${segmentInfo.operatorLocator.operator.toUpperCase()}_LINK`) : '';
                segmentInfo.operatorLocator.operatorLinkText = segmentInfo.operatorLocator.showExternalOperator ? this.$filter('translate')(`MMB_FLIGHT_MANAGEMENT_${segmentInfo.operatorLocator.operator.toUpperCase()}_LINK`) : '';
            };
            segments.push(segmentInfo);
            allSegments[segmentInfo.segmentId] = segmentInfo;
            if (noIberiaFlag === false) {
                noIberiaFlag = this.noIberiaFlagControl(slices[sliceIndex].segments[segmentIndex].flight);
            };
        };
        return {allSegments, segments, noIberiaFlag};
    };

    private getFareFamilyConditions = (fareData, fareConditions) => {
        let fareDataConditions = [],
            cabin, fareCondArray;

        for (let fareIndex = 0; fareIndex < fareConditions.length; fareIndex++) {
            if (fareData === fareConditions[fareIndex].commercialCode) {
                cabin = this.$translate.use() !== 'es' || !fareConditions[fareIndex].commercialNameES ? fareConditions[fareIndex].commercialName : fareConditions[fareIndex].commercialNameES;

                fareCondArray = fareConditions[fareIndex].conditions.filter(Boolean);
                fareConditions[fareIndex].conditions = angular.copy(fareCondArray);

                for (let conditionsIndex = 0; conditionsIndex < fareConditions[fareIndex].conditions.length; conditionsIndex++) {
                    fareDataConditions.push({
                        cabin: cabin,
                        cabinType: fareConditions[fareIndex].cabinType,
                        code: fareConditions[fareIndex].conditions[conditionsIndex].code,
                        name: fareConditions[fareIndex].conditions[conditionsIndex].name,
                        title: fareConditions[fareIndex].conditions[conditionsIndex].extendedInfo.title,
                        message: fareConditions[fareIndex].conditions[conditionsIndex].extendedInfo.message,
                        units: fareConditions[fareIndex].conditions[conditionsIndex].units
                    });
                    //SRV: Bug in FlightsCardViewComponent with REFUND
                }
            }
        }
        return fareDataConditions;
    };

    private noIberiaFlagControl = (flight): boolean => {
        let operatorNoIberiaFlagArray = this.MmBAppConstants.OPERATIONAL_IBERIA_GROUP;
        return (!operatorNoIberiaFlagArray.some((operator) => operator === flight.operationalCarrier.code));
    };

    private generatePassengersInfo = (params) => {
        let {flowId, passengers, primaryContactInfo = {}, order, obProgram, relatedContentByKey, ticketsByPassenger, itemsByType, specialNeedsByPassenger} = params;
        const passengersInfo: any = {
            contactData: {},
            passengers: [],
            orders: [],
            allFlags: [],
            flowId: flowId
        };
        const earnPoints = this.localStorageService.get('CalculatedPoints') || null;

        passengersInfo.contactData.primaryContactInfo = this.generatePrimaryContactInfo(primaryContactInfo);
        passengersInfo.contactData.emergencyContactInfo = this.generateEmergencyContactInfoModel(passengers);
        passengersInfo.contactData.onBusinessInfo = obProgram;

        this.processPassengerFlagsAndOrders(order, passengersInfo);

        this.processEstaInfo(relatedContentByKey, passengersInfo);

        let paramsProcessPassengersArray = {passengers, passengersInfo, itemsByType, specialNeedsByPassenger, ticketsByPassenger, earnPoints};
        this.processPassengersArray(paramsProcessPassengersArray);

        return passengersInfo;
    };

    private processPassengerFlagsAndOrders = (order, passengersInfo) => {
        const userSlices = order.slices;
        for (let index2 = 0; index2 < userSlices[0].passengerFlags.length; index2++) {
            passengersInfo.allFlags.push(userSlices[0].passengerFlags[index2]);
            for (let index3 = 0; index3 < userSlices[0].passengerFlags[index2].flags.length; index3++) {
                if (userSlices[0].passengerFlags[index2].flags[index3].type === 'EMERGENCY_CONTACT_MODIFICATION') {
                    passengersInfo.orders.push({
                        passengerId: userSlices[0].passengerFlags[index2].passengerId,
                        flag: userSlices[0].passengerFlags[index2].flags[index3]
                    });
                }
            }
        }
    };

    private processEstaInfo = (relatedContentByKey, passengersInfo) => {
        if (relatedContentByKey && relatedContentByKey.ESTA_DOCUMENT_INFO) {
            passengersInfo.esta = relatedContentByKey.ESTA_DOCUMENT_INFO;
            passengersInfo.esta.value = this.ContentPreprocessorService.processContent(passengersInfo.esta.value);
        }
    };

    private processPassengersArray = (paramsProcessPassengersArray) => {
        let {passengers,passengersInfo,itemsByType,specialNeedsByPassenger,ticketsByPassenger,earnPoints} = paramsProcessPassengersArray;
        angular.forEach(passengers, (passenger) => {
            let paramsBuildPassengerData = {passenger,passengers,itemsByType,specialNeedsByPassenger,ticketsByPassenger,earnPoints,allFlags: passengersInfo.allFlags};
            const passData = this.buildPassengerData(paramsBuildPassengerData);
            passengersInfo.passengers.push(passData);
        });
    };

    private buildPassengerData = (paramsBuildPassengerData) => {
        let {passenger,passengers,itemsByType,specialNeedsByPassenger,ticketsByPassenger,earnPoints,allFlags} = paramsBuildPassengerData;
        let splittedDate;
        const auxPersonalInfo = {
            name: this.getName(passenger),
            surname: this.getSurname(passenger)
        };
        const passData: any = {};
        passData.passengerType = passenger.passengerType;
        if (passenger.passengerType === this.MmBAppConstants.PASSENGER_TYPES.infant) {
            passData.relatedPassengerId = passenger.relatedPassengerId;
            passData.relatedPassenger = this.getPassengerNameById(passenger.relatedPassengerId, passengers);
        }
        if (angular.isDefined(passenger.personalInfo) && passenger.personalInfo.birthDate) {
            splittedDate = passenger.personalInfo.birthDate.split('-');
            passenger.personalInfo.birthDate = splittedDate[2] + '-' + splittedDate[1] + '-' + splittedDate[0];
        }
        passData.personalInfo = auxPersonalInfo;
        passData.passengerId = passenger.passengerId;
        passData.contactInfo = this.generateContactInfo(passenger.contactInfo);
        passData.emergencyContactInfo = this.getEmergencyContactInfo(passenger);
        passData.frequentFlyerInfo = passenger.frequentFlyerInfo;
        passData.additionalFFInfo = this.setCompanyFrequentFlyer(passenger);
        passData.additionalRequiredInfo = {};
        passData.aviosAccumulated = this.getAviosAccumulated(earnPoints);
        passData.eliteAccumulated = this.getEliteAccumulated(earnPoints);
        passData.ticketNumbers = ticketsByPassenger ? ticketsByPassenger[passenger.passengerId] : null;
        passData.specialNeeds = this.generaSpecialNeeds(itemsByType, specialNeedsByPassenger, passenger);
        passData.originalSpecialNeeds = this.generateOriginalSpecialNeeds(passData);
        passData.optionalInformation = passenger.optionalInformation;
        passData.flags = {};
        passData.securityInformation = passenger.securityInformation;
        allFlags.forEach((infoFlags) => {
            if (infoFlags.passengerId === passenger.passengerId) {
                infoFlags.flags.forEach((f) => {
                    passData.flags[f.type] = f.enabled;
                });
            }
        });
        passData.showUpdatePersonalInfo = passData.flags.PASSENGER_NAME_CORRECTION;
        passData.modifiedPersonalInfo = passenger.modifiedPersonalInfo ? passenger.modifiedPersonalInfo : false;
        return passData;
    };

    private generateOriginalSpecialNeeds = (passData) => {
        return (passData.specialNeeds !== null ? angular.copy(passData.specialNeeds) : null);
    };
    
    private generaSpecialNeeds = (itemsByType, specialNeedsByPassenger, passenger) => {
        return (itemsByType?.specialNeed && specialNeedsByPassenger[passenger.passengerId] ?
            this.generateFormatSpecialNeeds(specialNeedsByPassenger[passenger.passengerId]) : 
            null);
    };

     private getAviosAccumulated = (earnPoints) => {
        return (earnPoints ? earnPoints.Avios || null : 0);
    };

    private getEliteAccumulated = (earnPoints) => {
        return (earnPoints ? earnPoints.Elite || null : 0);
    };

    private getEmergencyContactInfo = (passenger) => {
        return (passenger.emergencyContactInfo ? {
            name: passenger.emergencyContactInfo.name,
            phone: passenger.emergencyContactInfo.phone
        } : null);
    };

    private getName = (passenger) => {
        return (passenger.externalPersonalInfo ? passenger.externalPersonalInfo.name : passenger.personalInfo.name);
    };

    private getSurname = (passenger) => {
        return (
            passenger.externalPersonalInfo ? 
            passenger.externalPersonalInfo.firstSurname + ' ' + passenger.externalPersonalInfo.lastSurname : 
            passenger.personalInfo.surname);
    };

    private getPassengerNameById = (passId, passengers) => {
        let passName = '';
        let i = 0;
        while (!passName && i < passengers.length) {
            if (passengers[i].passengerId === passId) {
                if (passengers[i].externalPersonalInfo) {
                    passName = passengers[i].externalPersonalInfo.name + ' ' + passengers[i].externalPersonalInfo.firstSurname + ' ' + passengers[i].externalPersonalInfo.lastSurname;
                } else {
                    passName = passengers[i].personalInfo.name + ' ' + passengers[i].personalInfo.surname;
                }
            }
            i++;
        }
        return passName;
    };

    private generateEmergencyContactInfoModel = (passengers) => {
        const emergencyContactInfo = {
            name: '',
            phone: '',
            countryCode: '',
            code: '',
            phoneDetails: ''
        };
        const prefixMarket = this.MmBUtilsSharedService.getPrefixFromMarket();
        const prefixesList = this.localStorageService.get('phoneCodeList');

        emergencyContactInfo.countryCode = prefixMarket.countryCode;
        emergencyContactInfo.code = prefixMarket.code;

        if(this.isEmergencyContactInfo(passengers)) {
            const passEmergencyContactInfo = passengers[0].emergencyContactInfo;
            this.setEmergencyContactInfo(passEmergencyContactInfo, emergencyContactInfo, prefixesList);
        };
        return emergencyContactInfo;
    };

    private isEmergencyContactInfo = (passengers) => {
        return (Array.isArray(passengers) && passengers.length > 0 && passengers[0].emergencyContactInfo);
    };

    private setEmergencyContactInfo = (passEmergencyContactInfo, emergencyContactInfo, prefixesList) =>  {
        this.setName(passEmergencyContactInfo, emergencyContactInfo);
        this.setPhoneDetails(passEmergencyContactInfo, emergencyContactInfo);

        if(passEmergencyContactInfo.phoneDetails?.countryCode && passEmergencyContactInfo.phoneDetails?.countryCode !== '') {
            this.setPrefixList(prefixesList, passEmergencyContactInfo, emergencyContactInfo);
        };
    };

    private setName = (passEmergencyContactInfo, emergencyContactInfo) => {
        if(passEmergencyContactInfo.name && passEmergencyContactInfo.name !== '') {
            emergencyContactInfo.name = passEmergencyContactInfo.name;
            if (passEmergencyContactInfo.surname && passEmergencyContactInfo.surname !== '') {
                emergencyContactInfo.name += ' ' + passEmergencyContactInfo.surname;
            }
        } else if (passEmergencyContactInfo.surname && passEmergencyContactInfo.surname !== ''){
            emergencyContactInfo.name = passEmergencyContactInfo.surname;
        };
    };
    private setPhoneDetails = (passEmergencyContactInfo, emergencyContactInfo) => {
        if(passEmergencyContactInfo.phoneDetails?.number && passEmergencyContactInfo.phoneDetails?.number !== '') {
            emergencyContactInfo.phone = passEmergencyContactInfo.phoneDetails.number;
            emergencyContactInfo.phoneDetails = passEmergencyContactInfo.phoneDetails;
        };
    };

    private setPrefixList = (prefixesList, passEmergencyContactInfo, emergencyContactInfo)=> {
        if(Array.isArray(prefixesList)) {
            prefixesList.forEach(prefixInfo => {
                if(prefixInfo.code === passEmergencyContactInfo.phoneDetails.countryCode) {
                    emergencyContactInfo.countryCode = passEmergencyContactInfo.phoneDetails.countryCode;
                    emergencyContactInfo.code = prefixInfo.code;
                }
            });
        };
    };

    private setCompanyFrequentFlyer = (passenger) => {
        let localAux;
        let dataLocal;
        let isSelected;
        let frequentFlyer: any = [];
        localAux = [];
        isSelected = false;
        dataLocal = this.localStorageService.get('frequentFlyersCompanies');
        if (passenger?.additionalFFInfo) {
            frequentFlyer = this.setAdditionalFFInfo(passenger.additionalFFInfo, dataLocal);
        }
        if (passenger?.frequentFlyerInfo) {
            frequentFlyer.unshift(this.setFrequentFlyerInfo(passenger.frequentFlyerInfo, dataLocal));
        }
        localAux = this.localStorageService.get('ffLocal') ? this.localStorageService.get('ffLocal') : [];
        this.setLocalAux(localAux, passenger, isSelected, frequentFlyer);
        this.localStorageService.set('ffLocal', localAux);
        return frequentFlyer;
    };

    private setLocalAux = (localAux, passenger, isSelected, frequentFlyer) => {
        if (localAux.length > 0) {
            for (let x = 0; x < localAux.length; x++) {
                if (localAux[x].id === passenger.passengerId) {
                    isSelected = true;
                    frequentFlyer = localAux[x].allCompany;
                }
            }
            if (!isSelected) {
                localAux.push({
                    id: passenger.passengerId,
                    allCompany: frequentFlyer
                });
            }
            isSelected = false;
        } else {
            localAux.push({
                id: passenger.passengerId,
                allCompany: frequentFlyer
            });
        };
    };

    private setAdditionalFFInfo = (additionalFFInfo, dataLocal) => {
        for (let x = 0; x < additionalFFInfo.length; x++) {
            for (let y = 0; y < dataLocal?.length; y++) {
                if (additionalFFInfo[x].company === dataLocal[y].iataCompanyCode) {
                    additionalFFInfo[x].airlineName = dataLocal[y].airlineName;
                }
            }
        };
        return additionalFFInfo;
    };

    private setFrequentFlyerInfo = (frequentFlyerInfo, dataLocal) => {
        let objectFrequentFlyer;

        objectFrequentFlyer = {};
        for (let q = 0; q < dataLocal?.length; q++) {
            if (frequentFlyerInfo.company === dataLocal[q].iataCompanyCode) {
                objectFrequentFlyer = {
                    airlineName: dataLocal[q].airlineName,
                    company: frequentFlyerInfo.company,
                    number: frequentFlyerInfo.number
                };
            }
        };

        return objectFrequentFlyer;
    };

    private checkQualifierIBV = (getBookingInfo): boolean => {
        let isIBV: boolean = false;
        angular.forEach(getBookingInfo.qualifiers, (qualifier) => {
            if (qualifier.name == 'IBDPHOLIDAYS') {
                isIBV = true;
            };
        });
        return isIBV;
    };

    private generateManagementInfo = (paramsGenerateManagement) => {
        let {itemsByType,getBookingInfo,ancillariesInfo,phonesListIBHolidays,infCheckDay,breakDownInfo} = paramsGenerateManagement;
        const InfoManagement: any = {
            flights: [],
            aviosRedeemed: false,
            aviosRedeemedAmount: 0
        };

        this.initManagementInfoBase(InfoManagement, itemsByType, getBookingInfo);

        const noInfantPass = this.manageNoInfantPass(InfoManagement);
        const countInfants = this.countInfants(InfoManagement.managePassengers.length, noInfantPass.length);
        const flightsSlices = this.manageFlightsSlices(getBookingInfo, InfoManagement);
        const flightsSlicesPriority = flightsSlices;

        this.AncillariesDashboardTransformer.manageAncillariesSeatByBaggageModel(InfoManagement, noInfantPass, flightsSlices, this.transformedInfo);
        InfoManagement.baggageInfo = { baggageInfo: flightsSlices ? flightsSlices : [] };
        this.AncillariesDashboardTransformer.manageAncillariesSeatBySpeqsModel(InfoManagement, flightsSlices, this.transformedInfo);
        InfoManagement.SpeqsInfo = { SpeqsInfo: flightsSlices ? flightsSlices : [] };
        this.localStorageService.set('SpeqsInfo', InfoManagement.SpeqsInfo);
        this.AncillariesDashboardTransformer.manageAncillariesPriorityBoarding(InfoManagement, flightsSlicesPriority);
        this.AncillariesDashboardTransformer.manageAncillariesThirdPartyCompanies(ancillariesInfo, InfoManagement);
        InfoManagement.manageSeats = { flights: InfoManagement.flights ? InfoManagement.flights : [] };

        let printURLs;
        let paramsPackaged = {InfoManagement, phonesListIBHolidays, getBookingInfo, countInfants, flightsSlices, breakDownInfo};
        printURLs = this.AncillariesDashboardTransformer.setPackagedProduct(paramsPackaged);

        this.AncillariesDashboardTransformer.manageHotelInfo(InfoManagement, printURLs?.printVoucherUrlHotel);
        this.AncillariesDashboardTransformer.manageVehicleInfo(InfoManagement, printURLs?.printVoucherUrlVehicle);
        this.AncillariesDashboardTransformer.setManagementInsurances(InfoManagement, getBookingInfo);
        InfoManagement.infoCheckIn = infCheckDay ? infCheckDay : [];
        InfoManagement.manageMeals = this.transformedInfo.managementMeals || { segments: [] };
        this.formatInfoManagementPackages(
            InfoManagement,
            this.getCurrencyFromBooking(getBookingInfo),
            getBookingInfo
        );

        return InfoManagement;
    };

    private initManagementInfoBase = (InfoManagement, itemsByType, getBookingInfo) => {
        InfoManagement.orderItems = angular.copy(itemsByType);
        InfoManagement.managePassengers = this.getApisStatus(getBookingInfo.passengers);
        InfoManagement.related = getBookingInfo.relatedContent;
        InfoManagement.manageFlights = [];
    };
    
    private getCurrencyFromBooking = (getBookingInfo) => {
        if (getBookingInfo?.contextMetadata?.currencies && getBookingInfo.contextMetadata.currencies[0]) {
            return getBookingInfo.contextMetadata.currencies[0];
        }
        return null;
    };

    private manageNoInfantPass = (InfoManagement) => {
        let formatPassType;
        let noInfantPass = [];
        for (let tIndex = 0; tIndex < InfoManagement.managePassengers.length; tIndex++) {
            const passenger = InfoManagement.managePassengers[tIndex];
            formatPassType = passenger.passengerId.replace(this.MmBAppConstants.MmBPatterns.ONLY_LETTERS, '');
            if (formatPassType === this.MmBAppConstants.PASSENGER_TYPES.infant) {
                const relatedInfantPassenger = noInfantPass.filter(noInfant => passenger.relatedPassengerId === noInfant.passengerId)[0];
                if (relatedInfantPassenger) {
                    relatedInfantPassenger.relatedPassengerId = true;
                    relatedInfantPassenger.infant = passenger.personalInfo.name + ' ' + passenger.personalInfo.surname;
                }
            } else {
                noInfantPass.push(InfoManagement.managePassengers[tIndex]);
            }
        }
        return noInfantPass;
    };

    private countInfants = (totalPassengers, totalPassengersNoInfants) => {
        return totalPassengers - totalPassengersNoInfants;
    };

    private manageFlightsSlices = (getBookingInfo, InfoManagement) => {
        let flightsSlices = [];
        for (let tIndex = 0; tIndex < getBookingInfo.order.slices.length; tIndex++) {
            flightsSlices.push(this.transformedInfo.yourFlightsModel.flights[getBookingInfo.order.slices[tIndex].sliceId]);
            for (let sIndex = 0; sIndex < flightsSlices[tIndex].segments.length; sIndex++) {
                flightsSlices[tIndex].segments[sIndex].seats = [];
                flightsSlices[tIndex].qualifierIBV = false;
                this.isQualifierIBV(getBookingInfo, flightsSlices, tIndex);
                InfoManagement.flights.push(flightsSlices[tIndex].segments[sIndex]);
            };
            InfoManagement.manageFlights.push(flightsSlices[tIndex]);
        };
        return flightsSlices;
    };

    private isQualifierIBV = (getBookingInfo, flightsSlices, tIndex) => {
        for (let qualifierIndex = 0; qualifierIndex < getBookingInfo.qualifiers.length; qualifierIndex++) {
            if (getBookingInfo.qualifiers[qualifierIndex].name == 'IBDPHOLIDAYS') {
                flightsSlices[tIndex].qualifierIBV = true;
            };
        };
    };

    private formatInfoManagementPackages = (InfoManagement, currency, getBookingInfo) => {
        if (!InfoManagement?.packages?.length) return;
        const firstPackage = InfoManagement.packages[0];
        if (!firstPackage?.payment?.pending) return;
        const formattedData = this.extractFormattedPaymentData(firstPackage, currency);
        this.applyFormattedDataToPackages(InfoManagement.packages, formattedData, getBookingInfo);
    };

    private extractFormattedPaymentData = (firstPackage, currency) => {
        const priceTotalPending = this.CurrencyService.formatPrice(this.CurrencyService.getCurrencyObject(currency), firstPackage.payment.pending.amount, true);
        const dateFormatPending = this.$filter('DateFormatFilter')(firstPackage.payment.pending.dueDate);
        const commercialInfo = this.localStorageService.get('commercialInfo');

        return { priceTotalPending, dateFormatPending, commercialInfo  };
    };

    private applyFormattedDataToPackages = ( packages, formattedData, getBookingInfo) => {
        angular.forEach(packages, (pendingDate) => {
            pendingDate.payment.pending.symbol = formattedData.commercialInfo?.currency?.symbol ? formattedData.commercialInfo.currency.symbol : '';
            pendingDate.payment.pending.symbolBreakdown = getBookingInfo.contextMetadata.currencies[0] ? getBookingInfo.contextMetadata.currencies[0].symbol : '';
            if (angular.isDefined(formattedData.dateFormatPending)) {
                pendingDate.payment.pending.datePendingFormat = formattedData.dateFormatPending.formatedDate;
            }
            pendingDate.payment.pending.pricePendingFormat = formattedData.priceTotalPending;
        });
    };

    private getApisStatus = (passengerCollection) => {
        return angular.forEach(passengerCollection, (passenger) => {
            if (passenger.externalPersonalInfo) {
                passenger.personalInfo.name = passenger.externalPersonalInfo.name;
                passenger.personalInfo.surname = passenger.externalPersonalInfo.firstSurname + ' ' + passenger.externalPersonalInfo.lastSurname;
            }
            if (passenger.securityInformation && passenger.securityInformation.relatedContent) {
                return angular.forEach(passenger.securityInformation.relatedContent, (item) => {
                    if (item.key === this.MmBAppConstants.APIS_STATUS.APIS_STATUS_INFO)
                        passenger.securityInformation.apisStatus = item.value;
                });
            }
        });
    };

    private generateCompleteYourTripInfoStopOver = (qualifiers): boolean => {
        return qualifiers.some(
            qualifier => qualifier.name === this.BookingDashboardConstants.QUALIFIERS.HOLA_MADRID
        );
    };

    private generateSeatBid = (getBookingInfo) => {
        const seatBid: any = {};

        if (getBookingInfo?.upgInformation && getBookingInfo?.upgInformation?.bidable) {
            seatBid.url = getBookingInfo.upgInformation.url ? getBookingInfo.upgInformation.url : null;
            seatBid.bidable = getBookingInfo.upgInformation.url ? getBookingInfo.upgInformation.url : false;
        };
        return seatBid;
    };

    private generateBidableInfo = () => {
        const bidableInfo = { isEnabled: false, info: {} };
        bidableInfo.info = {
            colSize: this.BookingDashboardConstants.BOX_COL_SIZES.EXTRALARGE,
            boxSize: this.BookingDashboardConstants.BOX_LINK_SIZES.FULL,
            icon: this.BookingDashboardConstants.BOX_LINK_ICONS.AUCTION,
            linkId: this.BookingDashboardConstants.BOX_LINKS_TYPES.BIDABLE,
            text: {
                title: 'MODULES_LINK_SEAT_AUCTION_TEXT',
                subtitle: 'MODULES_LINK_GET_BETTER_SEAT_TEXT',
                accessibilityText: 'MODULES_LINK_GET_BETTER_SEAT_TEXT'
            }
        };
        bidableInfo.isEnabled = true;
        //}
        return bidableInfo;
    };

    private generateContactInfo = (contactInfo) => {
        const prefixMarket = this.MmBUtilsSharedService.getPrefixFromMarket();
        const returnContactInfo = contactInfo ? contactInfo : {};

        if(!returnContactInfo.countryCode) {
            returnContactInfo.countryCode = prefixMarket.code;
        };
        if(!returnContactInfo.language) {
            returnContactInfo.language = prefixMarket.countryCode.toLowerCase();
        };

        return returnContactInfo;
    };

    private generatePrimaryContactInfo = (primaryContactInfo) => {
        const prefixMarket = this.MmBUtilsSharedService.getPrefixFromMarket();

        if(!primaryContactInfo?.countryCode) {
            primaryContactInfo.countryCode = prefixMarket.code;
        };

        if (primaryContactInfo?.refundEmail) primaryContactInfo.lowerCaseEmail = primaryContactInfo.refundEmail.toLowerCase();

        return primaryContactInfo;
    };

    private statusSVAN = (formatValue) => {
        const result = formatValue.status, SVAN_STATUS = this.MmBAppConstants.SPECIAL_NEEDS.SVAN_STATUS;
        switch (formatValue.status.code) {
                case SVAN_STATUS.HK.code:
                case SVAN_STATUS.KK.code:
                    result.description = SVAN_STATUS.KK.description;
                    break;
                case SVAN_STATUS.UC.code:
                case SVAN_STATUS.UN.code:
                    result.description = SVAN_STATUS.UN.description;
                    break;
                default:
                    result.description = SVAN_STATUS.DEFAULT.description;
                    break;
        };

        return result;
    };
};