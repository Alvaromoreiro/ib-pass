import dayjs from 'dayjs';
import { ImportOrderDataClass } from '../ib-import-order-data-class-model';
import { MmBUtilsSharedService } from '@src/components/services/Utils/ib-MmB-utils-shared-service';

@Service('ib-availability-service', ['MmBUtilService', 'CallAvailabilityUnifiedService', 'MmBModalService', 'CallRibbonflexibleService', 'VoluntaryChangesTransformer', 'localStorageService', '$filter', 'IbFlexFlexibilizationTransformer', '$q', 'AvailabilityDataClass', 'ImportOrderDataClass', 'DisruptionUtilService', 'MmBUtilsSharedService'])
export class AvailabilityUnifiedService implements IAvailabilityServiceStrat {
    constructor (private MmBUtilService, private CallAvailabilityUnifiedService, private MmBModalService, private CallRibbonflexibleService, private VoluntaryChangesTransformer,
        private localStorageService:angular.local.storage.ILocalStorageService, private $filter, private IbFlexFlexibilizationTransformer, private $q: ng.IQService, private AvailabilityDataClass:AvailabilityData.AvailabilityDataClass, private ImportOrderDataClass: ImportOrderDataClass, private DisruptionUtilService, private MmBUtilsSharedService: MmBUtilsSharedService) {
    }
    private flights;
    private numberFlights:number;
    private slicesId:string[];
    private defer = this.$q.defer();
    private bookingData:ImportOrderData.completeOrder;
    private dateRange:number;

    /**
    * Calls availability service and returns promise
    * @param {availabilityRequ} request
    * @returns {angular.IPromise<AvailabilityData.CompleteAvailability>}
    */
    availability = (request: AvailabilityData.availabilityRequest): angular.IPromise<unknown> => {
        return this.unifiedInterceptorService(this.CallAvailabilityUnifiedService.getAvailabilityUnified(request));
    };

    /**
     *
     * @returns {AvailabilityData.availabilityRequest}
     */
    generateRequest = (flights: any[], flowId: string, sisterCityModel, date?:string): AvailabilityData.availabilityRequest => {
        this.flights = flights;
        if (date) {
            flights[0].newDateSelected = date;
        }
        return this.MmBUtilsSharedService.generateRequestFlexibilization(flights, flowId, sisterCityModel);
    };

    generateModalObject = (data:AvailabilityData.CompleteAvailability):unknown => {
        const modalData = {
            availabilityData: data,
            modelRibbon: null,
            selectedSlide: null
        };
        let model:AvailabilityData.modelRibbonFlights, availability;
        this.bookingData = this.localStorageService.get('bookingInfo');
        this.dateRange = this.DisruptionUtilService.getDateRange(this.bookingData.genericDisruptionCapabilitiesInformation);
        model = this.generateFlightsModel();
        this.loadFlightsData(this.flights);
        const modelFlight = this.IbFlexFlexibilizationTransformer.getModelFlighVC(model, this.slicesId, this.numberFlights);
        this.VoluntaryChangesTransformer.searchFlights(model, modelFlight);
        modalData.modelRibbon = this.VoluntaryChangesTransformer.generateFlightsModelRibbon(this.getAvailabilityOrigins(modalData.availabilityData.originDestinations, model.flights), model.flights);
        modalData.modelRibbon = this.limitCalendarRibbon(modalData.modelRibbon);
        (modalData.modelRibbon as modelRibbon).flights = this.flights;
        availability = modalData.availabilityData;
        availability.modeFlight = modelFlight;
        return {availability, modelRibbon: modalData.modelRibbon, selectedSlide: this.generateSelectedSlice(this.flights)};
    };

    private limitCalendarRibbon (modelRibbon) {
        let optionalData:OptionalData = null;

        optionalData = this.localStorageService.get('unifiedOptionalData');
        return modelRibbon.map(ribbon => {
            let code = Object.keys(this.flights).filter(flight => {
                let valid = false;
                if(optionalData && !optionalData.enabled) {
                    if(this.bookingData.order.slices[0].sliceId === optionalData.sliceId) {
                        //Optional es ida
                        valid = flight === this.bookingData.order.slices[1].sliceId;
                    } else {
                        //Optional es vuelta
                        valid = flight === this.bookingData.order.slices[0].sliceId;
                    }
                }else {
                    valid = this.flights[flight].index === ribbon.arrIndex;
                }
                return valid;
            })[0];
            if(!code){
                code = Object.keys(this.flights)[0];
            }
            const dateTocheck = this.flights[code].originalOD ? this.flights[code].originalOD.departureDateTime : this.flights[code].dateOptions.initDate;
            ribbon.calendarData.maxDate = this.DisruptionUtilService.checkDates(dateTocheck) ? new Date(dayjs(ribbon.calendarData.minDate).add(2, 'day').toString()) : this.flights[code].dateOptions.maxDate;
            ribbon.calendarData.minDate = this.flights[code].dateOptions.minDate;

            ribbon.calendarData.slides.map(slide => {
                return this.updateSlide(slide, ribbon.calendarData.minDate, ribbon.calendarData.maxDate);
            });
            ribbon.calendarData.currentSlides.map(slide => {
                return this.updateSlide(slide, ribbon.calendarData.minDate, ribbon.calendarData.maxDate);
            });
            return ribbon;
        });
    }

    private updateSlide (slide, minDate, maxDate) {
        if(this.getFlatDate(new Date(slide.serviceDate)) < this.getFlatDate(minDate)
        || this.getFlatDate(new Date(slide.serviceDate)) > this.getFlatDate(maxDate)) {
            slide.state = 'DISABLED';
        }
        return slide;
    }

    private getFlatDate (date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    private getAvailabilityOrigins = (availabilityData, flights) => {
        let originDestination;
        if(availabilityData.length > 1){
            return availabilityData.filter( (oriDes) => {
                originDestination = oriDes;
                return Object.keys(flights).filter((flight) => {
                    return originDestination.originDestinationId.substring(2) === (flights[flight].sliceType+1).toString();
                }).map((flight)=>{
                    return flights[flight].checked;
                })[0];
            });
        }else {
            return availabilityData;
        }

    };

    callModalService = (modalObject:unknown):angular.IPromise<unknown> => {
        this.localStorageService.remove('manualCloseVCModal');
        return this.MmBModalService.showVoluntaryChangeModal(false, 'ib-MmB-voluntary-changes-view.html', modalObject).result;
    };

    private unifiedInterceptorService = (promise: angular.IPromise<AvailabilityData.CompleteAvailability>):angular.IPromise<unknown> => {
        this.defer = this.$q.defer();
        promise.then(this.setUnifiedOfferType, this.simpleReject);
        return this.defer.promise;
    };

    private setUnifiedOfferType = (data:AvailabilityData.CompleteAvailability) => {
        const dataTransformed = data;
        dataTransformed.offers.map( (offer:unknown) => {
            return (offer as ImportOrderData.offer).offerType = 'UNIFIED';
        });
        this.defer.resolve(dataTransformed);
    };

    private simpleReject = (error) => {
        this.defer.reject(error);
    };

    private generateSelectedSlice = (flights) => {
        const returnValue:SelectedSlideModal[] = [];
        Object.keys(flights).map((flight)=>{
            returnValue.push(new SelectedSlideModal(flights[flight]));
            return flight;
        });
        return returnValue;
    };

    private loadFlightsData (flights) {
        let sliceId, numberFlights:number, slicesId:string[];
        slicesId = [];
        Object.keys(flights).map((flight)=>{
            slicesId.push(flight);
            return flight;
        });
        numberFlights = Object.keys(flights).length;
        for (sliceId in flights) {
            if (flights.hasOwnProperty(sliceId)) {
                if (numberFlights > 1) {
                    if (new Date(flights[sliceId].departureDateParsed.originalDate) < new Date(flights[slicesId[0]].departureDateParsed.originalDate)) {
                        slicesId[1] = slicesId[0];
                        slicesId[0] = sliceId;
                    } else {
                        slicesId[1] = sliceId;
                    }
                } else {
                    slicesId[0] = sliceId;
                }
            }
        }
        this.numberFlights = numberFlights;
        this.slicesId = slicesId;
    }

    private generateFlightsModel = (): AvailabilityData.modelRibbonFlights => {
        const flightList:AvailabilityData.modelRibbonFlights = {flights : {}};
        const optionalData:OptionalData = this.localStorageService.get('unifiedOptionalData');
        this.DisruptionUtilService.searchSlices(this.bookingData.order, this.DisruptionUtilService.criteriaFlightSearchEnabled).map((slice, index) => {
            const obj:AvailabilityData.IFlight = new this.AvailabilityDataClass.flight();
            let segment:SegmentData.ISegmentAVModel;
            const extSliceId = slice.sliceId;
            const arrivalSegment = slice.segments[slice.segments.length - 1].relatedDisruptedSegmentId ? this._getDisruptedSegmentData(slice, 'ARRIVAL') : slice.segments[slice.segments.length - 1];
            const departureSegment = slice.segments[0].relatedDisruptedSegmentId ? this._getDisruptedSegmentData(slice, 'DEPARTURE') : slice.segments[0];
            obj.arrivalCity = arrivalSegment.arrival;
            obj.arrivalCountry = arrivalSegment.arrivalCity.countryCode;
            obj.arrivalDateParsed = this.ImportOrderDataClass.SegmentAVModel.getParsedDate(slice.arrivalDateTime);
            obj.changeNewDate = this.flights[extSliceId].newDateSelected ? this.flights[extSliceId].newDateSelected : null;
            obj.checked = optionalData && optionalData.sliceId === slice.sliceId ? optionalData.enabled : true;
            obj.dateOptions = new this.AvailabilityDataClass.dateOptions();
            obj.daysToGo = dayjs(departureSegment.departureDateTime).diff(dayjs(new Date().toDateString(), 'YYYYMMDD HH:mm'), 'day');
            obj.departureCity = departureSegment.departure;
            obj.departureCountry = departureSegment.departureCity.countryCode;
            obj.departureDateParsed = this.ImportOrderDataClass.SegmentAVModel.getParsedDate(slice.departureDateTime);
            obj.durationParsed = this.AvailabilityDataClass.flight.getTimeParsed(slice.duration);
            obj.newDateSelected = this.flights[extSliceId].newDateSelected ? this.flights[extSliceId].newDateSelected : null;
            obj.parseNewDate = obj.newDateSelected ? new this.AvailabilityDataClass.parseNewDate(obj.newDateSelected) : null;
            obj.parseNewDateSelected = obj.changeNewDate ? new this.AvailabilityDataClass.parseNewDate(obj.changeNewDate) : null;
            obj.segments = [];
            obj.setSliceType(index);
            slice.segments.map((segm) => {
                segment = new this.ImportOrderDataClass.SegmentAVModel();
                segment.arrivalCity = segm.arrivalCity;
                segment.arrivalDateParsed = this.ImportOrderDataClass.SegmentAVModel.getParsedDate(segm.arrivalDateTime);
                segment.arrivalDateTimeParsed = segm.arrivalDateTime.split(' ')[1];
                segment.cabin =  DefaultFareFamily;
                segment.companyURL = this.MmBUtilService.getCompanyURL(segm.flight.operationalCarrier.code);
                segment.departure = segm.departure;
                segment.departureCity = segm.departureCity;
                segment.departureDateParsed = this.ImportOrderDataClass.SegmentAVModel.getParsedDate(segm.departureDateTime);
                segment.departureDateTimeParsed = segm.departureDateTime.split(' ')[1];
                segment.durationParsed =  this.AvailabilityDataClass.flight.getTimeParsed(segm.duration);
                segment.setParsedFamilyCondition(this.bookingData.fareFamilyConditions);
                segment.flight = segm.flight;
                segment.flown = segm.flown;
                segment.overnight = segm.overnight;
                segment.segmentId = segm.id;
                segment.sliceId = slice.sliceId;
                segment.status = segm.status;
                segment.stop = segm.stop;
                segment.waitingTimeParsed = this.$filter('DurationFormatFilter')(segm.waitingTime);
                segment.warnings = [];
                obj.segments.push(segment);
                return segm;
            });
            obj.stopsNumber = slice.stopsNumber;
            obj.originalSliceId = slice.sliceId;
            flightList.flights[extSliceId] = obj;
            return slice;
        });
        return flightList;
    };

    setBookingInfo (booking:ImportOrderData.completeOrder) {

    }

    private _getDisruptedSegmentData(slice, type: 'DEPARTURE' | 'ARRIVAL'): any {
        const disruptedSegment = slice.segments.filter(s => s.status.code === 'UN');
        return type === 'DEPARTURE' ? disruptedSegment [0] : disruptedSegment[disruptedSegment.length -1];
    }

}

type OptionalData = {
    sliceId:string
    enabled:boolean
};

class SelectedSlideModal {
    date:DateSelectedSlideModal;
    index:string;
    constructor (flight) {
        this.index = flight.index === 1 ? 'OD2' : 'OD1';
        this.date = new DateSelectedSlideModal(flight);
    }
}

class DateSelectedSlideModal {
    serviceDate:string;
    slidePosition: number;
    date: AvailabilityData.IParseNewDate;
    constructor (flight) {
        this.serviceDate = flight.parseNewDateSelected ? flight.parseNewDateSelected.year + '-' + flight.parseNewDateSelected.month + '-' + flight.parseNewDateSelected.day : null;
        this.slidePosition = 1;
        this.date = flight.parseNewDateSelected;

    }
}
const DefaultFareFamily = {
    rbd: 'E',
    description: '',
    fareFamily: 'COTCLESEU',
    code: 'E',
    type: 'ECONOMY',
    bookingClass: 'ECONOMY'
};
